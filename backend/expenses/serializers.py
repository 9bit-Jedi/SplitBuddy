from django.db import transaction
from djmoney.money import Money
from rest_framework import serializers

from .models import Expense, ExpenseSplit


class MoneyFieldSerializer(serializers.Field):
    def to_representation(self, value: Money):
        if value is None:
            return None
        return {"amount": str(value.amount), "currency": value.currency.code}

    def to_internal_value(self, data):
        try:
            amount = data.get("amount")
            currency = data.get("currency")
            if amount is None or currency is None:
                raise serializers.ValidationError(
                    "Both 'amount' and 'currency' are required."
                )
            return Money(amount, currency)
        except Exception as e:
            raise serializers.ValidationError(f"Invalid money format: {e}")


class ExpenseSplitSerializer(serializers.ModelSerializer):
    amount_owed = MoneyFieldSerializer()
    user = serializers.StringRelatedField()

    class Meta:
        model = ExpenseSplit
        fields = ["id", "user", "amount_owed"]
        read_only_fields = ["id"]


class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True, required=False)
    paid_by = serializers.PrimaryKeyRelatedField(read_only=True)
    amount = MoneyFieldSerializer()

    class Meta:
        model = Expense
        fields = [
            "id",
            "group",
            "description",
            "amount",
            "category",
            "paid_by",
            "splits",
        ]
        read_only_fields = ["id", "paid_by"]
        extra_kwargs = {"description": {"required": False, "allow_blank": True}}

    def validate(self, data):
        if self.instance:
            return data

        splits = data.get("splits", [])
        amount = data.get("amount")

        if not splits:
            return data

        total_split_amount = sum(s["amount_owed"].amount for s in splits)
        if total_split_amount != amount.amount:
            raise serializers.ValidationError(
                "The sum of splits must be equal to the expense amount."
            )

        return data

    @transaction.atomic
    def create(self, validated_data):
        splits_data = validated_data.pop("splits", [])
        expense = Expense.objects.create(**validated_data)

        if not splits_data:
            group = expense.group
            members = group.members.all()
            if members.exists():
                amount_per_member = expense.amount / len(members)
                for member in members:
                    ExpenseSplit.objects.create(
                        expense=expense,
                        user=member,
                        amount_owed=amount_per_member,
                    )
        else:
            for split_data in splits_data:
                ExpenseSplit.objects.create(expense=expense, **split_data)

        return expense


class ExpenseDetailSerializer(ExpenseSerializer):
    splits = ExpenseSplitSerializer(many=True, read_only=True)
    paid_by = serializers.StringRelatedField()
    amount = MoneyFieldSerializer()

    class Meta(ExpenseSerializer.Meta):
        fields = [
            "id",
            "group",
            "description",
            "amount",
            "category",
            "paid_by",
            "splits",
            "date_added",
        ]


class UserCategoryExpenseSerializer(serializers.Serializer):
    category = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
