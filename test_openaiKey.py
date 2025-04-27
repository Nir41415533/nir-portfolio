from openai import OpenAI
from dotenv import load_dotenv
import os

# טען משתני סביבה
load_dotenv()

# צור לקוח עם המפתח
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

try:
    print("🔍 שולח בקשת בדיקה ל־OpenAI...")

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello, who are you?"}
        ],
        temperature=0.7
    )

    print("✅ הכל תקין! התשובה שהתקבלה:")
    print(response.choices[0].message.content)

except Exception as e:
    print(f"❌ שגיאה: {str(e)}")
