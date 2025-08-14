from rest_framework import serializers
from .models import Expense, ExpenseSplit
from rest_framework_money_field import MoneyField
from moneyed import Money
from django.db import transaction
from decimal import Decimal, InvalidOperation

class ExpenseSplitSerializer(serializers.ModelSerializer):
    amount_owed = MoneyField()
    user = serializers.StringRelatedField()

    class Meta:
        model = ExpenseSplit
        fields = ['id', 'user', 'amount_owed']
        read_only_fields = ['id']

class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True, required=False)
    paid_by = serializers.PrimaryKeyRelatedField(read_only=True)
    amount_decimal = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True, source='amount')
    currency = serializers.CharField(write_only=True)
    amount = MoneyField(read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'group', 'description', 'amount', 'amount_decimal', 'currency', 'category', 'paid_by', 'splits']
        read_only_fields = ['id', 'paid_by', 'amount']
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True}
        }

    def validate(self, data):
        if self.instance:
            return data

        splits = data.get('splits', [])
        amount = data.get('amount')
        currency = data.get('currency')
        money_amount = Money(amount, currency)

        if not splits:
            return data

        total_split = sum(s['amount_owed'] for s in splits)
        if total_split != money_amount:
            raise serializers.ValidationError("The sum of splits must be equal to the expense amount.")

        return data

    @transaction.atomic
    def create(self, validated_data):
        splits_data = validated_data.pop('splits', [])
        amount = validated_data.pop('amount')
        currency = validated_data.pop('currency')
        validated_data['amount'] = Money(amount, currency)
        expense = Expense.objects.create(**validated_data)

        if not splits_data:
            group = expense.group
            members = group.members.all()
            if members.exists():
                amount_per_member = expense.amount / len(members)
                for member in members:
                    ExpenseSplit.objects.create(expense=expense, user=member, amount_owed=amount_per_member)
        else:
            for split_data in splits_data:
                ExpenseSplit.objects.create(expense=expense, **split_data)

        return expense

class ExpenseDetailSerializer(ExpenseSerializer):
    splits = ExpenseSplitSerializer(many=True, read_only=True)
    paid_by = serializers.StringRelatedField()
    amount = MoneyField()
    
    class Meta(ExpenseSerializer.Meta):
        fields = ['id', 'group', 'description', 'amount', 'category', 'paid_by', 'splits', 'date_added']
        read_only_fields = ['id', 'paid_by', 'amount']

class UserCategoryExpenseSerializer(serializers.Serializer):
    category = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)