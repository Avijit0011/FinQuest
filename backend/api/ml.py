from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Transaction
from backend.schemas.schemas import MLPredictionResponse
from backend.auth.security import get_current_user
from ml.spending_predictor import spending_predictor
from ml.anomaly_detector import anomaly_detector

router = APIRouter(prefix="/ml", tags=["Machine Learning"])

@router.get("/predictions", response_model=MLPredictionResponse)
def get_ml_spending_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense"
    ).order_by(Transaction.date.asc()).all()

    daily_amounts = [t.amount for t in expenses]
    prediction = spending_predictor.predict_next_month_spending(daily_amounts)

    anomalies = anomaly_detector.detect_anomalies(daily_amounts)
    anomaly_count = sum(1 for a in anomalies if a)

    return MLPredictionResponse(
        predicted_next_month_spending=prediction["predicted_next_month_spending"],
        historical_average_spending=prediction["historical_average_spending"],
        trend=prediction["trend"],
        anomalous_transactions_count=anomaly_count
    )
