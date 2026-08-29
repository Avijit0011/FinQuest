import datetime
from sqlalchemy.orm import Session
from backend.models.models import User, Transaction, Budget, Goal, FinancialHealthScore

def calculate_financial_health_score(db: Session, user: User) -> dict:
    # 1. Savings Score (max 25 pts)
    # Based on ratio of total savings / income
    income_txs = db.query(Transaction).filter(
        Transaction.user_id == user.id,
        Transaction.transaction_type == "income"
    ).all()
    expense_txs = db.query(Transaction).filter(
        Transaction.user_id == user.id,
        Transaction.transaction_type == "expense"
    ).all()

    total_income = sum([t.amount for t in income_txs]) or user.monthly_income or 50000.0
    total_expense = sum([t.amount for t in expense_txs]) or 0.0

    net_savings = max(0.0, total_income - total_expense)
    savings_ratio = (net_savings / total_income) if total_income > 0 else 0.0

    if savings_ratio >= 0.30:
        savings_score = 25
    elif savings_ratio >= 0.20:
        savings_score = 20
    elif savings_ratio >= 0.10:
        savings_score = 15
    elif savings_ratio > 0:
        savings_score = 10
    else:
        savings_score = 5

    # 2. Budget Score (max 25 pts)
    budgets = db.query(Budget).filter(Budget.user_id == user.id).all()
    if not budgets:
        budget_score = 15 # Default neutral score
    else:
        # Check budget adherence
        within_budget_count = 0
        total_budgets = len(budgets)
        for b in budgets:
            if total_expense <= b.total_amount:
                within_budget_count += 1
        adherence_ratio = within_budget_count / total_budgets if total_budgets > 0 else 1.0
        budget_score = int(adherence_ratio * 25)

    # 3. Consistency Score (max 20 pts)
    # Based on logging activity & streak count
    streak = user.streak_count or 0
    if streak >= 14:
        consistency_score = 20
    elif streak >= 7:
        consistency_score = 16
    elif streak >= 3:
        consistency_score = 12
    elif streak >= 1:
        consistency_score = 8
    else:
        consistency_score = 4

    # 4. Goals Score (max 20 pts)
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    if not goals:
        goal_score = 10
    else:
        avg_progress = sum([min(1.0, g.current_amount / g.target_amount if g.target_amount > 0 else 0.0) for g in goals]) / len(goals)
        goal_score = int(avg_progress * 20)

    # 5. Spending Stability Score (max 10 pts)
    if total_income > 0 and (total_expense / total_income) <= 0.80:
        spending_score = 10
    elif total_income > 0 and (total_expense / total_income) <= 0.95:
        spending_score = 7
    else:
        spending_score = 4

    overall_score = min(100, savings_score + budget_score + consistency_score + goal_score + spending_score)

    # Rating description
    if overall_score >= 85:
        rating = "Excellent Financial Quest Mastery"
    elif overall_score >= 70:
        rating = "Strong Financial Health"
    elif overall_score >= 50:
        rating = "Moderate Financial Stability"
    else:
        rating = "Needs Quest Focus & Budgeting"

    insights = []
    if savings_ratio < 0.20:
        insights.append("Increasing your monthly savings ratio above 20% will boost your health score significantly.")
    if budget_score < 20:
        insights.append("Staying strictly within category budget caps will improve your budgeting score.")
    if streak < 7:
        insights.append("Maintain a 7-day transaction tracking streak to unlock maximum consistency points.")

    # Save or update record in DB
    score_record = FinancialHealthScore(
        user_id=user.id,
        overall_score=overall_score,
        savings_score=savings_score,
        budget_score=budget_score,
        consistency_score=consistency_score,
        goal_score=goal_score,
        spending_score=spending_score,
        calculated_at=datetime.datetime.utcnow()
    )
    db.add(score_record)
    db.commit()

    return {
        "overall_score": overall_score,
        "savings_score": savings_score,
        "budget_score": budget_score,
        "consistency_score": consistency_score,
        "goal_score": goal_score,
        "spending_score": spending_score,
        "rating": rating,
        "insights": insights
    }
