# from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal, InvalidOperation

from django.core.cache import cache
from django.db import transaction
from django.db.models import DecimalField, F, Sum
from django.db.models.functions import Coalesce, TruncDay, TruncMonth
from django.shortcuts import get_object_or_404
from django.utils import timezone
from groups.models import Group
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Expense, ExpenseSplit
from .serializers import ExpenseDetailSerializer, ExpenseSerializer


class UserMonthlyExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        twelve_months_ago = timezone.now().date() - timedelta(days=365)

        # First get expense IDs that match the date criteria
        expense_ids = Expense.objects.filter(
            date_added__gte=twelve_months_ago
        ).values_list("id", flat=True)

        # Then filter ExpenseSplits using those IDs
        monthly_expenses = (
            ExpenseSplit.objects.filter(user=user, expense__id__in=expense_ids)
            .annotate(month=TruncMonth("expense__date_added"))
            .values("month")
            .annotate(total=Sum("amount_owed"))
            .order_by("month")
        )

        # Create a dictionary to hold the results for easy lookup
        expenses_dict = {
            item["month"].strftime("%b"): item["total"] for item in monthly_expenses
        }

        # Create a list of the last 12 months
        months = []
        today = date.today()
        for i in range(12):
            month_date = today - timedelta(days=i * 30)
            months.append(month_date.strftime("%b"))

        months.reverse()

        # Prepare the final response
        response_data = []
        for month_abbr in months:
            response_data.append(
                {
                    "month": month_abbr,
                    "total": expenses_dict.get(month_abbr, Decimal("0.00")),
                }
            )

        return Response(response_data)


class UserCategoryExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        category_expenses = (
            Expense.objects.filter(splits__user=user)
            .values("category")
            .annotate(total=Sum("splits__amount_owed"))
            .order_by("-total")
        )

        return Response(category_expenses)


class UserDailyExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        thirty_days_ago = timezone.now().date() - timedelta(days=30)

        daily_expenses = (
            ExpenseSplit.objects.filter(
                user=user, expense__date_added__gte=thirty_days_ago
            )
            .annotate(day=TruncDay("expense__date_added"))
            .values("day")
            .annotate(total=Sum("amount_owed"))
            .order_by("day")
        )

        response_data = []
        for item in daily_expenses:
            expense_date = item["day"].date()
            response_data.append(
                {
                    "_id": {
                        "month": expense_date.month,
                        "date": expense_date.day,
                    },
                    "amount": item["total"],
                }
            )

        return Response(response_data)


class ExpenseCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExpenseSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            expense = serializer.save(paid_by=request.user)
            # Invalidate cache
            cache.delete(f"group:{expense.group.id}:balances")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupExpenseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id, members=request.user)
        expenses = Expense.objects.filter(group=group).order_by("-id")[:100]
        data = ExpenseDetailSerializer(expenses, many=True).data
        return Response({"group_id": group.id, "expenses": data})


class ExpenseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        expense = get_object_or_404(Expense, id=pk)
        if not Group.objects.filter(id=expense.group_id, members=request.user).exists():
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(ExpenseDetailSerializer(expense).data)


class ExpenseSettleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        expense = get_object_or_404(Expense, id=pk)
        if not Group.objects.filter(id=expense.group_id, members=request.user).exists():
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        # Simple settle: mark all splits for current user as settled
        updated = ExpenseSplit.objects.filter(
            expense=expense, user=request.user, settled=False
        ).update(settled=True)
        if updated > 0:
            cache.delete(f"group:{expense.group.id}:balances")
        return Response({"detail": "Settled", "splits_updated": updated})


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
        paid_to = request.data.get("paid_to")
        amount_raw = request.data.get("amount")
        try:
            amount = Decimal(str(amount_raw))
        except (InvalidOperation, TypeError):
            return Response({"detail": "Invalid amount"}, status=400)
        if amount <= 0:
            return Response({"detail": "Amount must be positive"}, status=400)
        if not group.members.filter(id=paid_to).exists():
            return Response({"detail": "paid_to not in group"}, status=400)

        # Compute current net balances
        balances = _compute_group_net_balances(group)
        payer_id = str(request.user.id)
        payee_id = str(paid_to)
        if balances.get(payer_id, Decimal("0")) >= 0:
            return Response({"detail": "You do not owe money"}, status=400)
        if balances.get(payee_id, Decimal("0")) <= 0:
            return Response({"detail": "Recipient is not a creditor"}, status=400)
        max_payable = min(-balances[payer_id], balances[payee_id])
        if amount > max_payable:
            return Response(
                {"detail": f"Amount exceeds permissible ({max_payable})"},
                status=400,
            )

        # Represent settlement as a zero-amount expense
        settlement = Expense.objects.create(
            group=group,
            description="Settlement payment",
            amount=amount,
            category="Settlement",
            paid_by_id=payer_id,
        )
        ExpenseSplit.objects.create(
            expense=settlement, user_id=payer_id, amount_owed=Decimal("0")
        )
        ExpenseSplit.objects.create(
            expense=settlement, user_id=payee_id, amount_owed=Decimal("0")
        )

        # Invalidate cache
        cache.delete(f"group:{group.id}:balances")

        return Response(
            {
                "detail": "Settlement recorded",
                "settlement_expense_id": settlement.id,
            },
            status=201,
        )


def _compute_group_net_balances(group):
    """
    Returns dict {user_id(str): Decimal net}
    net > 0 => user is owed money (creditor)
    net < 0 => user owes money (debtor)
    """
    balances_data = group.members.annotate(
        total_paid=Coalesce(
            Sum("expenses_paid__amount", filter=F("expenses_paid__group") == group),
            Decimal("0.0"),
            output_field=DecimalField(),
        ),
        total_owed=Coalesce(
            Sum(
                "expense_splits__amount_owed",
                filter=F("expense_splits__expense__group") == group,
            ),
            Decimal("0.0"),
            output_field=DecimalField(),
        ),
    ).annotate(net_balance=F("total_paid") - F("total_owed"))

    balances = {str(member.id): member.net_balance for member in balances_data}

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

        cache_key = f"group:{pk}:balances"
        balances = cache.get(cache_key)
        if balances is None:
            balances = _compute_group_net_balances(group)
            cache.set(cache_key, balances, timeout=3600)

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
            payments.append(
                {
                    "from": d_uid,
                    "to": c_uid,
                    "amount": str(pay.quantize(Decimal("0.01"))),
                }
            )
            d_amt -= pay
            c_amt -= pay
            debtors[i][1] = d_amt
            creditors[j][1] = c_amt
            if d_amt == 0:
                i += 1
            if c_amt == 0:
                j += 1
        return Response({"group_id": group.id, "payments": payments})
