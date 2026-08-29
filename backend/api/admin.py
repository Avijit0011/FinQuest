from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models.models import User, Transaction, UserChallenge, FinancialHealthScore
from backend.schemas.schemas import AdminStatsResponse
from backend.auth.security import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.streak_count > 0).count()
    total_txs = db.query(Transaction).count()
    total_vol = db.query(func.sum(Transaction.amount)).scalar() or 0.0
    
    avg_score = db.query(func.avg(FinancialHealthScore.overall_score)).scalar() or 75.0
    completed_challenges = db.query(UserChallenge).filter(UserChallenge.status == "completed").count()

    return AdminStatsResponse(
        total_users=total_users,
        active_users_30d=active_users,
        total_transactions=total_txs,
        total_volume=round(float(total_vol), 2),
        avg_health_score=round(float(avg_score), 1),
        total_challenges_completed=completed_challenges
    )
