import datetime
import math
from sqlalchemy.orm import Session
from backend.models.models import (
    User, XPTransaction, Achievement, UserAchievement, Challenge, UserChallenge,
    Notification, Transaction, Goal, Budget
)

XP_REWARDS = {
    "LOG_TRANSACTION": 5,
    "DAILY_BUDGET_MET": 20,
    "CHALLENGE_COMPLETE": 100,
    "SAVINGS_MILESTONE": 200,
    "GOAL_COMPLETE": 500,
    "STREAK_7_DAYS": 250,
    "STREAK_30_DAYS": 1000
}

def get_xp_for_level(level: int) -> int:
    if level <= 1:
        return 0
    return int(500 * math.pow(level - 1, 1.4))

def get_level_for_xp(xp: int) -> int:
    level = 1
    while get_xp_for_level(level + 1) <= xp:
        level += 1
    return level

def award_xp(db: Session, user: User, amount: int, source_type: str, description: str) -> dict:
    if amount <= 0:
        return {"leveled_up": False, "new_level": user.level, "xp_gained": 0}

    user.xp += amount
    
    # Create XP Transaction Record
    xp_tx = XPTransaction(
        user_id=user.id,
        source_type=source_type,
        xp_amount=amount,
        description=description,
        created_at=datetime.datetime.utcnow()
    )
    db.add(xp_tx)

    old_level = user.level
    new_level = get_level_for_xp(user.xp)
    leveled_up = new_level > old_level

    if leveled_up:
        user.level = new_level
        # Create Level Up Notification
        notification = Notification(
            user_id=user.id,
            title="🎉 Level Up!",
            message=f"Congratulations! You reached Level {new_level} in your financial quest!",
            type="level_up",
            is_read=False
        )
        db.add(notification)

    db.commit()
    db.refresh(user)

    return {
        "leveled_up": leveled_up,
        "old_level": old_level,
        "new_level": new_level,
        "xp_gained": amount,
        "current_xp": user.xp
    }

def update_user_streak(db: Session, user: User) -> int:
    today = datetime.datetime.utcnow().date()
    
    if not user.last_activity_date:
        user.streak_count = 1
        user.last_activity_date = datetime.datetime.utcnow()
        db.commit()
        return 1

    last_date = user.last_activity_date.date()
    days_diff = (today - last_date).days

    if days_diff == 1:
        user.streak_count += 1
        user.last_activity_date = datetime.datetime.utcnow()
        # Award bonus XP for streak milestone
        if user.streak_count == 7:
            award_xp(db, user, XP_REWARDS["STREAK_7_DAYS"], "streak", "Reached 7-Day Streak!")
        elif user.streak_count == 30:
            award_xp(db, user, XP_REWARDS["STREAK_30_DAYS"], "streak", "Reached 30-Day Streak!")
    elif days_diff > 1:
        user.streak_count = 1
        user.last_activity_date = datetime.datetime.utcnow()
    # if days_diff == 0, keep current streak

    db.commit()
    return user.streak_count

def evaluate_achievements(db: Session, user: User) -> list[str]:
    unlocked_names = []
    
    # Fetch user unlocked achievement IDs
    unlocked_ids = {ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()}
    
    # Calculate user metrics
    tx_count = db.query(Transaction).filter(Transaction.user_id == user.id).count()
    completed_goals = db.query(Goal).filter(Goal.user_id == user.id, Goal.status == "completed").count()
    total_saved = sum([g.current_amount for g in db.query(Goal).filter(Goal.user_id == user.id).all()])
    
    # Fetch all achievements
    all_achievements = db.query(Achievement).all()

    for ach in all_achievements:
        if ach.id in unlocked_ids:
            continue

        unlocked = False
        if ach.condition_type == "transaction_count" and tx_count >= ach.condition_value:
            unlocked = True
        elif ach.condition_type == "streak_days" and user.streak_count >= ach.condition_value:
            unlocked = True
        elif ach.condition_type == "save_total" and total_saved >= ach.condition_value:
            unlocked = True
        elif ach.condition_type == "goal_complete" and completed_goals >= ach.condition_value:
            unlocked = True
        elif ach.condition_type == "level_reached" and user.level >= ach.condition_value:
            unlocked = True

        if unlocked:
            ua = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                unlocked_at=datetime.datetime.utcnow()
            )
            db.add(ua)
            unlocked_names.append(ach.name)

            # Award XP & notification
            award_xp(db, user, ach.xp_reward, "achievement", f"Unlocked Achievement: {ach.name}")
            notif = Notification(
                user_id=user.id,
                title="🏆 Achievement Unlocked!",
                message=f"You unlocked '{ach.name}' and earned +{ach.xp_reward} XP!",
                type="achievement_unlock",
                is_read=False
            )
            db.add(notif)

    db.commit()
    return unlocked_names

def update_challenge_progress(db: Session, user: User):
    active_user_challenges = db.query(UserChallenge).filter(
        UserChallenge.user_id == user.id,
        UserChallenge.status == "active"
    ).all()

    today = datetime.datetime.utcnow()

    for uc in active_user_challenges:
        if uc.end_date < today:
            # Check if target reached
            if uc.current_progress >= uc.challenge.target_value:
                uc.status = "completed"
                award_xp(db, user, uc.challenge.xp_reward, "challenge", f"Completed Challenge: {uc.challenge.title}")
            else:
                uc.status = "failed"
            continue

        ch = uc.challenge
        if ch.objective_type == "transaction_count":
            count = db.query(Transaction).filter(
                Transaction.user_id == user.id,
                Transaction.date >= uc.start_date
            ).count()
            uc.current_progress = float(count)
        elif ch.objective_type == "save_amount":
            saved = sum([
                g.current_amount for g in db.query(Goal).filter(Goal.user_id == user.id).all()
            ])
            uc.current_progress = float(saved)

        if uc.current_progress >= ch.target_value:
            uc.status = "completed"
            award_xp(db, user, ch.xp_reward, "challenge", f"Completed Challenge: {ch.title}")
            notif = Notification(
                user_id=user.id,
                title="🎯 Challenge Completed!",
                message=f"You finished '{ch.title}' and earned +{ch.xp_reward} XP!",
                type="challenge_complete",
                is_read=False
            )
            db.add(notif)

    db.commit()
