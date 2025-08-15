from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .mixins import CurrentUserMixin
from .serializers import RegisterSerializer, UserProfileSerializer

User = get_user_model()

# Create your views here.


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class MeView(CurrentUserMixin, generics.RetrieveUpdateAPIView):
    """
    Retrieve/Update the authenticated user's profile.
    PATCH supported (partial), PUT (full). Only whitelisted fields updated.
    """

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    allowed_update_fields = {"username", "email", "profile_image_url"}

    def perform_update(self, serializer):
        # Enforce field whitelist
        cleaned = {
            k: v
            for k, v in serializer.validated_data.items()
            if k in self.allowed_update_fields
        }
        serializer.save(**cleaned)
