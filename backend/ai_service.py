from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def test_ai():

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": "Say hello"
            }
        ]
    )

    return response.choices[0].message.content

def generate_segment(prompt):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """
                Convert customer segmentation requests
                into JSON.

                Example:

                Input:
                High spending inactive customers

                Output:
                {
                    "min_spent": 5000,
                    "inactive_days": 30
                }

                ONLY return valid JSON.
                """
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content

def generate_campaign_message(prompt):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        temperature=0.3,
        messages=[
            {
                "role": "system",
                "content": """
                Generate ONLY ONE short SMS-style marketing message.

                STRICT RULES:
                - Maximum 2 sentences
                - No headings
                - No campaign names
                - No markdown
                - No bullet points
                - No hashtags
                - No email format
                - No explanations
                - Plain text only
                - Under 25 words

                Example:
                We miss you! Enjoy 20% OFF on your next order. Shop again today!
                """
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content.strip()