import numpy as np
from sklearn.ensemble import IsolationForest
from typing import List

class AnomalyDetector:
    def detect_anomalies(self, transaction_amounts: List[float]) -> List[bool]:
        """
        Returns boolean mask indicating if each transaction amount is a statistical anomaly.
        """
        if not transaction_amounts or len(transaction_amounts) < 5:
            return [False] * len(transaction_amounts)

        X = np.array(transaction_amounts).reshape(-1, 1)
        model = IsolationForest(contamination=0.05, random_state=42)
        preds = model.fit_predict(X) # -1 for anomaly, 1 for normal

        return [bool(p == -1) for p in preds]

anomaly_detector = AnomalyDetector()
