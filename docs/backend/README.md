# 🔧 Backend Documentation

FastAPI backend for the ATS Resume Checker with AI-powered analysis capabilities.

## 🏗️ Architecture

### Core Services

- **ATS Analyzer**: Comprehensive resume analysis with semantic matching
- **Job Detector**: AI-powered job type detection using sentence transformers
- **Resume Improver**: AI-generated improvement suggestions
- **Project Extractor**: Structured work experience extraction
- **Job Description Generator**: AI-generated job descriptions

### Key Features

- **Centralized AI Configuration**: Unified model management and initialization
- **Error Handling**: Comprehensive error handling with logging and retry logic
- **File Processing**: Support for PDF, DOCX, DOC, and TXT files
- **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Type Safety**: Full Pydantic validation and type hints

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- pip or poetry
- Google Gemini API key (optional)

### Installation

1. **Clone and navigate to backend**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the server**

   ```bash
   python start.py
   ```

6. **Access API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/                    # API endpoints
│   │   └── upload.py          # File upload and analysis endpoints
│   ├── core/                  # Core configuration
│   │   ├── ai_config.py       # Centralized AI configuration
│   │   └── error_handling.py  # Error handling utilities
│   ├── services/              # Business logic services
│   │   ├── ats_analyzer.py    # ATS analysis engine
│   │   ├── job_detector.py    # Job type detection
│   │   ├── resume_improver.py # Resume improvement suggestions
│   │   ├── project_extractor.py # Work experience extraction
│   │   └── job_description_generator.py # Job description generation
│   ├── types/                 # Type definitions
│   ├── utils/                 # Utility functions
│   └── main.py               # FastAPI application
├── tests/                     # Test files
├── requirements.txt          # Python dependencies
└── start.py                  # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description                           | Required | Default |
| ---------------- | ------------------------------------- | -------- | ------- |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | No       | None    |
| `PORT`           | Server port                           | No       | 8000    |
| `HOST`           | Server host                           | No       | 0.0.0.0 |
| `LOG_LEVEL`      | Logging level                         | No       | INFO    |

### AI Configuration

The backend uses centralized AI configuration (`app/core/ai_config.py`) for:

- Google Gemini model initialization
- Sentence transformers model loading
- Error handling and fallback mechanisms
- Model availability checking

## 📡 API Endpoints

### File Upload & Analysis

#### `POST /api/upload/parse`

Upload and parse a resume file.

**Request:**

- `file`: Resume file (PDF, DOCX, DOC, TXT)
- `job_description`: Optional job description for targeted analysis

**Response:**

```json
{
  "success": true,
  "data": {
    "ats_score": 85,
    "job_category": "Software Engineer",
    "strengths": [...],
    "weaknesses": [...],
    "recommendations": [...],
    "extracted_data": {...}
  }
}
```

#### `POST /api/upload/analyze`

Analyze resume with ATS scoring.

**Request:**

- `resume_text`: Extracted resume text
- `job_description`: Job description for analysis

**Response:**

```json
{
  "success": true,
  "data": {
    "ats_score": 85,
    "analysis": {...},
    "improvements": [...]
  }
}
```

### Health Check

#### `GET /health`

Check API health status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:30:00Z",
  "version": "1.0.0"
}
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app

# Run specific test file
python -m pytest tests/test_ats_analyzer.py
```

### Test Structure

- `tests/unit/` - Unit tests for individual components
- `tests/integration/` - Integration tests for API endpoints
- `tests/mocks/` - Mock data and fixtures

## 🚀 Deployment

### Railway Deployment

1. **Connect repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push to main branch**

### Manual Deployment

1. **Build the application**

   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server**

   ```bash
   python start.py
   ```

3. **Configure reverse proxy** (if needed)

## 🔍 Monitoring & Logging

### Logging

- Structured logging with timestamps
- Different log levels (DEBUG, INFO, WARNING, ERROR)
- Request/response logging
- Error tracking and reporting

### Health Monitoring

- Health check endpoint for monitoring
- Model initialization status
- API response time tracking

## 🛠️ Development

### Code Quality

- **Type Hints**: Full type annotation with mypy
- **Linting**: Ruff for code formatting and linting
- **Testing**: Comprehensive test coverage
- **Documentation**: Auto-generated API docs

### Adding New Features

1. **Create service in `app/services/`**
2. **Add API endpoint in `app/api/`**
3. **Update types in `app/types/`**
4. **Add tests in `tests/`**
5. **Update documentation**

### Common Patterns

#### Service Initialization

```python
from app.core.ai_config import ai_config

class MyService:
    def __init__(self):
        gemini_available, embeddings_available = ai_config.initialize()
        self.model = ai_config.get_gemini_model() if gemini_available else None
```

#### Error Handling

```python
from app.core.error_handling import handle_ai_error, log_service_operation

@log_service_operation("MyService", "process_data")
@handle_ai_error
def process_data(self, data):
    # Service logic here
    pass
```

## 📚 Additional Resources

- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Detailed environment configuration
- [Gemini Setup](./GEMINI_SETUP.md) - Google Gemini AI integration
- [Railway Deployment](./RAILWAY_DEPLOYMENT.md) - Deployment guide
- [Enhanced ATS System](./ENHANCED_ATS_SYSTEM.md) - ATS analysis details

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Check if dependencies are installed
   - Verify API keys are set correctly
   - Check internet connection for model downloads

2. **File Processing Errors**
   - Ensure file format is supported
   - Check file size limits
   - Verify file is not corrupted

3. **API Errors**
   - Check request format and parameters
   - Verify authentication (if required)
   - Check server logs for detailed errors

### Getting Help

- Check the logs for detailed error messages
- Review the API documentation at `/docs`
- Open an issue on GitHub for bugs
- Contact the maintainer for urgent issues

---

**Last Updated**: December 2024  
**Maintainer**: Bhuvesh Singla
