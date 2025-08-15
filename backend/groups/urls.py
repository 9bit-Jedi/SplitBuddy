from django.urls import path
from expenses.views import GroupDebtSimplifyView  # new imports
from expenses.views import GroupSettlementCreateView

from .views import GroupMembersView, GroupViewSet

group_list = GroupViewSet.as_view({"get": "list", "post": "create"})
group_detail = GroupViewSet.as_view({"get": "retrieve"})

urlpatterns = [
    path("", group_list, name="group-list-create"),  # GET(list), POST(create)
    path("<int:pk>/", group_detail, name="group-detail"),  # GET(detail)
    path(
        "<int:pk>/members/", GroupMembersView.as_view(), name="group-members"
    ),  # POST(add), DELETE(remove)
    path(
        "<int:pk>/debts/simplify/",
        GroupDebtSimplifyView.as_view(),
        name="group-debts-simplify",
    ),
    path(
        "<int:pk>/settlements/",
        GroupSettlementCreateView.as_view(),
        name="group-settlement-create",
    ),
]
