import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.gamification import get_xp_for_level, get_level_for_xp
from backend.services.health_score import calculate_financial_health_score
from ai.providers import ai_provider_service
from ml.spending_predictor import spending_predictor

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "operational"

def test_xp_level_curve():
    assert get_xp_for_level(1) == 0
    assert get_level_for_xp(0) == 1
    assert get_level_for_xp(2500) > 1

def test_ai_categorization_heuristic():
    res = ai_provider_service.categorize_transaction("Swiggy 450")
    assert res["suggested_category"] == "Food & Dining"
    assert res["suggested_amount"] == 450.0
    assert res["suggested_type"] == "expense"

def test_ml_spending_prediction():
    history = [500.0, 600.0, 450.0, 700.0, 550.0, 650.0]
    pred = spending_predictor.predict_next_month_spending(history)
    assert pred["predicted_next_month_spending"] > 0
    assert "trend" in pred

def test_user_registration_and_login():
    email = f"unittest_{pytest.__name__}@finquest.com"
    # Register
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Test Adventurer",
        "email": email,
        "password": "password123"
    })
    assert reg_res.status_code in [201, 400] # 201 created or 400 if already exists

    # Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": "password123"
    })
    if login_res.status_code == 200:
        tokens = login_res.json()
        assert "access_token" in tokens
        assert "refresh_token" in tokens
