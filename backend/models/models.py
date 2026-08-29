import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum, Index
)
from sqlalchemy.orm import relationship
import enum
from backend.database import Base

class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class BudgetPeriod(str, enum.Enum):
    MONTHLY = "monthly"
    WEEKLY = "weekly"

class GoalStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"

class ChallengeStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    FAILED = "failed"

class NotificationType(str, enum.Enum):
    BUDGET_WARNING = "budget_warning"
    CHALLENGE_COMPLETE = "challenge_complete"
    ACHIEVEMENT_UNLOCK = "achievement_unlock"
    LEVEL_UP = "level_up"
    GOAL_MILESTONE = "goal_milestone"
    STREAK_MILESTONE = "streak_milestone"
    AI_INSIGHT = "ai_insight"
    SYSTEM = "system"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    avatar = Column(String(255), nullable=True, default="avatar_default")
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    streak_count = Column(Integer, default=0)
    currency = Column(String(10), default="₹")
    monthly_income = Column(Float, default=0.0)
    monthly_budget_target = Column(Float, default=0.0)
    main_financial_goal = Column(String(255), nullable=True)
    financial_experience = Column(String(50), default="intermediate")
    is_admin = Column(Boolean, default=False)
    is_onboarded = Column(Boolean, default=False)
    last_activity_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    categories = relationship("Category", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    challenges = relationship("UserChallenge", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    xp_history = relationship("XPTransaction", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    health_scores = relationship("FinancialHealthScore", back_populates="user", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(100), nullable=False)
    icon = Column(String(50), default="Tag")
    color = Column(String(30), default="#6366F1")
    is_custom = Column(Boolean, default=False)

    user = relationship("User", back_populates="categories")
    transactions = relationship("Transaction", back_populates="category")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(20), nullable=False, default="expense") # income / expense
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    description = Column(String(255), nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    payment_method = Column(String(50), default="UPI / Card")
    notes = Column(Text, nullable=True)
    is_flagged_anomaly = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(100), default="Monthly Budget")
    period = Column(String(20), default="monthly")
    total_amount = Column(Float, nullable=False)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="budgets")
    budget_categories = relationship("BudgetCategory", back_populates="budget", cascade="all, delete-orphan")

class BudgetCategory(Base):
    __tablename__ = "budget_categories"

    id = Column(Integer, primary_key=True, index=True)
    budget_id = Column(Integer, ForeignKey("budgets.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False, index=True)
    allocated_amount = Column(Float, nullable=False)

    budget = relationship("Budget", back_populates="budget_categories")
    category = relationship("Category")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    deadline = Column(DateTime, nullable=False)
    category = Column(String(50), default="General Savings")
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="goals")
    contributions = relationship("GoalContribution", back_populates="goal", cascade="all, delete-orphan")

class GoalContribution(Base):
    __tablename__ = "goal_contributions"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    notes = Column(String(255), nullable=True)

    goal = relationship("Goal", back_populates="contributions")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), default="Medium") # Easy, Medium, Hard
    objective_type = Column(String(50), nullable=False) # budget_limit, save_amount, no_spend_days
    target_value = Column(Float, nullable=False)
    duration_days = Column(Integer, default=7)
    xp_reward = Column(Integer, default=250)
    icon = Column(String(50), default="Trophy")

    user_challenges = relationship("UserChallenge", back_populates="challenge")

class UserChallenge(Base):
    __tablename__ = "user_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    current_progress = Column(Float, default=0.0)
    status = Column(String(20), default="active") # active, completed, failed

    user = relationship("User", back_populates="challenges")
    challenge = relationship("Challenge", back_populates="user_challenges")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="Award")
    xp_reward = Column(Integer, default=100)
    condition_type = Column(String(50), nullable=False) # transaction_count, streak_days, save_total, budget_master
    condition_value = Column(Float, nullable=False)

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False, index=True)
    unlocked_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")

class XPTransaction(Base):
    __tablename__ = "xp_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    source_type = Column(String(50), nullable=False) # transaction, daily_budget, challenge, goal, streak
    xp_amount = Column(Integer, nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="xp_history")

class FinancialHealthScore(Base):
    __tablename__ = "financial_health_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_score = Column(Integer, nullable=False) # 0-100
    savings_score = Column(Integer, nullable=False) # 0-25
    budget_score = Column(Integer, nullable=False) # 0-25
    consistency_score = Column(Integer, nullable=False) # 0-20
    goal_score = Column(Integer, nullable=False) # 0-20
    spending_score = Column(Integer, nullable=False) # 0-10
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="health_scores")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(30), default="system")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(150), default="Financial Assistant Chat")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String(20), nullable=False) # user / assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")
