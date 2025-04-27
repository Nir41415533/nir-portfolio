import os
from dotenv import load_dotenv
import time
from datetime import datetime, timedelta
import uuid
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator
import openai
import uvicorn

# Load environment variables
load_dotenv()

# Generate or load admin token
def get_admin_token():
    token = os.getenv('ADMIN_TOKEN')
    if not token:
        # Generate a new UUID if no token exists
        token = str(uuid.uuid4())
        print("\n" + "="*50)
        print("IMPORTANT: ADMIN TOKEN GENERATED")
        print("="*50)
        print(f"Your admin token is: {token}")
        print("\nPlease add this to your .env file as:")
        print(f"ADMIN_TOKEN={token}")
        print("="*50 + "\n")
    else:
        print("\n" + "="*50)
        print("ADMIN TOKEN FOUND IN .env FILE")
        print("="*50)
        print(f"Current admin token: {token}")
        print("="*50 + "\n")
    return token

# Set OpenAI API key
openai_api_key = os.getenv('OPENAI_API_KEY')
openai.api_key = openai_api_key

# Validate OpenAI API key
if not openai_api_key or not openai_api_key.startswith('sk-'):
    print("\n" + "="*50)
    print("ERROR: INVALID OPENAI API KEY")
    print("="*50)
    print("Your OpenAI API key is missing or invalid.")
    print("Please add a valid API key to your .env file as:")
    print("OPENAI_API_KEY=sk-...")
    print("="*50 + "\n")
    print("The chatbot will not function without a valid API key.")

# Get admin token
admin_token = get_admin_token()

# Initialize FastAPI app
app = FastAPI(title="Nir's Portfolio API", 
              description="API for Nir's portfolio with chatbot functionality",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="."), name="static")

# Track API usage and suspicious activity
api_usage = {}
blocked_ips = {}

# System message for the AI
SYSTEM_MESSAGE = {
    "role": "system",
    "content": """
You are a dedicated AI assistant for Nir Ohayon's personal portfolio website.

=== About Nir Ohayon ===
- Full name: Nir Ohayon (ניר אוחיון).
- Nir is a Full Stack Developer specializing in Python, Django, Flask, JavaScript, React, SQL (MS SQL, SQLite), Docker, Jenkins, HTML, and CSS.
- He is a third-year Computer Science student at SCE College, with a GPA of 88.
- He holds certifications in Information Security and Data Science.
- Nir's main projects include:
  • Shemaython: A custom programming language interpreter supporting logic, loops, strings, and arithmetic.
  • Client-Server System: A multi-threaded C++ server-client system with TCP/IP communication.
  • DevOps Blog: A Flask-based blog platform with admin functionalities.
  • Django Blog Platform: A content management system with bookmarking features.
  • Password Manager: A secure password storage system in Python.
- Professional Experience:
  • Supply Chain Manager at Unilog (since 2023), including Python automation tasks.
  • Combat Medic in the IDF (2016–2019), managing medical clinic operations and training.

=== Purpose ===
Your ONLY role is to assist users with information about Nir Ohayon (ניר אוחיון).

Strictly focus on:
- Nir’s skills, technologies he uses, and areas of expertise.
- Nir’s academic background, certifications, and education.
- Nir’s projects and professional experience.
- How to contact Nir (phone, email, LinkedIn, GitHub).
- Career advice, web development, or tech topics ONLY if clearly related to Nir's background.

When providing contact information about Nir Ohayon, you MUST give full details:
- Phone: 054-6269965
- Email: nir41415511@gmail.com
- LinkedIn: https://linkedin.com/in/python-fighter
- GitHub: https://github.com/Nir41415533
Do not omit, redact, or generalize any of these details.

=== Language Instructions ===
- If the user writes in Hebrew, you MUST reply entirely in Hebrew, using native fluent Hebrew.
- Hebrew responses must be formatted for right-to-left (RTL) display.
- If the user writes in English, respond in English.
- Maintain professionalism, friendliness, and concise responses in both languages.
- Always use the correct spelling of the name: "ניר אוחיון" in Hebrew and "Nir Ohayon" in English.
- Never invent or incorrectly translate project names or other specific terms.

=== Important Behavior Rules ===
- If the question clearly relates to Nir Ohayon, answer clearly and helpfully.
- If the question is unrelated (news, sports, celebrities, recipes, world facts, etc.), politely reply:

  "I'm here to assist only with information related to Nir Ohayon. Please feel free to ask me about his skills, projects, experience, or contact details."

- If unsure whether the question is related, assume it is NOT and politely redirect.

=== Example Responses ===
- Allowed: "Nir Ohayon is skilled in Python, Django, and React."
- Allowed (Hebrew): "ניר אוחיון מתמחה ב־Python, Django ו־React."
- Not Allowed: "I don't have information about Albert Einstein. I'm here to assist with questions about Nir Ohayon."
- Not Allowed (Hebrew): "אין לי מידע על אלברט איינשטיין. אני כאן לעזור רק בנוגע לניר אוחיון."

Be professional, helpful, respectful, and focused on supporting visitors interested in Nir Ohayon (ניר אוחיון).
"""
}


def is_ip_blocked(ip: str) -> bool:
    if ip in blocked_ips:
        if datetime.now() - blocked_ips[ip] < timedelta(hours=24):
            return True
        else:
            del blocked_ips[ip]
    return False

def track_usage(ip: str, message_length: int = 0):
    now = datetime.now()
    
    # Check if IP is blocked
    if is_ip_blocked(ip):
        time_remaining = blocked_ips[ip] + timedelta(hours=24) - now
        raise HTTPException(
            status_code=429, 
            detail=f"IP is blocked due to suspicious activity. You can try again in {time_remaining.seconds // 3600} hours and {(time_remaining.seconds % 3600) // 60} minutes."
        )
    
    if ip not in api_usage:
        api_usage[ip] = {
            'daily_usage': 0,
            'hourly_usage': 0,
            'last_reset_daily': now,
            'last_reset_hourly': now,
            'consecutive_errors': 0,
            'last_request_time': now,
            'total_tokens': 0,
            'last_reset_tokens': now
        }
    
    # Check for rapid requests
    time_since_last_request = now - api_usage[ip]['last_request_time']
    if time_since_last_request < timedelta(seconds=2):
        api_usage[ip]['consecutive_errors'] += 1
        if api_usage[ip]['consecutive_errors'] > 3:
            blocked_ips[ip] = now
            time_remaining = timedelta(hours=24)
            raise HTTPException(
                status_code=429, 
                detail=f"IP blocked due to rapid requests. You can try again in 24 hours."
            )
    else:
        api_usage[ip]['consecutive_errors'] = 0
    
    api_usage[ip]['last_request_time'] = now
    
    # Reset counters if needed
    if now - api_usage[ip]['last_reset_daily'] > timedelta(days=1):
        api_usage[ip]['daily_usage'] = 0
        api_usage[ip]['last_reset_daily'] = now
    
    if now - api_usage[ip]['last_reset_hourly'] > timedelta(hours=1):
        api_usage[ip]['hourly_usage'] = 0
        api_usage[ip]['last_reset_hourly'] = now
    
    # Reset token counter every 24 hours
    if now - api_usage[ip]['last_reset_tokens'] > timedelta(days=1):
        api_usage[ip]['total_tokens'] = 0
        api_usage[ip]['last_reset_tokens'] = now
    
    # Increment usage
    api_usage[ip]['daily_usage'] += 1
    api_usage[ip]['hourly_usage'] += 1
    
    # Update token usage
    if message_length > 0:
        estimated_tokens = message_length // 4
        api_usage[ip]['total_tokens'] += estimated_tokens
    
    # Check limits and calculate remaining time
    if api_usage[ip]['daily_usage'] > 40:
        time_remaining = api_usage[ip]['last_reset_daily'] + timedelta(days=1) - now
        raise HTTPException(
            status_code=429, 
            detail=f"Daily message limit reached. You can try again in {time_remaining.seconds // 3600} hours and {(time_remaining.seconds % 3600) // 60} minutes."
        )
    
    if api_usage[ip]['hourly_usage'] > 10:
        time_remaining = api_usage[ip]['last_reset_hourly'] + timedelta(hours=1) - now
        raise HTTPException(
            status_code=429, 
            detail=f"Too many messages. Please wait {time_remaining.seconds // 60} minutes before trying again."
        )
    
    if api_usage[ip]['total_tokens'] > 10000:
        time_remaining = api_usage[ip]['last_reset_tokens'] + timedelta(days=1) - now
        raise HTTPException(
            status_code=429, 
            detail=f"Daily token limit reached. You can try again in {time_remaining.seconds // 3600} hours and {(time_remaining.seconds % 3600) // 60} minutes."
        )

# Define request and response models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    
    @validator('message')
    def message_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Message cannot be empty')
        if len(v) > 1000:
            raise ValueError('Message too long')
        return v

class ChatResponse(BaseModel):
    response: str

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: Request, chat_request: ChatRequest):
    try:
        # Track usage and check for suspicious activity
        client_ip = request.client.host
        try:
            track_usage(client_ip, len(chat_request.message))
        except HTTPException as rate_limit_error:
            # Return the rate limit error as a structured response
            return JSONResponse(
                status_code=429,
                content={"response": rate_limit_error.detail, "error": True, "error_type": "rate_limit"}
            )
        
        try:
            # Print received history for debugging
            print(f"Received message: {chat_request.message}")
            print(f"Received history length: {len(chat_request.history)}")
            
            messages = [
                SYSTEM_MESSAGE,
                *chat_request.history,
                {"role": "user", "content": chat_request.message}
            ]

            print(f"Calling OpenAI API with {len(messages)} messages")
            
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    temperature=0.5,
                    max_tokens=300,
                    presence_penalty=0.6,
                    frequency_penalty=0.6
                )
                
                bot_message = response.choices[0].message.content
                print(f"Bot response: {bot_message}")
                
                # Make sure we return a properly formatted response
                return ChatResponse(response=bot_message)
                
            except openai.error.AuthenticationError:
                print("OpenAI API Authentication Error - Check your API key")
                return JSONResponse(
                    status_code=500,
                    content={
                        "response": "There's an issue with the API configuration. Please contact the website administrator.",
                        "error": True,
                        "error_type": "authentication"
                    }
                )
                
            except openai.error.RateLimitError:
                print("OpenAI API Rate Limit Error")
                return JSONResponse(
                    status_code=429,
                    content={
                        "response": "I'm experiencing high demand right now. Please try again in a few moments.",
                        "error": True,
                        "error_type": "openai_rate_limit"
                    }
                )
                
            except openai.error.InvalidRequestError as e:
                print(f"OpenAI API Invalid Request Error: {str(e)}")
                return JSONResponse(
                    status_code=400,
                    content={
                        "response": "I encountered an issue processing your request. Please try again with a different question.",
                        "error": True,
                        "error_type": "invalid_request"
                    }
                )
                
            except Exception as e:
                print(f"OpenAI API Unexpected Error: {str(e)}")
                return JSONResponse(
                    status_code=500,
                    content={
                        "response": f"I'm having trouble processing your request: {str(e)}",
                        "error": True,
                        "error_type": "openai_error"
                    }
                )

        except Exception as e:
            error_message = str(e).lower()
            print(f"Inner Exception: {error_message}")
            
            if "insufficient_quota" in error_message:
                return JSONResponse(
                    status_code=429,
                    content={
                        "response": "I'm currently unavailable due to API usage limits. Please try again later.",
                        "error": True,
                        "error_type": "quota_exceeded"
                    }
                )
            elif "rate_limit" in error_message:
                return JSONResponse(
                    status_code=429,
                    content={
                        "response": "I'm experiencing high demand right now. Please try again in a few moments.",
                        "error": True,
                        "error_type": "rate_limit"
                    }
                )
            elif "authentication" in error_message:
                return JSONResponse(
                    status_code=401,
                    content={
                        "response": "There's an issue with the API configuration. Please contact the website administrator.",
                        "error": True,
                        "error_type": "authentication"
                    }
                )
            else:
                print(f"OpenAI API error: {str(e)}")
                return JSONResponse(
                    status_code=500,
                    content={
                        "response": f"I'm having trouble processing your request: {str(e)}",
                        "error": True,
                        "error_type": "general_error"
                    }
                )

    except HTTPException as e:
        # Convert HTTP exceptions to JSON responses
        return JSONResponse(
            status_code=e.status_code,
            content={"response": e.detail, "error": True, "error_type": "http_exception"}
        )
    except Exception as e:
        print(f"Outer Exception in chat endpoint: {str(e)}")
        # Return a structured error response
        return JSONResponse(
            status_code=500,
            content={
                "response": f"I'm sorry, I encountered an error: {str(e)[:100]}",
                "error": True,
                "error_type": "server_error"
            }
        )

def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.replace("Bearer ", "")
    if token != admin_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return token

# Usage monitoring endpoint
@app.get("/api/usage")
async def get_usage(token: str = Depends(verify_token)):
    return {
        'total_users': len(api_usage),
        'usage_by_ip': api_usage,
        'blocked_ips': list(blocked_ips.keys())
    }

# Root endpoint
@app.get("/")
async def root():
    return FileResponse("index.html")

@app.get("/{file_path:path}")
async def serve_static(file_path: str):
    if file_path and os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)