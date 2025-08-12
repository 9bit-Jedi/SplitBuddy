from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal, InvalidOperation
from collections import defaultdict

from .models import Expense, ExpenseSplit  # adjust if needed
from groups.models import Group
from .serializers import ExpenseSerializer, ExpenseDetailSerializer
from .utils import get_money_from_data

class ExpenseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        """
        Expected payload:
        {
          "group": <group_id>,
          "description": "...",     # optional
          "amount": 100.00,
          "currency": "INR",
          "category": "travel",
          "paid_by": "<optional user uuid>",
          "splits": [
              {"user_id": "<uuid>", "amount": "40.00"},
              {"user_id": "<uuid>", "amount": "60.00"}
          ]
        }
        """
        data = request.data
        group_id = data.get('group')
        group = get_object_or_404(Group, id=group_id, members=request.user)
        paid_by = data.get('paid_by') or str(request.user.id)
        
        # Validate payer membership
        if not group.members.filter(id=paid_by).exists():
            return Response({'detail': 'paid_by not in group'}, status=status.HTTP_400_BAD_REQUEST)

        data['amount'] = get_money_from_data(data['amount'], data['currency'], allow_zero=False)

        # Use serializer for base fields if available
        serializer = ExpenseSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        expense = serializer.save(paid_by_id=paid_by, group=group)
        splits = data.get('splits', [])
        if not splits:
            # Equal split among all members if not provided
            member_ids = list(group.members.values_list('id', flat=True))
            per = (expense.amount / len(member_ids)) if member_ids else Decimal('0')
            for uid in member_ids:
                ExpenseSplit.objects.create(expense=expense, user_id=uid, amount_owed=per)
        else:
            total_split = Decimal('0')
            for s in splits:
                try:
                    amt = Decimal(str(s.get('amount')))
                except (InvalidOperation, TypeError):
                    return Response({'detail': 'Invalid split amount'}, status=status.HTTP_400_BAD_REQUEST)
                uid = s.get('user_id')
                if not group.members.filter(id=uid).exists():
                    return Response({'detail': f'user {uid} not in group'}, status=status.HTTP_400_BAD_REQUEST)
                total_split += amt
                ExpenseSplit.objects.create(expense=expense, user_id=uid, amount_owed=amt)
            if total_split != expense.amount:
                raise transaction.TransactionManagementError("Split total mismatch")
        return Response(ExpenseDetailSerializer(expense).data, status=status.HTTP_201_CREATED)

class GroupExpenseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id, members=request.user)
        expenses = Expense.objects.filter(group=group).order_by('-id')[:100]
        data = ExpenseDetailSerializer(expenses, many=True).data
        return Response({'group_id': group.id, 'expenses': data})

class ExpenseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        expense = get_object_or_404(Expense, id=pk)
        if not Group.objects.filter(id=expense.group_id, members=request.user).exists():
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ExpenseDetailSerializer(expense).data)

class ExpenseSettleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        expense = get_object_or_404(Expense, id=pk)
        if not Group.objects.filter(id=expense.group_id, members=request.user).exists():
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        # Simple settle: mark all splits for current user as settled
        updated = ExpenseSplit.objects.filter(expense=expense, user=request.user, settled=False).update(settled=True)
        return Response({'detail': 'Settled', 'splits_updated': updated})

class GroupSettlementCreateView(APIView):
    """
    POST create a manual settlement payment:
    {
      "paid_to": "<user_uuid>",
      "amount": "25.50"
    }
    paid_by = current user
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        group = get_object_or_404(Group, id=pk, members=request.user)
        paid_to = request.data.get('paid_to')
        amount_raw = request.data.get('amount')
        try:
            amount = Decimal(str(amount_raw))
        except (InvalidOperation, TypeError):
            return Response({'detail': 'Invalid amount'}, status=400)
        if amount <= 0:
            return Response({'detail': 'Amount must be positive'}, status=400)
        if not group.members.filter(id=paid_to).exists():
            return Response({'detail': 'paid_to not in group'}, status=400)

        # Compute current net balances
        balances = _compute_group_net_balances(group)
        payer_id = str(request.user.id)
        payee_id = str(paid_to)
        if balances.get(payer_id, Decimal('0')) >= 0:
            return Response({'detail': 'You do not owe money'}, status=400)
        if balances.get(payee_id, Decimal('0')) <= 0:
            return Response({'detail': 'Recipient is not a creditor'}, status=400)
        max_payable = min(-balances[payer_id], balances[payee_id])
        if amount > max_payable:
            return Response({'detail': f'Amount exceeds permissible ({max_payable})'}, status=400)

        # Represent settlement as a zero-amount expense with two splits (negative / positive)
        settlement = Expense.objects.create(
            group=group,
            description='Settlement payment',
            amount=amount,
            category='Settlement',
            paid_by_id=payer_id
        )
        ExpenseSplit.objects.create(expense=settlement, user_id=payer_id, amount_owed=Decimal('0'))
        ExpenseSplit.objects.create(expense=settlement, user_id=payee_id, amount_owed=Decimal('0'))
        return Response({'detail': 'Settlement recorded', 'settlement_expense_id': settlement.id}, status=201)

def _compute_group_net_balances(group):
    """
    Returns dict {user_id(str): Decimal net}
    net > 0 => user is owed money (creditor)
    net < 0 => user owes money (debtor)
    """
    expenses = Expense.objects.filter(group=group).select_related('paid_by')
    paid_totals = defaultdict(Decimal)
    owed_totals = defaultdict(Decimal)
    for e in expenses:
        paid_totals[str(e.paid_by_id)] += Decimal(e.amount)
        for split in e.splits.all():
            paid_val = split.amount_owed
            owed_totals[str(split.user_id)] += Decimal(paid_val.amount) if hasattr(paid_val, 'amount') else Decimal(paid_val)
    balances = {}
    member_ids = [str(uid) for uid in group.members.values_list('id', flat=True)]
    for uid in member_ids:
        balances[uid] = paid_totals.get(uid, Decimal('0')) - owed_totals.get(uid, Decimal('0'))
    return balances

class GroupDebtSimplifyView(APIView):
    """
    GET -> returns minimal set of payments to settle all debts:
    {
      "payments": [
         {"from": "<debtor_uuid>", "to": "<creditor_uuid>", "amount": "12.34"},
         ...
      ]
    }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        group = get_object_or_404(Group, id=pk, members=request.user)
        balances = _compute_group_net_balances(group)
        debtors = []
        creditors = []
        for uid, net in balances.items():
            if net < 0:
                debtors.append([uid, -net])  # store positive owed
            elif net > 0:
                creditors.append([uid, net])
        debtors.sort(key=lambda x: x[1], reverse=True)
        creditors.sort(key=lambda x: x[1], reverse=True)
        i = j = 0
        payments = []
        while i < len(debtors) and j < len(creditors):
            d_uid, d_amt = debtors[i]
            c_uid, c_amt = creditors[j]
            pay = min(d_amt, c_amt)
            payments.append({'from': d_uid, 'to': c_uid, 'amount': str(pay.quantize(Decimal('0.01')))})
            d_amt -= pay
            c_amt -= pay
            debtors[i][1] = d_amt
            creditors[j][1] = c_amt
            if d_amt == 0:
                i += 1
            if c_amt == 0:
                j += 1
        return Response({'group_id': group.id, 'payments': payments})
