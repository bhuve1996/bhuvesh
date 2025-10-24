# 🚀 Bhuvesh Portfolio - ATS Resume Checker

A modern, full-stack portfolio website featuring an advanced ATS (Applicant Tracking System) resume checker powered by AI and semantic matching.

<!-- Updated: Testing pre-commit hook with build check -->
<!-- Added npm run build to pre-commit hooks -->

## ✨ Features

### 🎯 Portfolio Website

- **Modern Design**: Clean, responsive UI with dark theme
- **Interactive Sections**: Hero, About, Projects, Contact
- **Smooth Animations**: Framer Motion powered transitions
- **SEO Optimized**: Next.js 15 with App Router

### 📄 ATS Resume Checker

- **AI-Powered Analysis**: Google Gemini integration for job detection
- **Semantic Matching**: Sentence transformers for concept matching
- **Comprehensive Scoring**: Multi-dimensional ATS compatibility analysis
- **Real-time Feedback**: Toast notifications and progress indicators
- **File Support**: PDF, DOCX, DOC, and TXT files

## 🏗️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Build Tool**: Turbopack

### Backend

- **Framework**: FastAPI (Python)
- **AI/ML**: Google Gemini, Sentence Transformers
- **File Processing**: PyMuPDF, python-docx
- **NLP**: scikit-learn, keybert
- **Validation**: Pydantic

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Google Gemini API key (optional)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start development server
python -m uvicorn app.main:app --reload --port 8000
```

### Environment Variables

Create `.env` files in both root and backend directories:

**Frontend (.env.local)**:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend (.env)**:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📁 Project Structure

```
├── src/                    # Frontend source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   └── sections/     # Page sections
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript definitions
├── backend/               # Backend source code
│   ├── app/              # FastAPI application
│   │   ├── api/          # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── docs/             # Backend documentation
├── docs/                  # Project documentation
│   ├── frontend/         # Frontend docs
│   ├── backend/          # Backend docs
│   └── architecture/     # System architecture
└── public/               # Static assets
```

## 🎨 Key Components

### ATS Checker Features

- **File Upload**: Drag & drop with validation
- **Job Detection**: AI-powered role identification
- **Semantic Analysis**: Concept matching beyond keywords
- **Format Analysis**: ATS compatibility checking
- **Improvement Suggestions**: Actionable recommendations
- **Progress Tracking**: Real-time analysis status

### UI Components

- **Toast Notifications**: Success/error feedback
- **Progress Indicators**: Loading states
- **File Upload**: Drag & drop interface
- **Results Display**: Comprehensive analysis results
- **Responsive Design**: Mobile-first approach

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking

# Backend
make dev-setup       # Complete development setup
make format          # Format code with Black/isort
make lint            # Run Ruff linter
make type-check      # Run MyPy type checker
make test            # Run tests
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting with Next.js config
- **Prettier**: Code formatting
- **Black/isort**: Python code formatting
- **Ruff**: Fast Python linting
- **MyPy**: Python type checking

## 📚 Documentation

- [Frontend Documentation](docs/frontend/)
- [Backend Documentation](docs/backend/)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Development Setup](docs/DEVELOPMENT_SETUP.md)
- [API Documentation](docs/backend/README.md)

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Deploy to Vercel
vercel --prod
```

### Backend (Railway)

```bash
# Deploy to Railway
railway login
railway link
railway up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Bhuvesh Singla**

- Portfolio: [bhuvesh.com](https://bhuvesh.com)
- LinkedIn: [linkedin.com/in/bhuvesh-singla](https://linkedin.com/in/bhuvesh-singla)
- GitHub: [github.com/bhuvesh-singla](https://github.com/bhuvesh-singla)

---

Built with ❤️ using Next.js, FastAPI, and modern web technologies.

# Test commit
