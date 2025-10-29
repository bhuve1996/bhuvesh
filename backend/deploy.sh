#!/bin/bash
# Deployment script for Railway with graceful dependency handling

set -e

echo "🚀 Starting deployment process..."

# Check Python version
python_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "🐍 Python version: $python_version"

# Install dependencies with fallback
echo "📦 Installing dependencies..."

# Try full requirements first
if pip install -r requirements.txt; then
    echo "✅ Full requirements installed successfully"
else
    echo "⚠️  Full requirements failed, trying minimal requirements..."
    if pip install -r requirements-minimal.txt; then
        echo "✅ Minimal requirements installed successfully"
    else
        echo "❌ Failed to install even minimal requirements"
        exit 1
    fi
fi

# Check for sentence-transformers
if python3 -c "import sentence_transformers" 2>/dev/null; then
    echo "✅ sentence-transformers available"
else
    echo "⚠️  sentence-transformers not available - using keyword-only mode"
fi

# Check for Google Gemini
if python3 -c "import google.generativeai" 2>/dev/null; then
    echo "✅ Google Gemini available"
else
    echo "❌ Google Gemini not available - install with: pip install google-generativeai"
fi

echo "🎉 Deployment preparation complete!"