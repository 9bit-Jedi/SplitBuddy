from rest_framework import serializers
from .models import Expense, ExpenseSplit
from rest_framework_money_field import MoneyField
from moneyed import Money

class ExpenseSplitSerializer(serializers.ModelSerializer):
    amount_owed = MoneyField()
    user = serializers.StringRelatedField()

    class Meta:
        model = ExpenseSplit
        fields = ['id', 'user', 'amount_owed']
        read_only_fields = ['id']

class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True, write_only=True, required=False)
    paid_by = serializers.PrimaryKeyRelatedField(read_only=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    currency = serializers.CharField(write_only=True)
    amount = MoneyField(read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'group', 'description', 'amount', 'currency', 'category', 'paid_by', 'splits']
        read_only_fields = ['id', 'paid_by', 'amount']
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True}
        }

    def create(self, validated_data):
        splits_data = validated_data.pop('splits', [])
        amount = validated_data.pop('amount')
        currency = validated_data.pop('currency')
        validated_data['amount'] = Money(amount, currency)
        expense = Expense.objects.create(**validated_data)
        for s in splits_data:
            ExpenseSplit.objects.create(expense=expense, **s)
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
