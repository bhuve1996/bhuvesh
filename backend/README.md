# 🚀 ATS Resume Checker Backend

FastAPI backend for advanced ATS (Applicant Tracking System) resume analysis with AI-powered job detection and semantic matching.

## ✨ Features

- **AI-Powered Analysis**: Google Gemini integration for intelligent job detection
- **Semantic Matching**: Sentence transformers for concept-based matching
- **Multi-format Support**: PDF, DOCX, DOC, and TXT file processing
- **Comprehensive Scoring**: 5-dimensional ATS compatibility analysis
- **Real-time Processing**: Fast file parsing and analysis
- **RESTful API**: Clean, documented endpoints

## 🏗️ Architecture

### Core Services

- **ATS Analyzer**: Main analysis engine with scoring algorithms
- **Job Detector**: AI-powered job type identification
- **Project Extractor**: Structured experience extraction
- **Resume Improver**: AI-generated improvement suggestions
- **File Parser**: Multi-format file processing

### AI/ML Stack

- **Google Gemini**: Job detection and content generation
- **Sentence Transformers**: Semantic similarity matching
- **scikit-learn**: TF-IDF and text processing
- **KeyBERT**: Keyword extraction

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Google Gemini API key (optional but recommended)

### Installation

```bash
# Clone and navigate to backend
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

Create `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📡 API Endpoints

### Health Check

```http
GET /health
```

### File Upload & Analysis

```http
POST /api/upload/analyze
Content-Type: multipart/form-data

file: <resume_file>
job_description: <job_description_text>
```

### Quick Analysis (AI-generated JD)

```http
POST /api/upload/quick-analyze
Content-Type: multipart/form-data

file: <resume_file>
```

### Supported Formats

```http
GET /api/upload/supported-formats
```

## 📊 Analysis Features

### 5-Dimensional Scoring

1. **Keyword Matching** (35%) - Exact keyword matches
2. **Semantic Matching** (15%) - Conceptual alignment
3. **Format Compliance** (20%) - Structure and sections
4. **Content Quality** (20%) - Achievements and metrics
5. **ATS Compatibility** (10%) - Formatting issues

### AI Capabilities

- **Job Detection**: Identifies role from resume content
- **JD Generation**: Creates specific job descriptions
- **Semantic Analysis**: Understands meaning beyond keywords
- **Improvement Suggestions**: AI-generated recommendations

## 🔧 Development

### Available Commands

```bash
# Development setup
make dev-setup

# Code formatting
make format

# Linting
make lint
make lint-fix

# Type checking
make type-check

# Testing
make test
make test-verbose

# Run server
make run
```

### Code Quality Tools

- **Black**: Code formatting
- **isort**: Import sorting
- **Ruff**: Fast linting
- **MyPy**: Type checking
- **Pre-commit**: Git hooks

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   └── upload.py     # File upload and analysis
│   ├── services/         # Business logic
│   │   ├── ats_analyzer.py      # Main analysis engine
│   │   ├── job_detector.py      # AI job detection
│   │   ├── project_extractor.py # Experience extraction
│   │   ├── resume_improver.py   # Improvement suggestions
│   │   └── job_description_generator.py # JD generation
│   ├── utils/            # Utility functions
│   │   └── file_parser.py # File processing
│   ├── helpers/          # Helper functions
│   │   └── validation.py # Data validation
│   ├── types/            # Type definitions
│   │   └── ats.py        # ATS-specific types
│   └── main.py           # FastAPI application
├── tests/                # Test files
├── docs/                 # Documentation
├── requirements.txt      # Dependencies
├── pyproject.toml        # Project configuration
└── Makefile             # Development commands
```

## 🧪 Testing

```bash
# Run all tests
make test

# Run with verbose output
make test-verbose

# Run specific test file
pytest tests/test_ats_analyzer.py -v
```

## 📚 Documentation

- [API Documentation](docs/README.md)
- [Gemini Setup](docs/GEMINI_SETUP.md)
- [Frontend Integration](docs/FRONTEND_INTEGRATION.md)
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)

## 🚀 Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Docker

```bash
# Build image
docker build -t ats-backend .

# Run container
docker run -p 8000:8000 ats-backend
```

## 🔧 Configuration

### Performance Tuning

- **Model Loading**: Lazy loading of AI models
- **Caching**: Response caching for repeated requests
- **Memory Management**: Efficient memory usage
- **Concurrent Processing**: Async request handling

### Security

- **File Validation**: Strict file type checking
- **Size Limits**: File size restrictions
- **Input Sanitization**: Data validation and cleaning
- **CORS Configuration**: Cross-origin request handling

## 📈 Monitoring

### Health Checks

- **API Health**: `/health` endpoint
- **Model Status**: AI model availability
- **Memory Usage**: Resource monitoring
- **Response Times**: Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using FastAPI, Python, and modern AI technologies.
