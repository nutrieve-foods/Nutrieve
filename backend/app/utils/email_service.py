# import os
# import requests

# POSTMARK_API_KEY = os.getenv("POSTMARK_API_KEY")
# POSTMARK_FROM_EMAIL = os.getenv("POSTMARK_FROM_EMAIL")

# def send_email(to_email: str, subject: str, body: str):
#     """
#     Sends an email using Postmark API.
#     Works on any hosting platform (Render, Vercel, Railway) without SMTP.
#     """

#     if not POSTMARK_API_KEY:
#         raise Exception("POSTMARK_API_KEY is missing in environment variables")

#     if not POSTMARK_FROM_EMAIL:
#         raise Exception("POSTMARK_FROM_EMAIL is missing in environment variables")

#     url = "https://api.postmarkapp.com/email"

#     payload = {
#         "From": POSTMARK_FROM_EMAIL,
#         "To": to_email,
#         "Subject": subject,
#         "TextBody": body,
#         "MessageStream": "outbound"  # Default Postmark stream
#     }

#     headers = {
#         "Accept": "application/json",
#         "Content-Type": "application/json",
#         "X-Postmark-Server-Token": POSTMARK_API_KEY
#     }

#     response = requests.post(url, json=payload, headers=headers)

#     if response.status_code != 200:
#         raise Exception(f"Postmark error: {response.text}")

#     return response.json()
