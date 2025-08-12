from django.contrib import admin
from .models import User  # add other models explicitly (e.g., Profile, Invitation)

# Register your models here.
admin.site.register(User)
