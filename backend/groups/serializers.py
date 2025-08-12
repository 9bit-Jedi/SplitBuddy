from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Group  # adjust if named differently

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'currency', 'member_count']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_description(self, obj):
        return getattr(obj, 'description', None)

    def get_currency(self, obj):
        return getattr(obj, 'currency', None)

class AddMemberSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()