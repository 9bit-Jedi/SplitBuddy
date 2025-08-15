from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username")
        read_only_fields = ("id", "email", "username")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password")

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "profile_image_url"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        if value:
            qs = User.objects.exclude(pk=self.instance.pk if self.instance else None)
            if qs.filter(email__iexact=value).exists():
                raise serializers.ValidationError("Email already in use.")
        return value
