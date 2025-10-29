# 🚀 Development Setup Guide

Complete guide for setting up the Bhuvesh Portfolio project for local development.

## 📋 Prerequisites

### Required Software

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Python**: Version 3.9 or higher
- **Git**: For version control

### Optional Software

- **Google Gemini API Key**: For enhanced AI features
- **VS Code**: Recommended IDE with extensions
- **Docker**: For containerized development (optional)

## 🏗️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bhuvesh-portfolio.git
cd bhuvesh-portfolio
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit environment variables
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit environment variables
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Environment Configuration

#### Frontend (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

#### Backend (.env)

```bash
# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=INFO

# Optional: Database (if using)
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
```

## 🚀 Running the Application

### Development Mode

#### Terminal 1 - Frontend

```bash
npm run dev
```

- Frontend will be available at http://localhost:3000
- Hot reload enabled for development

#### Terminal 2 - Backend

```bash
cd backend
python start.py
```

- Backend will be available at http://localhost:8000
- API documentation at http://localhost:8000/docs

### Production Mode

#### Frontend

```bash
npm run build
npm run start
```

#### Backend

```bash
cd backend
python start.py
```

## 🧪 Testing

### Frontend Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Backend Testing

```bash
cd backend

# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app

# Run specific test file
python -m pytest tests/test_ats_analyzer.py
```

## 🔧 Development Tools

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.pylint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Code Quality Tools

#### Frontend

- **ESLint**: Code linting and style checking
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Husky**: Git hooks for pre-commit checks

#### Backend

- **Ruff**: Python linting and formatting
- **MyPy**: Type checking
- **Pytest**: Testing framework
- **Black**: Code formatting

### Pre-commit Hooks

The project includes pre-commit hooks for code quality:

```bash
# Install pre-commit hooks
npm run prepare

# Run pre-commit checks manually
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
bhuvesh-portfolio/
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/               # Utilities and business logic
│   ├── hooks/             # Custom React hooks
│   ├── store/             # State management
│   └── types/             # TypeScript definitions
├── backend/               # Python FastAPI backend
│   ├── app/               # FastAPI application
│   ├── tests/             # Backend tests
│   └── requirements.txt   # Python dependencies
├── docs/                  # Documentation
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🔍 Debugging

### Frontend Debugging

- Use React Developer Tools browser extension
- Check browser console for errors
- Use VS Code debugger for breakpoints
- Check Network tab for API calls

### Backend Debugging

- Check server logs in terminal
- Use Python debugger (pdb)
- Check API documentation at /docs
- Use logging statements for debugging

### Common Issues

#### Frontend Issues

1. **Build Errors**: Check TypeScript errors and fix type issues
2. **API Connection**: Verify NEXT_PUBLIC_API_URL is correct
3. **Styling Issues**: Check Tailwind CSS classes and imports

#### Backend Issues

1. **Import Errors**: Ensure virtual environment is activated
2. **Model Loading**: Check if AI dependencies are installed
3. **API Errors**: Check request format and server logs

## 🚀 Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway)

1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

## 📚 Additional Resources

- [Architecture Guide](./ARCHITECTURE.md) - System architecture overview
- [Testing Guide](./TESTING_GUIDE.md) - Testing strategies and examples
- [Backend Documentation](./backend/README.md) - Backend API and services
- [Accessibility Guide](./ACCESSIBILITY_GUIDE.md) - Accessibility features

## 🆘 Getting Help

### Common Solutions

1. **Clear node_modules**: `rm -rf node_modules && npm install`
2. **Clear Python cache**: `find . -type d -name __pycache__ -delete`
3. **Restart servers**: Stop and restart both frontend and backend
4. **Check logs**: Review terminal output for error messages

### Support Channels

- GitHub Issues: For bug reports and feature requests
- Documentation: Check relevant guides first
- Code Review: Submit pull requests for improvements

---

**Last Updated**: December 2024  
**Maintainer**: Bhuvesh Singla
