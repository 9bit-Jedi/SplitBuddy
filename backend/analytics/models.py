from django.db import models
from django.utils import timezone
from groups.models import Group

class Budget(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="budgets")
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Budget for {self.group.name}"
