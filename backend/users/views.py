from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from .serializers import UserProfileSerializer
from .mixins import CurrentUserMixin

# Create your views here.

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(CurrentUserMixin, generics.RetrieveUpdateAPIView):
    """
    Retrieve/Update the authenticated user's profile.
    PATCH supported (partial), PUT (full). Only whitelisted fields updated.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    allowed_update_fields = {'username', 'email', 'profile_image_url'}

    def perform_update(self, serializer):
        # Enforce field whitelist
        cleaned = {
            k: v for k, v in serializer.validated_data.items()
            if k in self.allowed_update_fields
        }
        serializer.save(**cleaned)
