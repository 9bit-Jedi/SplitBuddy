from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Group  # adjust if named differently
from .serializers import GroupSerializer, GroupDetailSerializer, AddMemberSerializer, GroupListSerializer
from .permissions import IsGroupAdmin  # added
from rest_framework import viewsets

User = get_user_model()

class GroupViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Groups:
      list -> groups current user belongs to
      retrieve -> group detail with members
      create -> create group and attach creator as member/admin
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Use new related_name 'member_groups' from User -> Group
        return self.request.user.member_groups.prefetch_related('members', 'expenses__splits').distinct()

    def get_serializer_class(self):
        if self.action == 'list':
            return GroupListSerializer
        if self.action == 'retrieve':
            return GroupDetailSerializer
        return GroupSerializer

    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        group.members.add(self.request.user)
        # Optional: set admin / owner style fields if present
        for attr in ('admin', 'owner', 'created_by'):
            if hasattr(group, attr) and getattr(group, attr) in (None, ''):
                setattr(group, attr, self.request.user)
        group.save()

class GroupMembersView(APIView):
    permission_classes = [IsAuthenticated, IsGroupAdmin]  # updated

    def post(self, request, pk):
        """
        Add a member to the group.
        Expects username in JSON body.
        """
        group = get_object_or_404(Group, id=pk, members=request.user)
        serializer = AddMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, username=serializer.validated_data['username'])
        if group.members.filter(id=user.id).exists():
            return Response({'detail': 'User already a member'}, status=status.HTTP_400_BAD_REQUEST)
        if user == request.user:
            return Response({'detail': 'Cannot add yourself'}, status=status.HTTP_400_BAD_REQUEST)
        group.members.add(user)
        group_serializer = GroupDetailSerializer(group)
        response = {
            'detail': 'Member added',
            'group': group_serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Update a member's role in the group.
        Expects username and role in JSON body.
        """
        group = get_object_or_404(Group, id=pk, members=request.user)
        serializer = AddMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(User, username=serializer.validated_data['username'])
        if not group.members.filter(id=user.id).exists():
            return Response({'detail': 'User not a member'}, status=status.HTTP_404_NOT_FOUND)
        
        role = request.data.get('role', 'member')
        if role not in ['admin', 'member']:
            return Response({'detail': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        membership = group.membership_set.get(user=user)
        membership.role = role
        membership.save()
        response = {
            'detail': 'Member role updated',
            'username': user.username,
            'role': membership.role,
            'group': GroupDetailSerializer(group).data
        }
        return Response(response, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        Remove a member from the group.
        username can be supplied in JSON body or as query param.
        Cannot remove yourself.
        """
        group = get_object_or_404(Group, id=pk, members=request.user)
        username = request.data.get('username') or request.query_params.get('username')
        if not username:
            return Response({'detail': 'username required'}, status=status.HTTP_400_BAD_REQUEST)
        if username == request.user.username:
            return Response({'detail': 'Cannot remove yourself'}, status=status.HTTP_400_BAD_REQUEST)
        user = get_object_or_404(User, username=username)
        if not group.members.filter(id=user.id).exists():
            return Response({'detail': 'User not a member'}, status=status.HTTP_404_NOT_FOUND)
        group.members.remove(user)
        group_serializer = GroupDetailSerializer(group)
        return Response({'detail': 'Member removed', 'group': group_serializer.data}, status=status.HTTP_200_OK)
