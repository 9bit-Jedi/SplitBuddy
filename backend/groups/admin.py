from django.contrib import admin

from .models import Group, GroupMember

# Explicit imports & registrations (update to real model names)
admin.site.register(Group)
admin.site.register(GroupMember)
