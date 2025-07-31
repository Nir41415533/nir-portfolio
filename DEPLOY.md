# Render Deployment Guide

## Files Updated for Deployment

1. **requirements.txt** - Streamlined dependencies
2. **backend/app/main.py** - Added root route and production CORS
3. **frontend/static/js/chatbot.js** - Dynamic API URL for dev/prod
4. **start.py** - Entry point for Render
5. **build.sh** - Build script

## Render Setup Instructions

1. **Create New Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure Build & Deploy**:
   - **Build Command**: `./build.sh`
   - **Start Command**: `python start.py`
   - **Environment**: `Python 3`

4. **Environment Variables** to set in Render:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ADMIN_TOKEN`: admin123 (or generate new one)

5. **Deploy** - Render will automatically build and deploy

## What Changed

- ✅ FastAPI now serves static files and main page
- ✅ Chatbot automatically detects dev vs production
- ✅ CORS configured for production
- ✅ Dependencies optimized
- ✅ Proper entry point created

## Local Development

Still works as before:
```bash
# Terminal 1: FastAPI backend
cd backend && python -m uvicorn app.main:app --port 8001 --reload

# Terminal 2: Static file server  
cd frontend/static && python -m http.server 8090
```

## Production URL Structure

- `/` - Main portfolio page
- `/api/chat` - AI chatbot API
- `/static/` - CSS, JS, images