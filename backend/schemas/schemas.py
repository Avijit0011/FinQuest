from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- AUTH & USER ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SocialLoginRequest(BaseModel):
    provider: str
    email: EmailStr
    name: Optional[str] = "Adventurer"
    avatar: Optional[str] = None
    id_token: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class OnboardingData(BaseModel):
    monthly_income: float = Field(..., ge=0)
    monthly_budget_target: float = Field(..., ge=0)
    main_financial_goal: str
    currency: str = "₹"
    financial_experience: str = "intermediate"

class UserUpdateProfile(BaseModel):
    name: Optional[str] = None
    currency: Optional[str] = "₹"
    avatar: Optional[str] = "avatar_default"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar: Optional[str] = "avatar_default"
    level: int
    xp: int
    streak_count: int
    currency: str
    monthly_income: float
    monthly_budget_target: float
    main_financial_goal: Optional[str]
    financial_experience: str
    is_admin: bool
    is_onboarded: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- CATEGORY ---
class CategoryBase(BaseModel):
    name: str
    icon: str = "Tag"
    color: str = "#6366F1"

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    user_id: Optional[int] = None
    is_custom: bool

    class Config:
        from_attributes = True

# --- TRANSACTION ---
class TransactionCreate(BaseModel):
    amount: float = Field(..., gt=0)
    transaction_type: str = "expense" # income / expense
    category_id: Optional[int] = None
    description: str = Field(..., min_length=1, max_length=255)
    date: Optional[datetime] = None
    payment_method: str = "UPI / Card"
    notes: Optional[str] = None

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    transaction_type: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    transaction_type: str
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None
    description: str
    date: datetime
    payment_method: str
    notes: Optional[str] = None
    is_flagged_anomaly: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionListResponse(BaseModel):
    items: List[TransactionResponse]
    total: int
    page: int
    size: int
    total_pages: int

# --- BUDGET ---
class BudgetCategoryItem(BaseModel):
    category_id: int
    allocated_amount: float

class BudgetCreate(BaseModel):
    title: str = "Monthly Budget"
    period: str = "monthly"
    total_amount: float = Field(..., gt=0)
    categories: List[BudgetCategoryItem] = []

class BudgetCategoryResponse(BaseModel):
    id: int
    category_id: int
    category_name: str
    allocated_amount: float
    spent_amount: float
    percentage: float

class BudgetResponse(BaseModel):
    id: int
    user_id: int
    title: str
    period: str
    total_amount: float
    spent_amount: float
    remaining_amount: float
    percentage: float
    start_date: datetime
    end_date: Optional[datetime] = None
    categories: List[BudgetCategoryResponse] = []

    class Config:
        from_attributes = True

# --- GOALS ---
class GoalCreate(BaseModel):
    title: str
    target_amount: float = Field(..., gt=0)
    deadline: datetime
    category: str = "General Savings"

class GoalContributionCreate(BaseModel):
    amount: float = Field(..., gt=0)
    notes: Optional[str] = None

class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    target_amount: float
    current_amount: float
    deadline: datetime
    category: str
    status: str
    percentage: float
    required_monthly_saving: float
    required_weekly_saving: float
    created_at: datetime

    class Config:
        from_attributes = True

# --- GAMIFICATION ---
class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    objective_type: str
    target_value: float
    duration_days: int
    xp_reward: int
    icon: str

    class Config:
        from_attributes = True

class UserChallengeResponse(BaseModel):
    id: int
    user_id: int
    challenge_id: int
    challenge: ChallengeResponse
    start_date: datetime
    end_date: datetime
    current_progress: float
    percentage: float
    status: str

    class Config:
        from_attributes = True

class AchievementResponse(BaseModel):
    id: int
    code: str
    name: str
    description: str
    icon: str
    xp_reward: int
    condition_type: str
    condition_value: float
    is_unlocked: bool = False
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GamificationStatusResponse(BaseModel):
    level: int
    xp: int
    xp_for_current_level: int
    xp_for_next_level: int
    xp_progress_percentage: float
    streak_count: int
    unlocked_achievements_count: int
    total_achievements_count: int
    active_challenges_count: int

# --- HEALTH SCORE ---
class HealthScoreResponse(BaseModel):
    overall_score: int
    savings_score: int # max 25
    budget_score: int # max 25
    consistency_score: int # max 20
    goal_score: int # max 20
    spending_score: int # max 10
    rating: str
    insights: List[str]

# --- AI ---
class AIChatRequest(BaseModel):
    message: str

class AIChatResponse(BaseModel):
    reply: str
    provider: str

class AICategorizeRequest(BaseModel):
    input_text: str

class AICategorizeResponse(BaseModel):
    suggested_category: str
    suggested_amount: float
    suggested_type: str # income / expense
    suggested_description: str
    confidence: float

# --- ML ---
class MLPredictionResponse(BaseModel):
    predicted_next_month_spending: float
    historical_average_spending: float
    trend: str # increasing / stable / decreasing
    anomalous_transactions_count: int

# --- ADMIN STATS ---
class AdminStatsResponse(BaseModel):
    total_users: int
    active_users_30d: int
    total_transactions: int
    total_volume: float
    avg_health_score: float
    total_challenges_completed: int
