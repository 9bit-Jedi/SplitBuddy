from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),  # POST
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),          # POST (JWT obtain)
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', MeView.as_view(), name='user-me'),                   # GET, PUT
]
