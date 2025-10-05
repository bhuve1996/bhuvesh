#!/bin/bash

# Backend validation script for Husky pre-push hook
# This checks if the backend will build successfully on Railway

set -e

echo "🐍 Checking Python backend..."

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "⚠️  Backend directory not found. Skipping backend checks."
    exit 0
fi

# Check if requirements.txt exists
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ backend/requirements.txt not found!"
    exit 1
fi

# Check if main.py exists
if [ ! -f "backend/app/main.py" ]; then
    echo "❌ backend/app/main.py not found!"
    exit 1
fi

# Check if nixpacks.toml is valid
if [ -f "backend/nixpacks.toml" ]; then
    echo "✅ nixpacks.toml found"
    
    # Check for common errors in nixpacks.toml
    if grep -q "pip" backend/nixpacks.toml && grep -q "nixPkgs" backend/nixpacks.toml; then
        if grep -A 1 "nixPkgs" backend/nixpacks.toml | grep -q "'pip'"; then
            echo "❌ Error: 'pip' should not be in nixPkgs (it comes with Python)"
            echo "   Fix: Remove 'pip' from nixPkgs in backend/nixpacks.toml"
            exit 1
        fi
    fi
else
    echo "⚠️  nixpacks.toml not found (Railway will auto-detect)"
fi

# Validate Python syntax of main files
echo "🔍 Checking Python syntax..."

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python3 not found. Skipping syntax check."
    echo "   (Railway will still validate during deployment)"
    exit 0
fi

# Check Python syntax for main.py
python3 -m py_compile backend/app/main.py 2>&1 || {
    echo "❌ Syntax error in backend/app/main.py"
    exit 1
}

# Check other Python files in app directory
for file in backend/app/**/*.py; do
    if [ -f "$file" ]; then
        python3 -m py_compile "$file" 2>&1 || {
            echo "❌ Syntax error in $file"
            exit 1
        }
    fi
done

# Check if critical dependencies are in requirements.txt
echo "📦 Checking requirements.txt..."

required_deps=("fastapi" "uvicorn" "python-multipart" "PyMuPDF" "python-docx")
missing_deps=()

for dep in "${required_deps[@]}"; do
    if ! grep -qi "^$dep" backend/requirements.txt; then
        missing_deps+=("$dep")
    fi
done

if [ ${#missing_deps[@]} -gt 0 ]; then
    echo "⚠️  Warning: The following critical dependencies might be missing:"
    printf '   - %s\n' "${missing_deps[@]}"
    echo "   Make sure they're included in requirements.txt"
fi

# Check for environment variable documentation
if [ -f "backend/.env.example" ]; then
    echo "✅ .env.example found"
else
    echo "⚠️  backend/.env.example not found (consider adding one)"
fi

echo "✅ Backend validation passed!"
echo ""

