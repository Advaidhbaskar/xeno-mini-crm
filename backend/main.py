from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from database import Base

import models

from routes.customers import router as customer_router
from routes.orders import router as order_router
from routes.segment import router as segment_router
from routes.campaigns import router as campaign_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(customer_router)
app.include_router(order_router)
app.include_router(segment_router)
app.include_router(campaign_router)

@app.get("/")
def root():
    return {
        "message": "Xeno Mini CRM Backend Running"
    }