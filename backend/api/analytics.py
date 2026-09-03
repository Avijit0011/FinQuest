import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from backend.database import get_db
from backend.models.models import User, Transaction, Category, Budget, Goal
from backend.auth.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary(
    range_days: int = Query(30, ge=7, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_date = datetime.datetime.utcnow() - datetime.timedelta(days=range_days)

    transactions = db.query(Transaction).options(joinedload(Transaction.category)).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= start_date
    ).all()

    total_income = sum([t.amount for t in transactions if t.transaction_type == "income"])
    total_expense = sum([t.amount for t in transactions if t.transaction_type == "expense"])
    net_savings = total_income - total_expense

    # Category Spending Breakdown
    cat_totals = {}
    for t in transactions:
        if t.transaction_type == "expense":
            cat_name = t.category.name if t.category else "Uncategorized"
            cat_totals[cat_name] = cat_totals.get(cat_name, 0.0) + t.amount

    category_breakdown = [
        {"category": name, "amount": round(amt, 2)}
        for name, amt in sorted(cat_totals.items(), key=lambda x: x[1], reverse=True)
    ]

    # Daily Spending Over Time (Line Chart)
    daily_map = {}
    for i in range(range_days):
        day_str = (start_date + datetime.timedelta(days=i)).strftime("%Y-%m-%d")
        daily_map[day_str] = {"income": 0.0, "expense": 0.0}

    for t in transactions:
        day_str = t.date.strftime("%Y-%m-%d")
        if day_str in daily_map:
            if t.transaction_type == "income":
                daily_map[day_str]["income"] += t.amount
            else:
                daily_map[day_str]["expense"] += t.amount

    spending_over_time = [
        {"date": day, "income": round(vals["income"], 2), "expense": round(vals["expense"], 2)}
        for day, vals in daily_map.items()
    ]

    # Month over Month comparison with fast SQL scalar sums
    current_month_start = datetime.datetime.utcnow().replace(day=1, hour=0, minute=0, second=0)
    prev_month_start = (current_month_start - datetime.timedelta(days=1)).replace(day=1)

    curr_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense",
        Transaction.date >= current_month_start
    ).scalar() or 0.0

    prev_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense",
        Transaction.date >= prev_month_start,
        Transaction.date < current_month_start
    ).scalar() or 0.0

    mom_change_pct = ((curr_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses > 0 else 0.0

    return {
        "range_days": range_days,
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_savings": round(net_savings, 2),
        "category_breakdown": category_breakdown,
        "spending_over_time": spending_over_time,
        "current_month_expense": round(curr_expenses, 2),
        "previous_month_expense": round(prev_expenses, 2),
        "mom_change_percentage": round(mom_change_pct, 1)
    }

