from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404, render
from expenses.models import Expense  # adjust if different
from groups.models import Group  # adjust if different
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.


class GroupBudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id, members=request.user)
        total_spent = (
            Expense.objects.filter(group=group).aggregate(total=Sum("amount"))["total"]
            or 0
        )
        budget = getattr(group, "budget", None)
        data = {
            "group_id": group.id,
            "budget": budget,
            "spent": total_spent,
            "remaining": (budget - total_spent) if budget is not None else None,
        }
        return Response(data)


class GroupCategoryBreakdownView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id, members=request.user)
        qs = (
            Expense.objects.filter(group=group)
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )
        breakdown = [
            {"category": r["category"] or "Uncategorized", "total": r["total"]}
            for r in qs
        ]
        return Response({"group_id": group.id, "breakdown": breakdown})


class GroupLeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        group = get_object_or_404(Group, id=group_id, members=request.user)
        # Simple "karma": sum(amount paid) - (share of total)
        expenses = Expense.objects.filter(group=group).select_related("paid_by")
        totals_by_user = {}
        total_amount = 0
        for e in expenses:
            payer = e.paid_by_id
            totals_by_user[payer] = totals_by_user.get(payer, 0) + float(e.amount)
            total_amount += float(e.amount)
        member_ids = list(group.members.values_list("id", flat=True))
        per_capita = (total_amount / len(member_ids)) if member_ids else 0
        leaderboard = []
        users_map = {u.id: u for u in group.members.all()}
        for uid in member_ids:
            paid = totals_by_user.get(uid, 0.0)
            karma = paid - per_capita
            user = users_map[uid]
            leaderboard.append(
                {
                    "user_id": uid,
                    "username": getattr(user, "username", ""),
                    "paid": paid,
                    "net_karma": karma,
                }
            )
        leaderboard.sort(key=lambda x: x["net_karma"], reverse=True)
        return Response({"group_id": group.id, "leaderboard": leaderboard})
