#!/bin/bash

echo "🎯 Nir's Portfolio with AI Chatbot"
echo "=================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
echo "📦 Checking dependencies..."
if ! python -c "import fastapi, uvicorn, openai" 2>/dev/null; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    pip install -r backend/requirements.txt
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: .env file not found in backend directory"
    echo "Creating example .env file..."
    
    cat > backend/.env << EOF
# OpenAI API Key - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# Admin Token (will be auto-generated if not provided)
ADMIN_TOKEN=your-admin-token-here

# Port (optional, defaults to 5000)
PORT=5000
EOF
    
    echo "✅ Created backend/.env file"
    echo "⚠️  Please edit backend/.env and add your OpenAI API key"
fi

# Start the server
echo "🚀 Starting server..."
echo "📍 Server will be available at: http://localhost:5000"
echo "📚 API Documentation: http://localhost:5000/docs"
echo "🔄 Press Ctrl+C to stop the server"
echo "----------------------------------------"

cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload 