from fastapi import FastAPI
import random
import requests

app = FastAPI()

@app.post("/send")

def send_campaign(data: dict):

    customer_id = data["customer_id"]
    message = data["message"]

    delivery_status = random.choice([
        "SENT",
        "FAILED"
    ])

    callback_data = {
        "customer_id": customer_id,
        "status": delivery_status
    }

    try:
        requests.post(
            "https://xeno-backend-uqlu.onrender.com/campaigns/delivery-receipt",
            json=callback_data
        )
    except:
        pass

    return {
        "message": message,
        "delivery_status": delivery_status
    }