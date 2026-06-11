from fastapi import APIRouter
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Customer
from schemas import CustomerCreate

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

@router.post("/")
def create_customer(customer: CustomerCreate):

    db: Session = SessionLocal()

    try:
        new_customer = Customer(
            name=customer.name,
            email=customer.email,
            city=customer.city,
            total_spent=customer.total_spent,
            last_order_days_ago=customer.last_order_days_ago
        )

        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)

        return {
            "message": "Customer created successfully",
            "customer_id": new_customer.id
        }

    finally:
        db.close()


@router.get("/")
def get_customers():

    db: Session = SessionLocal()

    try:
        customers = db.query(Customer).all()
        return customers

    finally:
        db.close()