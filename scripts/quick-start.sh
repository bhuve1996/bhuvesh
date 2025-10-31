#!/bin/bash

# Portfolio Project Quick Start Script
# Starts both Frontend and Backend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Portfolio Project - Quick Start${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and Python 3 found${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found, creating from .env.example${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ Created .env.local${NC}"
    else
        echo -e "${RED}❌ .env.example not found${NC}"
        exit 1
    fi
fi

# Ensure NEXT_PUBLIC_API_URL is set
if ! grep -q "NEXT_PUBLIC_API_URL" .env.local; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_API_URL not found in .env.local, adding it${NC}"
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" >> .env.local
    echo -e "${GREEN}✅ Added NEXT_PUBLIC_API_URL${NC}"
fi

echo -e "${BLUE}Starting services...${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
}

trap cleanup EXIT

echo -e "${BLUE}→ Starting Backend on http://localhost:8000${NC}"
npm run dev:backend &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

echo -e "${BLUE}→ Starting Frontend on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ Services Started Successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Frontend:  http://localhost:3000${NC}"
echo -e "${BLUE}Backend:   http://localhost:8000${NC}"
echo -e "${BLUE}API Docs:  http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

wait
