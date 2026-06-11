from fastapi import APIRouter
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Order
from schemas import OrderCreate

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("/")
def create_order(order: OrderCreate):

    db: Session = SessionLocal()

    try:
        new_order = Order(
            customer_id=order.customer_id,
            amount=order.amount,
            category=order.category
        )

        db.add(new_order)

        db.commit()

        db.refresh(new_order)

        return {
            "message": "Order created successfully",
            "order_id": new_order.id
        }

    finally:
        db.close()


@router.get("/")
def get_orders():

    db: Session = SessionLocal()

    try:
        orders = db.query(Order).all()
        return orders

    finally:
        db.close()