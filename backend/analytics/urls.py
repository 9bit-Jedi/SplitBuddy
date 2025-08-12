from django.urls import path
from . import views

urlpatterns = [
    path('<int:group_id>/budget/', views.GroupBudgetView.as_view(), name='analytics-budget'),
    path('<int:group_id>/categories/', views.GroupCategoryBreakdownView.as_view(), name='analytics-categories'),
    path('<int:group_id>/leaderboard/', views.GroupLeaderboardView.as_view(), name='analytics-leaderboard'),
]
