from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Category
from backend.schemas.schemas import (
    UserRegister, UserLogin, SocialLoginRequest, Token, UserResponse, OnboardingData
)
from backend.auth.security import (
    get_password_hash, verify_password, create_access_token, create_refresh_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["Auth"])

DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "icon": "Utensils", "color": "#F59E0B"},
    {"name": "Transportation", "icon": "Car", "color": "#3B82F6"},
    {"name": "Shopping", "icon": "ShoppingBag", "color": "#EC4899"},
    {"name": "Entertainment", "icon": "Film", "color": "#8B5CF6"},
    {"name": "Bills & Utilities", "icon": "Zap", "color": "#EF4444"},
    {"name": "Healthcare", "icon": "Heart", "color": "#10B981"},
    {"name": "Income & Salary", "icon": "DollarSign", "color": "#10B981"},
    {"name": "Other", "icon": "MoreHorizontal", "color": "#6B7280"}
]

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        level=1,
        xp=0,
        streak_count=1,
        currency="₹",
        is_admin=(user_in.email == "admin@finquest.com")
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Seed default categories for new user
    for cat in DEFAULT_CATEGORIES:
        db.add(Category(user_id=user.id, name=cat["name"], icon=cat["icon"], color=cat["color"], is_custom=False))
    db.commit()

    return user

@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/social-login", response_model=Token)
def social_login(payload: SocialLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    
    if not user:
        # Auto-provision social user
        user = User(
            name=payload.name or "Social Adventurer",
            email=payload.email,
            password_hash=get_password_hash("social_oauth_random_pwd_2026"),
            avatar=payload.avatar or "avatar_default",
            level=1,
            xp=100,
            streak_count=1,
            currency="₹",
            is_admin=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Seed default categories for new user
        for cat in DEFAULT_CATEGORIES:
            db.add(Category(user_id=user.id, name=cat["name"], icon=cat["icon"], color=cat["color"], is_custom=False))
        db.commit()
    elif payload.avatar and user.avatar == "avatar_default":
        user.avatar = payload.avatar
        db.commit()

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/onboarding", response_model=UserResponse)
def complete_onboarding(
    onboarding: OnboardingData,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.monthly_income = onboarding.monthly_income
    current_user.monthly_budget_target = onboarding.monthly_budget_target
    current_user.main_financial_goal = onboarding.main_financial_goal
    current_user.currency = onboarding.currency
    current_user.financial_experience = onboarding.financial_experience
    current_user.is_onboarded = True

    db.commit()
    db.refresh(current_user)
    return current_user
