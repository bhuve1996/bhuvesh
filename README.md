# 🚀 Bhuvesh Portfolio - AI-Powered ATS Resume Checker

A modern, full-stack portfolio website featuring an advanced ATS (Applicant Tracking System) resume checker powered by AI and semantic matching.

## ✨ Features

### 🎯 Portfolio Website

- **Modern Design**: Clean, responsive UI with dark theme support
- **Interactive Sections**: Hero, About, Projects, Contact, Blog
- **Smooth Animations**: Framer Motion powered transitions
- **SEO Optimized**: Next.js 15 with App Router and metadata
- **Performance**: Optimized with Turbopack and code splitting

### 📄 AI-Powered ATS Resume Checker

- **Intelligent Analysis**: Google Gemini AI for job detection and content analysis
- **Semantic Matching**: Sentence transformers for concept matching beyond keywords
- **Comprehensive Scoring**: Multi-dimensional ATS compatibility analysis
- **Real-time Feedback**: Interactive UI with progress indicators and toast notifications
- **Multi-format Support**: PDF, DOCX, DOC, and TXT files
- **Resume Management**: Save, organize, and compare multiple resume versions
- **Job-Specific Analysis**: Tailored recommendations for different job categories

## 🏗️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom theme system
- **Animations**: Framer Motion
- **State Management**: Zustand with TypeScript
- **Notifications**: React Hot Toast
- **Build Tool**: Turbopack
- **Testing**: Jest, Cypress, React Testing Library

### Backend

- **Framework**: FastAPI (Python 3.9+)
- **AI/ML**: Google Gemini, Sentence Transformers
- **File Processing**: PyMuPDF, python-docx
- **NLP**: scikit-learn, keybert
- **Validation**: Pydantic
- **Deployment**: Railway

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Google Gemini API key (optional, for enhanced AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bhuvesh-portfolio.git
   cd bhuvesh-portfolio
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_API_URL=http://localhost:8000

   # Backend (.env)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Start the development servers**

   ```bash
   # Terminal 1 - Frontend
   npm run dev

   # Terminal 2 - Backend
   cd backend
   python start.py
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
├── src/                          # Frontend source code
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # Reusable React components
│   │   ├── atoms/              # Basic UI elements
│   │   ├── molecules/           # Composite components
│   │   ├── organisms/           # Complex components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utilities and business logic
│   │   ├── api/                # API client and endpoints
│   │   ├── resume/             # Resume-specific logic
│   │   └── utils/              # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # State management (Zustand)
│   └── types/                  # TypeScript definitions
├── backend/                     # Python FastAPI backend
│   ├── app/                    # FastAPI application
│   │   ├── api/                # API endpoints
│   │   ├── core/               # Core configuration
│   │   ├── services/           # Business logic services
│   │   └── utils/              # Utility functions
│   └── tests/                  # Backend tests
├── docs/                       # Documentation
└── public/                     # Static assets
```

## 🔧 Development

### Available Scripts

#### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
```

#### Backend

```bash
cd backend
python start.py      # Start development server
python -m pytest    # Run tests
make test           # Run all tests with coverage
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **Pre-commit hooks**: Automated linting and testing
- **Testing**: Unit, integration, and E2E tests

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - System architecture and design decisions
- [Development Setup](docs/DEVELOPMENT_SETUP.md) - Detailed setup instructions
- [Testing Guide](docs/TESTING_GUIDE.md) - Testing strategies and examples
- [Accessibility Guide](docs/ACCESSIBILITY_GUIDE.md) - Accessibility features and testing
- [Backend Documentation](docs/backend/README.md) - Backend API and services
- [Duplication Cleanup Guide](DUPLICATION_CLEANUP_GUIDE.md) - Code optimization and DRY principles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python web framework
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Contact

- **Portfolio**: [bhuvesh.com](https://bhuvesh.com)
- **Email**: contact@bhuvesh.com
- **LinkedIn**: [linkedin.com/in/bhuvesh-singla](https://linkedin.com/in/bhuvesh-singla)
- **GitHub**: [github.com/bhuvesh-singla](https://github.com/bhuvesh-singla)

---

**Built with ❤️ by Bhuvesh Singla**
