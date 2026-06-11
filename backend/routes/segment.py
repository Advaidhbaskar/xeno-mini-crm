from fastapi import APIRouter
import json

from sqlalchemy.orm import Session

from ai_service import generate_segment
from database import SessionLocal
from models import Customer

router = APIRouter(
    prefix="/segment",
    tags=["AI Segmentation"]
)

@router.post("/")
def segment_customers(data: dict):

    prompt = data["prompt"]

    ai_result = generate_segment(prompt)

    cleaned_result = ai_result.replace("```json", "").replace("```", "").strip()

    filters = json.loads(cleaned_result)

    db: Session = SessionLocal()

    customers = db.query(Customer).filter(
        Customer.total_spent >= filters["min_spent"],
        Customer.last_order_days_ago >= filters["inactive_days"]
    ).all()

    return {
        "filters": filters,
        "matching_customers": customers
    }