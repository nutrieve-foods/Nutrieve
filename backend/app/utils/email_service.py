import os
import requests

POSTMARK_API_KEY = os.getenv("POSTMARK_API_KEY")
POSTMARK_FROM_EMAIL = os.getenv("POSTMARK_FROM_EMAIL")

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email using Postmark API.
    Gracefully fails if Postmark blocks (pending approval).
    """

    if not POSTMARK_API_KEY or not POSTMARK_FROM_EMAIL:
        print("⚠️ Email skipped: Postmark env vars missing")
        return

    url = "https://api.postmarkapp.com/email"

    payload = {
        "From": POSTMARK_FROM_EMAIL,
        "To": to_email,
        "Subject": subject,
        "TextBody": body,
        "MessageStream": "outbound"
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": POSTMARK_API_KEY
    }

    try:
        response = requests.post(url, json=payload, headers=headers)

        if response.status_code != 200:
            # IMPORTANT: do NOT raise Exception
            print("⚠️ Postmark blocked email:", response.text)

    except Exception as e:
        print("⚠️ Email send failed:", e)

