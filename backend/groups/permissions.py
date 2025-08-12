from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Group

class IsGroupAdmin(BasePermission):
    """
    Allows modifying group membership only if the requesting user is an admin
    (role='admin') of the referenced group.
    Safe methods are allowed for read access (if used).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        # Resolve group id from typical locations.
        group_id = (
            view.kwargs.get('pk')
            or view.kwargs.get('group_id')
            or request.data.get('group')
            or request.query_params.get('group')
        )
        if not group_id:
            return False

        # Efficient existence check: user must be membership with role=admin.
        return Group.objects.filter(
            id=group_id,
            membership_set__user=request.user,
            membership_set__role='admin'
        ).exists()
