from django.db import models
from django.conf import settings
from django.utils import timezone

class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    currency = models.CharField(max_length=10, default="USD")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="groups_created")
    created_at = models.DateTimeField(default=timezone.now)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='GroupMember',
        related_name='member_groups', # changed to avoid confusion with membership_set
        blank=True
    )

    def __str__(self):
        return self.name

class GroupMember(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_memberships")
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="membership_set") # changed to avoid confusion with members field
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="member")
    joined_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} in {self.group.name}"

    class Meta:
        unique_together = ('user', 'group')
