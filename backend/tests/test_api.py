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

def test_create_and_delete_goal():
    email = "goal_test_user@finquest.com"
    client.post("/api/v1/auth/register", json={
        "name": "Goal Tester",
        "email": email,
        "password": "password123"
    })
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Goal
    create_res = client.post("/api/v1/auth/../goals" if False else "/api/v1/goals", headers=headers, json={
        "title": "Test Camera Goal",
        "target_amount": 50000.0,
        "category": "Gadgets",
        "deadline": "2027-12-31T00:00:00"
    })
    assert create_res.status_code == 201
    goal = create_res.json()
    goal_id = goal["id"]
    assert goal["title"] == "Test Camera Goal"

    # Delete Goal
    del_res = client.delete(f"/api/v1/goals/{goal_id}", headers=headers)
    assert del_res.status_code == 204

def test_update_user_profile_avatar():
    email = "avatar_test_user@finquest.com"
    client.post("/api/v1/auth/register", json={
        "name": "Avatar Tester",
        "email": email,
        "password": "password123"
    })
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Update Profile Avatar
    new_avatar = "data:image/svg+xml;utf8,<svg><circle cx='50' cy='50' r='40'/></svg>"
    res = client.put("/api/v1/users/profile", headers=headers, json={
        "name": "Avatar Tester Updated",
        "currency": "₹",
        "avatar": new_avatar
    })
    assert res.status_code == 200
    user_data = res.json()
    assert user_data["avatar"] == new_avatar
    assert user_data["name"] == "Avatar Tester Updated"


