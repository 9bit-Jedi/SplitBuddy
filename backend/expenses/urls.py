from django.urls import path
from .views import (
    ExpenseCreateView,
    ExpenseDetailView,
    GroupExpenseListView,
    ExpenseSettleView,
)

urlpatterns = [
    path('', ExpenseCreateView.as_view(), name='expense-create'),                                     # POST /api/expenses/
    path('<int:pk>/settle/', ExpenseSettleView.as_view(), name='expense-settle'),                   # POST settle
    path('<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),                          # GET expense detail
    path('group/<int:group_id>/', GroupExpenseListView.as_view(), name='group-expense-list'),      # GET group expenses
]
