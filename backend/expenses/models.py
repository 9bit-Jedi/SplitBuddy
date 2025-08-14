from django.db import models
from django.conf import settings
from django.utils import timezone
from groups.models import Group
from djmoney.models.fields import MoneyField

class Expense(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="expenses")
    description = models.CharField(max_length=255, blank=True, default="")
    amount = MoneyField(max_digits=10, decimal_places=2, default_currency='INR')
    paid_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="expenses_paid")
    date_added = models.DateTimeField(default=timezone.now)
    category = models.CharField(max_length=50, default="General")

    def __str__(self):
        return f"{self.description} - {self.amount}"

class ExpenseSplit(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name="splits")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="splits")
    amount_owed = MoneyField(max_digits=10, decimal_places=2, default_currency='INR')

    def __str__(self):
        return f"{self.user.username} owes {self.amount_owed} for {self.expense.description}"

class Settlement(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="settlements")
    paid_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settlements_made")
    paid_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="settlements_received")
    amount = MoneyField(max_digits=10, decimal_places=2, default_currency='INR')
    date_settled = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.paid_by.username} paid {self.paid_to.username} {self.amount}"
