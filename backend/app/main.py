import os
from dotenv import load_dotenv
import time
from datetime import datetime, timedelta
import uuid
from typing import Dict, List, Optional, Any
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException, Depends, Header
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator

import openai
import uvicorn

# Load environment variables from backend/.env
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=backend_dir / '.env')

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
    print("WARNING: INVALID OPENAI API KEY")
    print("="*50)
    print("Your OpenAI API key is missing or invalid.")
    print("Please add a valid API key to your .env file as:")
    print("OPENAI_API_KEY=sk-...")
    print("="*50 + "\n")
    print("The chatbot will work with local responses only.")

# Get admin token
admin_token = get_admin_token()

# Initialize FastAPI app
app = FastAPI(title="Nir's Portfolio API", 
              description="API for Nir's portfolio with chatbot functionality",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Mount static files directory
STATIC_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Serve the main index.html at root
@app.get("/")
async def serve_index():
    return FileResponse(STATIC_DIR / "index.html")
# Track API usage and suspicious activity
api_usage = {}
blocked_ips = {}

# System message for the AI
SYSTEM_MESSAGE = {
    "role": "system",
    "content": """
You are a professional AI assistant dedicated to Nir Ohayon's personal portfolio website.

=== About Nir Ohayon ===
- Full Name: Nir Ohayon 
- Title: Full Stack Developer
- Specialties: Python, Django, Flask, FastAPI, JavaScript, SQL (MS SQL, SQLite, PostgreSQL), HTML, CSS
- Current Learning: DevOps technologies (Docker, Jenkins, Kubernetes, AWS)
- Education: Third-year Computer Science student at SCE College 
- Certifications: Information Security, Data Science
- Key Projects:
  • Shemaython – Custom programming language interpreter
  • Client-Server System – Multi-threaded client-server communication in C++
  • DevOps Blog – Blog platform using Flask with admin panel
  • Django Blog Platform – Django CMS with bookmarking features
  • Password Manager – Secure password management system in Python
  • Nir's Protfolio With AI ChatBot – AI chatbot interface within the portfolio

  === Name Clarification ===
- If the user mentions "Nir" alone, always understand it as referring to Nir Ohayon.
- Treat "Nir" and "Nir Ohayon" and "ניר אוחיון" and "ניר" as exactly the same person in all contexts.

=== Professional Experience ===
• Supply Chain Manager, Unilog (2023–present)
– Leading supply chain operations while collaborating with international clients in fluent English
– Managing high-level customer service and support alongside process optimization
– Developing automation tools using Python to improve operational efficiency

• Combat Medic, IDF (2016–2019)
– Provided critical medical care in high-pressure environments
– Demonstrated leadership, teamwork, and crisis management skills

=== Language Rules ===
- If the user writes in Hebrew: reply fully in Hebrew, in a fluent and natural style, properly formatted for RTL readers.
- If the user writes in English: reply fully in English, in a professional but friendly tone.
- Never mix Hebrew and English unless the user explicitly requests.

=== Scope of Answers ===
- Only answer questions related to Nir Ohayon: his skills, technologies, education, experience, projects, or contact details.
- If the question is unrelated, politely reply:
  \"I'm here to assist only with information related to Nir Ohayon. Please feel free to ask me about his skills, projects, experience, or contact details.\"

  === Truthfulness Policy ===
- Never invent facts about Nir Ohayon's experience or opinions.
- Only mention technologies, tools, or preferences if explicitly listed in the profile or projects.
- If the user asks about something not covered, politely reply:
  "There is no available information about Nir Ohayon's experience with that technology."

  === Special Case: Hiring Interest ===
- If the user expresses intent to hire or work with Nir Ohayon, thank them warmly and immediately provide Nir's contact details.
- Sample reply:
  "Thank you for your interest in hiring Nir Ohayon! You can contact him directly via email at nir41415511@gmail.com, phone at 054-6269965, or through LinkedIn at https://linkedin.com/in/python-fighter. He looks forward to hearing from you!"

=== Contact Details ===
(Provide when requested or appropriate)
- Phone: 054-6269965
- Email: nir41415511@gmail.com
- LinkedIn: https://linkedin.com/in/python-fighter
- GitHub: https://github.com/Nir41415533

=== Important Behavior ===
- Never fabricate or modify project names or professional facts.
- Be friendly, professional, concise, and clear.
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
        # Track usage and check for suspicious activity (disabled for testing)
        client_ip = request.client.host
        # try:
        #     track_usage(client_ip, len(chat_request.message))
        # except HTTPException as rate_limit_error:
        #     # Return the rate limit error as a structured response
        #     return JSONResponse(
        #         status_code=429,
        #         content={"response": rate_limit_error.detail, "error": True, "error_type": "rate_limit"}
        #     )
        
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
            
            # Check if we have a valid API key
            if not openai_api_key or not openai_api_key.startswith('sk-'):
                # Return local response when API key is invalid
                local_response = "I'm currently running in local mode without AI. You can ask me about:\n\n"
                local_response += "• help - Show available commands\n"
                local_response += "• ls - List files and directories\n"
                local_response += "• pwd - Show current directory\n"
                local_response += "• whoami - Show user info\n"
                local_response += "• skills - Show my skills\n"
                local_response += "• projects - Show my projects\n"
                local_response += "• about - Show about me\n"
                local_response += "• contact - Show contact info\n\n"
                local_response += "For AI-powered responses, please add a valid OpenAI API key to backend/.env\n"
                local_response += "Server is running on port 8001."
                
                return ChatResponse(response=local_response)
            
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
    return FileResponse(str(STATIC_DIR / "index.html"))

@app.get("/{file_path:path}")
async def serve_static(file_path: str):
    requested_path = (STATIC_DIR / file_path).resolve()

    # לא מאפשר לצאת מגבולות static
    if not str(requested_path).startswith(str(STATIC_DIR)):
        raise HTTPException(status_code=403, detail="Access denied")

    if requested_path.is_file():
        return FileResponse(str(requested_path))
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)