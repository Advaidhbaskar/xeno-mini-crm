from pydantic import BaseModel

class CustomerCreate(BaseModel):

    name: str
    email: str
    city: str
    total_spent: float
    last_order_days_ago: int

class OrderCreate(BaseModel):

    customer_id: int
    amount: float
    category: str