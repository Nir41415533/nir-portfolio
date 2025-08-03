#!/usr/bin/env bash
# Build script for Render deployment

echo "Starting build process..."

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy frontend files to backend directory for deployment
echo "Copying frontend files..."
mkdir -p backend/frontend/static
cp -r frontend/static/* backend/frontend/static/

echo "Build completed successfully!"