from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Group
from decimal import Decimal
from rest_framework_money_field import MoneyField

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    budget = MoneyField(required=False)

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'currency', 'budget']

class GroupDetailSerializer(GroupSerializer):
    members = serializers.SerializerMethodField()

    class Meta(GroupSerializer.Meta):
        fields = GroupSerializer.Meta.fields + ['members', 'created_at']

    def get_members(self, obj):
        memberships = obj.membership_set.select_related('user')
        return [
            {
                'id': m.user.id,
                'username': m.user.username,
                'role': m.role
            }
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
        fields = ['id', 'name', 'description', 'currency', 'member_count', 'members', 'user_balance', 'category']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_description(self, obj):
        return getattr(obj, 'description', None)

    def get_currency(self, obj):
        return getattr(obj, 'currency', None)
    
    def get_members(self, obj):
        return [member.email for member in obj.members.all()]

    def get_user_balance(self, obj):
        user = self.context['request'].user
        paid_total = Decimal('0')
        owed_total = Decimal('0')

        for expense in obj.expenses.all():
            if expense.paid_by_id == user.id:
                paid_total += expense.amount
            for split in expense.splits.all():
                if split.user_id == user.id:
                    owed_total += split.amount_owed
        
        return paid_total - owed_total

    def get_category(self, obj):
        # The Group model doesn't have a category. Returning a default.
        return "Others"

class AddMemberSerializer(serializers.Serializer):
    username = serializers.UUIDField()
