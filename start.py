#!/usr/bin/env python3
"""
Startup script for Render deployment
"""
import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_dir))

# Import and run the FastAPI app
from app.main import app

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment variable (Render provides this)
    port = int(os.environ.get("PORT", 8000))
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        app_dir=str(backend_dir)
    )