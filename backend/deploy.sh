#!/bin/bash
# Deployment script for Railway

echo "🚀 Starting Railway deployment..."

# Install minimal requirements first
echo "📦 Installing core dependencies..."
pip install --no-cache-dir -r requirements-minimal.txt

# Install ML dependencies in background (non-blocking)
echo "🤖 Installing ML dependencies..."
pip install --no-cache-dir \
    --extra-index-url https://download.pytorch.org/whl/cpu \
    torch==2.1.1+cpu \
    sentence-transformers==2.2.2 \
    scikit-learn==1.3.2 \
    keybert==0.8.3 \
    transformers==4.35.2 \
    google-generativeai==0.3.2 &

# Start the application
echo "🌐 Starting application..."
python start.py
