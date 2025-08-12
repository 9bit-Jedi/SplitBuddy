from rest_framework.permissions import IsAuthenticated

class CurrentUserMixin:
    """
    Reusable mixin for views operating on request.user.
    Ensures IsAuthenticated is present when mixed in (append or set).
    """
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
