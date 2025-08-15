from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db.models import Sum
from expenses.serializers import MoneyFieldSerializer
from rest_framework import serializers

from .models import Group

User = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    budget = MoneyFieldSerializer(required=False)

    class Meta:
        model = Group
        fields = ["id", "name", "description", "currency", "budget"]


class GroupDetailSerializer(GroupSerializer):
    members = serializers.SerializerMethodField()

    class Meta(GroupSerializer.Meta):
        fields = GroupSerializer.Meta.fields + ["members", "created_at"]

    def get_members(self, obj):
        memberships = obj.membership_set.select_related("user")
        return [
            {"id": m.user.id, "username": m.user.username, "role": m.role}
            for m in memberships
        ]


class GroupListSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    user_balance = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "id",
            "name",
            "description",
            "currency",
            "member_count",
            "members",
            "user_balance",
            "category",
        ]

    def get_member_count(self, obj):
        return obj.members.count()

    def get_description(self, obj):
        return getattr(obj, "description", None)

    def get_currency(self, obj):
        return getattr(obj, "currency", None)

    def get_members(self, obj):
        return [member.email for member in obj.members.all()]

    def get_user_balance(self, obj):
        user = self.context["request"].user

        # Optimized aggregation
        paid_total = obj.expenses.filter(paid_by=user).aggregate(total=Sum("amount"))[
            "total"
        ] or Decimal("0")
        owed_total = obj.expenses.filter(splits__user=user).aggregate(
            total=Sum("splits__amount_owed")
        )["total"] or Decimal("0")

        balance = paid_total - owed_total

        # The 'balance' is a Decimal. Get the currency from the group.
        return {"amount": (balance), "currency": obj.currency if obj.currency else None}

    def get_category(self, obj):
        # The Group model doesn't have a category. Returning a default.
        return "Others"


class AddMemberSerializer(serializers.Serializer):
    username = serializers.UUIDField()
