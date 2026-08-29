import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from typing import Dict, Any, List

class SpendingPredictor:
    def predict_next_month_spending(self, daily_spend_series: List[float]) -> Dict[str, Any]:
        """
        Takes daily spending history (e.g. 30-90 floats) and predicts next month's total spending.
        """
        if not daily_spend_series or len(daily_spend_series) < 5:
            avg_daily = np.mean(daily_spend_series) if daily_spend_series else 1000.0
            return {
                "predicted_next_month_spending": float(avg_daily * 30),
                "historical_average_spending": float(avg_daily * 30),
                "trend": "stable"
            }

        X = np.array(range(len(daily_spend_series))).reshape(-1, 1)
        y = np.array(daily_spend_series)

        model = Ridge(alpha=1.0)
        model.fit(X, y)

        # Predict next 30 days
        future_days = np.array(range(len(daily_spend_series), len(daily_spend_series) + 30)).reshape(-1, 1)
        future_predictions = model.predict(future_days)
        total_predicted = float(max(0.0, np.sum(future_predictions)))

        avg_historical = float(np.mean(daily_spend_series) * 30)

        slope = float(model.coef_[0])
        if slope > 5.0:
            trend = "increasing"
        elif slope < -5.0:
            trend = "decreasing"
        else:
            trend = "stable"

        return {
            "predicted_next_month_spending": round(total_predicted, 2),
            "historical_average_spending": round(avg_historical, 2),
            "trend": trend
        }

spending_predictor = SpendingPredictor()
