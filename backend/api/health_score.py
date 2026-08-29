from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User
from backend.schemas.schemas import HealthScoreResponse
from backend.auth.security import get_current_user
from backend.services.health_score import calculate_financial_health_score

router = APIRouter(prefix="/financial-score", tags=["Health Score"])

@router.get("", response_model=HealthScoreResponse)
def get_financial_health_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return calculate_financial_health_score(db, current_user)
