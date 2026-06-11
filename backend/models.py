from sqlalchemy import Column, Integer, String, Float
from database import Base

class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    email = Column(String)

    city = Column(String)

    total_spent = Column(Float)

    last_order_days_ago = Column(Integer)

class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer)

    amount = Column(Float)

    category = Column(String)