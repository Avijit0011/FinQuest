from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.models import User, Budget, BudgetCategory, Transaction, Category
from backend.schemas.schemas import BudgetCreate, BudgetResponse, BudgetCategoryResponse
from backend.auth.security import get_current_user

router = APIRouter(prefix="/budgets", tags=["Budgets"])

@router.get("", response_model=list[BudgetResponse])
def list_budgets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    
    # Calculate user's total expenses
    expenses = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.transaction_type == "expense"
    ).all()
    total_spent = sum([t.amount for t in expenses])

    result = []
    for b in budgets:
        b_spent = total_spent
        pct = (b_spent / b.total_amount * 100) if b.total_amount > 0 else 0.0
        
        cat_responses = []
        for bc in b.budget_categories:
            bc_spent = sum([t.amount for t in expenses if t.category_id == bc.category_id])
            cat_pct = (bc_spent / bc.allocated_amount * 100) if bc.allocated_amount > 0 else 0.0
            cat = db.query(Category).filter(Category.id == bc.category_id).first()
            cat_name = cat.name if cat else "Category"
            
            cat_responses.append(BudgetCategoryResponse(
                id=bc.id,
                category_id=bc.category_id,
                category_name=cat_name,
                allocated_amount=bc.allocated_amount,
                spent_amount=bc_spent,
                percentage=round(cat_pct, 1)
            ))

        result.append(BudgetResponse(
            id=b.id,
            user_id=b.user_id,
            title=b.title,
            period=b.period,
            total_amount=b.total_amount,
            spent_amount=b_spent,
            remaining_amount=max(0.0, b.total_amount - b_spent),
            percentage=round(pct, 1),
            start_date=b.start_date,
            end_date=b.end_date,
            categories=cat_responses
        ))

    return result

@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(b_in: BudgetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = Budget(
        user_id=current_user.id,
        title=b_in.title,
        period=b_in.period,
        total_amount=b_in.total_amount
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)

    for item in b_in.categories:
        bc = BudgetCategory(
            budget_id=budget.id,
            category_id=item.category_id,
            allocated_amount=item.allocated_amount
        )
        db.add(bc)
    
    db.commit()
    db.refresh(budget)

    return BudgetResponse(
        id=budget.id,
        user_id=budget.user_id,
        title=budget.title,
        period=budget.period,
        total_amount=budget.total_amount,
        spent_amount=0.0,
        remaining_amount=budget.total_amount,
        percentage=0.0,
        start_date=budget.start_date,
        end_date=budget.end_date,
        categories=[]
    )
