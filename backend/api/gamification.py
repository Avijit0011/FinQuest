import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Challenge, UserChallenge, Achievement, UserAchievement
from backend.schemas.schemas import (
    GamificationStatusResponse, ChallengeResponse, UserChallengeResponse, AchievementResponse
)
from backend.auth.security import get_current_user
from backend.services.gamification import (
    get_xp_for_level, get_level_for_xp, update_challenge_progress, evaluate_achievements
)

router = APIRouter(prefix="/gamification", tags=["Gamification"])

@router.get("/status", response_model=GamificationStatusResponse)
def get_gamification_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    evaluate_achievements(db, current_user)
    update_challenge_progress(db, current_user)

    current_level = get_level_for_xp(current_user.xp)
    curr_level_xp = get_xp_for_level(current_level)
    next_level_xp = get_xp_for_level(current_level + 1)
    
    xp_in_level = current_user.xp - curr_level_xp
    xp_needed = max(1, next_level_xp - curr_level_xp)
    progress_pct = min(100.0, max(0.0, (xp_in_level / xp_needed) * 100))

    unlocked_count = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).count()
    total_achievements = db.query(Achievement).count()
    active_challenges = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.status == "active"
    ).count()

    return GamificationStatusResponse(
        level=current_level,
        xp=current_user.xp,
        xp_for_current_level=curr_level_xp,
        xp_for_next_level=next_level_xp,
        xp_progress_percentage=round(progress_pct, 1),
        streak_count=current_user.streak_count,
        unlocked_achievements_count=unlocked_count,
        total_achievements_count=total_achievements,
        active_challenges_count=active_challenges
    )

@router.get("/challenges", response_model=list[UserChallengeResponse])
def get_user_challenges(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    update_challenge_progress(db, current_user)
    user_challenges = db.query(UserChallenge).filter(UserChallenge.user_id == current_user.id).all()
    
    res = []
    for uc in user_challenges:
        pct = (uc.current_progress / uc.challenge.target_value * 100) if uc.challenge.target_value > 0 else 0.0
        res.append(UserChallengeResponse(
            id=uc.id,
            user_id=uc.user_id,
            challenge_id=uc.challenge_id,
            challenge=ChallengeResponse.model_validate(uc.challenge),
            start_date=uc.start_date,
            end_date=uc.end_date,
            current_progress=uc.current_progress,
            percentage=round(min(100.0, pct), 1),
            status=uc.status
        ))
    return res

@router.get("/available-challenges", response_model=list[ChallengeResponse])
def list_available_challenges(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_challenge_ids = {
        uc.challenge_id for uc in db.query(UserChallenge).filter(
            UserChallenge.user_id == current_user.id,
            UserChallenge.status == "active"
        ).all()
    }
    challenges = db.query(Challenge).all()
    return [c for c in challenges if c.id not in user_challenge_ids]

@router.post("/challenges/{challenge_id}/join", response_model=UserChallengeResponse)
def join_challenge(challenge_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")

    existing = db.query(UserChallenge).filter(
        UserChallenge.user_id == current_user.id,
        UserChallenge.challenge_id == challenge_id,
        UserChallenge.status == "active"
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already joined this active challenge")

    start_date = datetime.datetime.utcnow()
    end_date = start_date + datetime.timedelta(days=challenge.duration_days)

    uc = UserChallenge(
        user_id=current_user.id,
        challenge_id=challenge.id,
        start_date=start_date,
        end_date=end_date,
        current_progress=0.0,
        status="active"
    )
    db.add(uc)
    db.commit()
    db.refresh(uc)

    return UserChallengeResponse(
        id=uc.id,
        user_id=uc.user_id,
        challenge_id=uc.challenge_id,
        challenge=ChallengeResponse.model_validate(challenge),
        start_date=uc.start_date,
        end_date=uc.end_date,
        current_progress=0.0,
        percentage=0.0,
        status=uc.status
    )

@router.get("/achievements", response_model=list[AchievementResponse])
def list_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    evaluate_achievements(db, current_user)
    user_achievements = {
        ua.achievement_id: ua.unlocked_at for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    }
    
    all_achievements = db.query(Achievement).all()
    res = []
    for ach in all_achievements:
        is_unlocked = ach.id in user_achievements
        res.append(AchievementResponse(
            id=ach.id,
            code=ach.code,
            name=ach.name,
            description=ach.description,
            icon=ach.icon,
            xp_reward=ach.xp_reward,
            condition_type=ach.condition_type,
            condition_value=ach.condition_value,
            is_unlocked=is_unlocked,
            unlocked_at=user_achievements.get(ach.id)
        ))
    return res
