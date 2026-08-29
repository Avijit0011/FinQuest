import json
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Transaction, Goal, Budget, UserChallenge, UserAchievement
from backend.schemas.schemas import UserResponse
from backend.auth.security import get_current_user

router = APIRouter(prefix="/users", tags=["Users & Settings"])

@router.put("/profile", response_model=UserResponse)
def update_profile(
    name: str,
    currency: str = "₹",
    avatar: str = "avatar_default",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.name = name
    current_user.currency = currency
    current_user.avatar = avatar
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/export-data")
def export_user_data(
    format: str = "json", # json or csv
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()

    tx_data = [
        {
            "id": t.id,
            "amount": t.amount,
            "type": t.transaction_type,
            "description": t.description,
            "date": t.date.isoformat(),
            "payment_method": t.payment_method
        }
        for t in transactions
    ]

    if format.lower() == "csv":
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=["id", "amount", "type", "description", "date", "payment_method"])
        writer.writeheader()
        writer.writerows(tx_data)
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=finquest_data_{current_user.id}.csv"}
        )

    full_data = {
        "user": {
            "name": current_user.name,
            "email": current_user.email,
            "level": current_user.level,
            "xp": current_user.xp,
            "streak_count": current_user.streak_count,
            "currency": current_user.currency
        },
        "transactions": tx_data,
        "goals": [{"title": g.title, "target": g.target_amount, "current": g.current_amount} for g in goals]
    }

    return Response(
        content=json.dumps(full_data, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=finquest_data_{current_user.id}.json"}
    )

@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
