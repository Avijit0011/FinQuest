import datetime
import random
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models.models import (
    User, Category, Transaction, Budget, BudgetCategory, Goal, Challenge, Achievement,
    UserChallenge, UserAchievement, FinancialHealthScore, Notification
)
from backend.auth.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("[SEED] Starting FinQuest Seed Process...")

    # 1. Seed System Challenges
    challenges_data = [
        {
            "title": "7-Day Budget Challenge",
            "description": "Stay within your daily spending target for 7 consecutive days.",
            "difficulty": "Easy",
            "objective_type": "transaction_count",
            "target_value": 7.0,
            "duration_days": 7,
            "xp_reward": 250,
            "icon": "Target"
        },
        {
            "title": "Monthly Saver Quest",
            "description": "Save ₹5,000 into your active savings goals this month.",
            "difficulty": "Medium",
            "objective_type": "save_amount",
            "target_value": 5000.0,
            "duration_days": 30,
            "xp_reward": 500,
            "icon": "PiggyBank"
        },
        {
            "title": "3-Day No-Spend Blitz",
            "description": "Complete 3 days without discretionary spending on shopping or dining out.",
            "difficulty": "Hard",
            "objective_type": "transaction_count",
            "target_value": 3.0,
            "duration_days": 3,
            "xp_reward": 300,
            "icon": "Flame"
        },
        {
            "title": "Food Budget Mastery",
            "description": "Keep food and restaurant spending below ₹5,000 this month.",
            "difficulty": "Medium",
            "objective_type": "save_amount",
            "target_value": 5000.0,
            "duration_days": 30,
            "xp_reward": 350,
            "icon": "Utensils"
        }
    ]

    for c_data in challenges_data:
        existing = db.query(Challenge).filter(Challenge.title == c_data["title"]).first()
        if not existing:
            db.add(Challenge(**c_data))
    db.commit()

    # 2. Seed System Achievements
    achievements_data = [
        {"code": "ACH_FIRST_TX", "name": "First Step", "description": "Logged your first transaction in FinQuest", "icon": "CheckCircle", "xp_reward": 50, "condition_type": "transaction_count", "condition_value": 1.0},
        {"code": "ACH_STREAK_7", "name": "Habit Builder", "description": "Maintained a 7-day transaction tracking streak", "icon": "Flame", "xp_reward": 250, "condition_type": "streak_days", "condition_value": 7.0},
        {"code": "ACH_STREAK_30", "name": "Unstoppable Tracker", "description": "Maintained a 30-day transaction tracking streak", "icon": "Zap", "xp_reward": 1000, "condition_type": "streak_days", "condition_value": 30.0},
        {"code": "ACH_SAVE_1K", "name": "Seed Saver", "description": "Saved your first ₹1,000 towards a goal", "icon": "ShieldCheck", "xp_reward": 150, "condition_type": "save_total", "condition_value": 1000.0},
        {"code": "ACH_SAVE_10K", "name": "Wealth Pioneer", "description": "Saved a total of ₹10,000 across savings goals", "icon": "Trophy", "xp_reward": 500, "condition_type": "save_total", "condition_value": 10000.0},
        {"code": "ACH_GOAL_DONE", "name": "Goal Crusher", "description": "Completed 1 financial savings goal 100%", "icon": "Award", "xp_reward": 500, "condition_type": "goal_complete", "condition_value": 1.0},
        {"code": "ACH_LVL_10", "name": "Quest Master", "description": "Reached Level 10 in FinQuest", "icon": "Crown", "xp_reward": 750, "condition_type": "level_reached", "condition_value": 10.0}
    ]

    for a_data in achievements_data:
        existing = db.query(Achievement).filter(Achievement.code == a_data["code"]).first()
        if not existing:
            db.add(Achievement(**a_data))
    db.commit()

    # 3. Seed Demo Users
    demo_user = db.query(User).filter(User.email == "demo@finquest.com").first()
    if not demo_user:
        demo_user = User(
            name="Alex Mercer",
            email="demo@finquest.com",
            password_hash=get_password_hash("password123"),
            avatar="avatar_hero",
            level=12,
            xp=2450,
            streak_count=14,
            currency="₹",
            monthly_income=75000.0,
            monthly_budget_target=45000.0,
            main_financial_goal="Buy New MacBook Pro & Emergency Fund",
            financial_experience="advanced",
            is_admin=False,
            is_onboarded=True,
            last_activity_date=datetime.datetime.utcnow()
        )
        db.add(demo_user)
        db.commit()

    admin_user = db.query(User).filter(User.email == "admin@finquest.com").first()
    if not admin_user:
        admin_user = User(
            name="FinQuest Admin",
            email="admin@finquest.com",
            password_hash=get_password_hash("admin123"),
            avatar="avatar_admin",
            level=25,
            xp=15000,
            streak_count=45,
            currency="₹",
            is_admin=True,
            is_onboarded=True
        )
        db.add(admin_user)
        db.commit()

    # 4. Seed Categories for Demo User
    default_cats = [
        ("Food & Dining", "Utensils", "#F59E0B"),
        ("Transportation", "Car", "#3B82F6"),
        ("Shopping", "ShoppingBag", "#EC4899"),
        ("Entertainment", "Film", "#8B5CF6"),
        ("Bills & Utilities", "Zap", "#EF4444"),
        ("Healthcare", "Heart", "#10B981"),
        ("Income & Salary", "DollarSign", "#10B981"),
        ("Subscriptions", "Repeat", "#06B6D4")
    ]

    cat_objs = {}
    for name, icon, color in default_cats:
        c = db.query(Category).filter(Category.user_id == demo_user.id, Category.name == name).first()
        if not c:
            c = Category(user_id=demo_user.id, name=name, icon=icon, color=color, is_custom=False)
            db.add(c)
            db.commit()
            db.refresh(c)
        cat_objs[name] = c

    # 5. Seed Transactions (50+ transactions for last 30 days)
    sample_descriptions = [
        ("Swiggy Gourmet Order", "Food & Dining", 450, "expense"),
        ("Zomato Dinner", "Food & Dining", 680, "expense"),
        ("Uber Ride to Office", "Transportation", 320, "expense"),
        ("Monthly Metro Pass", "Transportation", 1200, "expense"),
        ("Amazon Electronics", "Shopping", 2490, "expense"),
        ("Myntra Wardrobe Refresh", "Shopping", 1850, "expense"),
        ("PVR IMAX Ticket & Popcorn", "Entertainment", 750, "expense"),
        ("Netflix HD Subscription", "Subscriptions", 649, "expense"),
        ("Spotify Premium Family", "Subscriptions", 179, "expense"),
        ("Electricity & Power Bill", "Bills & Utilities", 1850, "expense"),
        ("High-Speed Fiber Wifi", "Bills & Utilities", 999, "expense"),
        ("Pharmacy Medicines", "Healthcare", 420, "expense"),
        ("Monthly Tech Salary", "Income & Salary", 75000, "income"),
        ("Freelance UI Project Payment", "Income & Salary", 15000, "income"),
    ]

    now = datetime.datetime.utcnow()
    existing_txs = db.query(Transaction).filter(Transaction.user_id == demo_user.id).count()
    if existing_txs < 10:
        for i in range(30):
            day_offset = 30 - i
            tx_date = now - datetime.timedelta(days=day_offset, hours=random.randint(1, 10))
            
            # Add 1-2 transactions per day
            for _ in range(random.randint(1, 2)):
                desc, cat_name, base_amount, t_type = random.choice(sample_descriptions)
                var_amount = float(base_amount + random.randint(-50, 150)) if base_amount < 10000 else float(base_amount)
                cat_obj = cat_objs.get(cat_name)

                t = Transaction(
                    user_id=demo_user.id,
                    amount=max(50.0, var_amount),
                    transaction_type=t_type,
                    category_id=cat_obj.id if cat_obj else None,
                    description=desc,
                    date=tx_date,
                    payment_method="UPI / HDFC Card"
                )
                db.add(t)
        db.commit()

    # 6. Seed Savings Goals
    goal1 = db.query(Goal).filter(Goal.user_id == demo_user.id, Goal.title == "New MacBook Pro M3").first()
    if not goal1:
        g1 = Goal(
            user_id=demo_user.id,
            title="New MacBook Pro M3",
            target_amount=150000.0,
            current_amount=68000.0,
            deadline=now + datetime.timedelta(days=120),
            category="Gadgets",
            status="active"
        )
        g2 = Goal(
            user_id=demo_user.id,
            title="Emergency Fund (6 Months)",
            target_amount=250000.0,
            current_amount=180000.0,
            deadline=now + datetime.timedelta(days=240),
            category="Financial Safety",
            status="active"
        )
        db.add(g1)
        db.add(g2)
        db.commit()

    # 7. Seed Budgets
    b_exist = db.query(Budget).filter(Budget.user_id == demo_user.id).first()
    if not b_exist:
        budget = Budget(
            user_id=demo_user.id,
            title="Monthly Master Budget",
            period="monthly",
            total_amount=45000.0
        )
        db.add(budget)
        db.commit()
        db.refresh(budget)

        bc1 = BudgetCategory(budget_id=budget.id, category_id=cat_objs["Food & Dining"].id, allocated_amount=10000.0)
        bc2 = BudgetCategory(budget_id=budget.id, category_id=cat_objs["Transportation"].id, allocated_amount=5000.0)
        bc3 = BudgetCategory(budget_id=budget.id, category_id=cat_objs["Shopping"].id, allocated_amount=8000.0)
        db.add_all([bc1, bc2, bc3])
        db.commit()

    # 8. Seed User Challenges & Achievements
    uc_exist = db.query(UserChallenge).filter(UserChallenge.user_id == demo_user.id).first()
    if not uc_exist:
        ch1 = db.query(Challenge).first()
        if ch1:
            uc = UserChallenge(
                user_id=demo_user.id,
                challenge_id=ch1.id,
                start_date=now - datetime.timedelta(days=2),
                end_date=now + datetime.timedelta(days=5),
                current_progress=4.0,
                status="active"
            )
            db.add(uc)
            db.commit()

    ua_exist = db.query(UserAchievement).filter(UserAchievement.user_id == demo_user.id).first()
    if not ua_exist:
        achs = db.query(Achievement).limit(4).all()
        for ach in achs:
            ua = UserAchievement(user_id=demo_user.id, achievement_id=ach.id, unlocked_at=now - datetime.timedelta(days=5))
            db.add(ua)
        db.commit()

    # 9. Seed Financial Health Score & Notification
    hs_exist = db.query(FinancialHealthScore).filter(FinancialHealthScore.user_id == demo_user.id).first()
    if not hs_exist:
        hs = FinancialHealthScore(
            user_id=demo_user.id,
            overall_score=78,
            savings_score=20,
            budget_score=21,
            consistency_score=18,
            goal_score=13,
            spending_score=6,
            calculated_at=now
        )
        db.add(hs)
        
        notif = Notification(
            user_id=demo_user.id,
            title="14-Day Streak Unlocked!",
            message="You've logged transactions consistently for 14 days! Keep up the momentum for extra XP.",
            type="streak_milestone",
            is_read=False
        )
        db.add(notif)
        db.commit()

    print("[SUCCESS] FinQuest Seed Completed Successfully!")
    print("--------------------------------------------------")
    print("Demo Account:  email: demo@finquest.com | password: password123")
    print("Admin Account: email: admin@finquest.com | password: admin123")
    print("--------------------------------------------------")

if __name__ == "__main__":
    seed_database()
