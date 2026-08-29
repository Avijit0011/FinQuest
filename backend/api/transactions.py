import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from backend.database import get_db
from backend.models.models import User, Transaction, Category
from backend.schemas.schemas import (
    TransactionCreate, TransactionUpdate, TransactionResponse, TransactionListResponse,
    CategoryCreate, CategoryResponse
)
from backend.auth.security import get_current_user
from backend.services.gamification import award_xp, update_user_streak, evaluate_achievements
from ml.anomaly_detector import anomaly_detector

router = APIRouter(tags=["Transactions"])

@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Global default categories (user_id IS NULL) + user custom categories
    categories = db.query(Category).filter(
        (Category.user_id == current_user.id) | (Category.user_id == None)
    ).all()
    return categories

@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(cat: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = Category(
        user_id=current_user.id,
        name=cat.name,
        icon=cat.icon,
        color=cat.color,
        is_custom=True
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.post("/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    tx_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tx_date = tx_in.date or datetime.datetime.utcnow()

    # Check for anomaly against existing user expenses
    is_anomaly = False
    if tx_in.transaction_type == "expense":
        past_expenses = [t.amount for t in db.query(Transaction).filter(
            Transaction.user_id == current_user.id,
            Transaction.transaction_type == "expense"
        ).all()]
        if len(past_expenses) >= 5:
            anomalies = anomaly_detector.detect_anomalies(past_expenses + [tx_in.amount])
            is_anomaly = anomalies[-1]

    tx = Transaction(
        user_id=current_user.id,
        amount=tx_in.amount,
        transaction_type=tx_in.transaction_type,
        category_id=tx_in.category_id,
        description=tx_in.description,
        date=tx_date,
        payment_method=tx_in.payment_method,
        notes=tx_in.notes,
        is_flagged_anomaly=is_anomaly
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    # Trigger Gamification Engine
    update_user_streak(db, current_user)
    award_xp(db, current_user, 5, "transaction", f"Logged transaction: {tx.description}")
    evaluate_achievements(db, current_user)

    return tx

@router.get("/transactions", response_model=TransactionListResponse)
def list_transactions(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    transaction_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if search:
        query = query.filter(Transaction.description.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)

    total = query.count()
    items = query.order_by(Transaction.date.desc()).offset((page - 1) * size).limit(size).all()
    total_pages = (total + size - 1) // size if total > 0 else 1

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "total_pages": total_pages
    }

@router.put("/transactions/{tx_id}", response_model=TransactionResponse)
def update_transaction(
    tx_id: int,
    tx_in: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tx = db.query(Transaction).filter(Transaction.id == tx_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    if tx_in.amount is not None:
        tx.amount = tx_in.amount
    if tx_in.transaction_type is not None:
        tx.transaction_type = tx_in.transaction_type
    if tx_in.category_id is not None:
        tx.category_id = tx_in.category_id
    if tx_in.description is not None:
        tx.description = tx_in.description
    if tx_in.date is not None:
        tx.date = tx_in.date
    if tx_in.payment_method is not None:
        tx.payment_method = tx_in.payment_method
    if tx_in.notes is not None:
        tx.notes = tx_in.notes

    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/transactions/{tx_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(tx_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id, Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    db.delete(tx)
    db.commit()
