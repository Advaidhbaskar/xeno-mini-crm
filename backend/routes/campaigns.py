from fastapi import APIRouter
import requests

from ai_service import generate_campaign_message

router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"]
)

delivery_receipts = []

@router.post("/generate-message")
def create_campaign_message(data: dict):

    prompt = data["prompt"]

    message = generate_campaign_message(prompt)

    return {
        "generated_message": message
    }


@router.post("/send")

def send_campaign(data: dict):

    customer_id = data["customer_id"]

    message = data["message"]

    response = requests.post(
        "https://xeno-channel-service-dsev.onrender.com/send",
        json={
            "customer_id": customer_id,
            "message": message
        }
    )

    return response.json()


@router.post("/delivery-receipt")

def receive_delivery_receipt(data: dict):

    delivery_receipts.append(data)

    return {
        "message": "Receipt received",
        "data": data
    }


@router.get("/delivery-receipts")

def get_delivery_receipts():

    return delivery_receipts