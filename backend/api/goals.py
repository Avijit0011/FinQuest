import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Goal, GoalContribution
from backend.schemas.schemas import GoalCreate, GoalContributionCreate, GoalResponse
from backend.auth.security import get_current_user
from backend.services.gamification import award_xp, evaluate_achievements

router = APIRouter(prefix="/goals", tags=["Goals"])

def format_goal_response(goal: Goal) -> GoalResponse:
    pct = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0.0
    remaining = max(0.0, goal.target_amount - goal.current_amount)

    today = datetime.datetime.utcnow()
    days_left = max(1, (goal.deadline - today).days)
    months_left = max(1.0, days_left / 30.0)
    weeks_left = max(1.0, days_left / 7.0)

    req_monthly = remaining / months_left
    req_weekly = remaining / weeks_left

    return GoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        title=goal.title,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        deadline=goal.deadline,
        category=goal.category,
        status=goal.status,
        percentage=round(pct, 1),
        required_monthly_saving=round(req_monthly, 2),
        required_weekly_saving=round(req_weekly, 2),
        created_at=goal.created_at
    )

@router.get("", response_model=list[GoalResponse])
def list_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).order_by(Goal.created_at.desc()).all()
    return [format_goal_response(g) for g in goals]

@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(goal_in: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = Goal(
        user_id=current_user.id,
        title=goal_in.title,
        target_amount=goal_in.target_amount,
        current_amount=0.0,
        deadline=goal_in.deadline,
        category=goal_in.category,
        status="active"
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return format_goal_response(goal)

@router.post("/{goal_id}/contributions", response_model=GoalResponse)
def add_contribution(
    goal_id: int,
    contrib: GoalContributionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    contribution = GoalContribution(
        goal_id=goal.id,
        user_id=current_user.id,
        amount=contrib.amount,
        notes=contrib.notes,
        date=datetime.datetime.utcnow()
    )
    db.add(contribution)

    old_pct = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0
    goal.current_amount += contrib.amount
    new_pct = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0

    if goal.current_amount >= goal.target_amount and goal.status != "completed":
        goal.status = "completed"
        award_xp(db, current_user, 500, "goal", f"Completed Savings Goal: {goal.title}")
    elif old_pct < 50 and new_pct >= 50:
        award_xp(db, current_user, 200, "goal", f"Reached 50% on Goal: {goal.title}")
    else:
        award_xp(db, current_user, 20, "goal", f"Contributed to Goal: {goal.title}")

    evaluate_achievements(db, current_user)

    db.commit()
    db.refresh(goal)
    return format_goal_response(goal)

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return None
