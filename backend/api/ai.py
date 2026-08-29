from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Transaction, Goal
from backend.schemas.schemas import (
    AIChatRequest, AIChatResponse, AICategorizeRequest, AICategorizeResponse
)
from backend.auth.security import get_current_user
from ai.providers import ai_provider_service
from backend.services.health_score import calculate_financial_health_score

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/chat", response_model=AIChatResponse)
def ai_chat(
    req: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch authenticated user's verified metrics (Strict user-data isolation!)
    income = sum([t.amount for t in db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "income"
    ).all()]) or current_user.monthly_income or 0.0

    expenses = sum([t.amount for t in db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense"
    ).all()]) or 0.0

    savings = sum([g.current_amount for g in db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()]) or max(0.0, income - expenses)

    health = calculate_financial_health_score(db, current_user)

    metrics = {
        "currency": current_user.currency,
        "income": round(income, 2),
        "expenses": round(expenses, 2),
        "savings": round(savings, 2),
        "health_score": health["overall_score"],
        "streak": current_user.streak_count,
        "level": current_user.level,
        "xp": current_user.xp,
        "top_category": "Food & Dining"
    }

    reply = ai_provider_service.generate_coach_reply(req.message, metrics)

    return AIChatResponse(
        reply=reply,
        provider=ai_provider_service.provider
    )

@router.post("/categorize-transaction", response_model=AICategorizeResponse)
def categorize_transaction(
    req: AICategorizeRequest,
    current_user: User = Depends(get_current_user)
):
    res = ai_provider_service.categorize_transaction(req.input_text)
    return AICategorizeResponse(**res)

@router.get("/insight")
def get_daily_ai_insight(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    health = calculate_financial_health_score(db, current_user)
    expenses = sum([t.amount for t in db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense"
    ).all()])

    if expenses > (current_user.monthly_budget_target or 30000):
        insight = f"Your total spending ({current_user.currency}{expenses:,.0f}) is approaching your monthly budget target. Focusing on non-essential food and shopping can keep you in the green!"
    else:
        insight = f"Awesome work! You are currently on track to reach your savings goal. Your Financial Health Score is a solid {health['overall_score']}/100 🔥."

    return {"insight": insight, "score": health['overall_score']}
