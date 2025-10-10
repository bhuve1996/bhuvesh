# 🚀 Enhanced ATS Resume Checker - Production Grade

## ✨ What's New

This is a **production-grade ATS (Applicant Tracking System) checker** with advanced NLP capabilities, semantic matching, and comprehensive formatting analysis.

### 🎯 Key Features

1. **🔍 Semantic Matching** - Uses sentence-transformers for concept matching, not just keywords
2. **📄 Better PDF Parsing** - PyMuPDF (fitz) for accurate text extraction
3. **🎨 Formatting Analysis** - Detects images, tables, unusual fonts that cause ATS issues
4. **📊 Comprehensive Scoring** - Multi-dimensional scoring algorithm
5. **💡 Actionable Feedback** - Specific suggestions for improvement

---

## 🏗️ Architecture

### Tech Stack

**Backend:**

- **FastAPI** - Modern, fast web framework
- **PyMuPDF (fitz)** - Superior PDF text extraction
- **sentence-transformers** - Semantic similarity matching
- **scikit-learn** - TF-IDF and text processing
- **python-docx** - DOCX file processing

**AI/NLP:**

- Sentence-BERT embeddings for semantic matching
- Keyword extraction with TF-IDF
- Custom scoring algorithms

---

## 📡 API Endpoints

### 1. Health Check

```bash
GET /health
```

### 2. Get Supported Formats

```bash
GET /api/upload/supported-formats
```

### 3. Parse Resume (Basic)

```bash
POST /api/upload/parse
Content-Type: multipart/form-data

file: <resume.pdf/docx/txt>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "filename": "resume.pdf",
    "text": "...",
    "word_count": 450,
    "formatting_analysis": {
      "ats_friendly": true,
      "images_count": 0,
      "tables_detected": false,
      "formatting_issues": []
    }
  }
}
```

### 4. Full ATS Analysis (NEW! 🎉)

```bash
POST /api/upload/analyze
Content-Type: multipart/form-data

file: <resume.pdf/docx/txt>
job_description: <job description text>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "ats_score": 78,
    "match_category": "Good Match",
    "semantic_similarity": 0.745,
    "keyword_matches": ["javascript", "python", "react", "aws"],
    "missing_keywords": ["kubernetes", "graphql"],
    "suggestions": [
      "Add these keywords from the job description: kubernetes, graphql",
      "Add more quantifiable achievements and metrics"
    ],
    "strengths": [
      "Strong keyword match (75%)",
      "Good conceptual alignment with role requirements"
    ],
    "weaknesses": ["Lacks measurable accomplishments"],
    "detailed_scores": {
      "keyword_score": 75.0,
      "semantic_score": 74.5,
      "format_score": 85.0,
      "content_score": 65.0,
      "ats_score": 90.0
    },
    "formatting_issues": [],
    "ats_friendly": true
  }
}
```

---

## 🧠 How It Works

### 1. **File Parsing (PyMuPDF)**

- Extracts text with high accuracy
- Detects images, tables, fonts
- Analyzes document structure

### 2. **Keyword Extraction**

- Extracts important keywords from job description
- Uses TF-IDF for relevance scoring
- Identifies technical terms and skills

### 3. **Semantic Matching** (🌟 NEW!)

- Uses Sentence-BERT embeddings
- Matches concepts, not just exact words
- Understands context and meaning
- Example: "developed applications" matches "built software"

### 4. **Scoring Algorithm**

Five dimensions with weighted scoring:

| Component         | Weight | What It Measures                    |
| ----------------- | ------ | ----------------------------------- |
| Keyword Matching  | 35%    | Exact keyword matches from JD       |
| Semantic Matching | 15%    | Conceptual alignment with JD        |
| Format Compliance | 20%    | Resume structure and sections       |
| Content Quality   | 20%    | Achievements, metrics, action verbs |
| ATS Compatibility | 10%    | Formatting issues (images, fonts)   |

**Total Score:** Weighted average → 0-100 scale

### 5. **Recommendations Engine**

- Identifies missing keywords
- Suggests improvements
- Highlights strengths and weaknesses
- Provides actionable feedback

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note:** First installation will download the sentence-transformer model (~80MB). This only happens once.

### 2. Start the Server

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or with the virtual environment:

```bash
source venv/bin/activate  # macOS/Linux
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test the API

```bash
python test_enhanced_ats.py
```

---

## 📝 Example Usage

### Using cURL

```bash
# Full ATS Analysis
curl -X POST "http://localhost:8000/api/upload/analyze" \
  -F "file=@resume.pdf" \
  -F "job_description=Software Engineer with 3+ years experience in Python, JavaScript, React..."
```

### Using Python

```python
import requests

# Prepare files
files = {'file': open('resume.pdf', 'rb')}
data = {'job_description': 'Your job description here...'}

# Send request
response = requests.post(
    'http://localhost:8000/api/upload/analyze',
    files=files,
    data=data
)

# Get results
result = response.json()
print(f"ATS Score: {result['data']['ats_score']}/100")
```

### Using JavaScript (Next.js Frontend)

```javascript
const formData = new FormData();
formData.append('file', resumeFile);
formData.append('job_description', jobDescription);

const response = await fetch('http://localhost:8000/api/upload/analyze', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log('ATS Score:', result.data.ats_score);
```

---

## 🎯 Scoring System

### Score Interpretation

| Score Range | Category          | Meaning                        |
| ----------- | ----------------- | ------------------------------ |
| 80-100      | Excellent Match   | Highly optimized for ATS       |
| 70-79       | Good Match        | Well-aligned with requirements |
| 60-69       | Fair Match        | Some improvements needed       |
| 50-59       | Needs Improvement | Significant gaps               |
| 0-49        | Poor Match        | Major revisions required       |

---

## 🔧 Configuration

### Adjust Scoring Weights

Edit `backend/app/services/ats_analyzer.py`:

```python
self.weights = {
    'keyword_matching': 35,      # Adjust as needed
    'semantic_matching': 15,
    'format_compliance': 20,
    'content_quality': 20,
    'ats_compatibility': 10
}
```

### Use Different Embedding Model

```python
# In ATSAnalyzer.__init__()
self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast, lightweight

# Or for better accuracy (slower, larger):
self.model = SentenceTransformer('all-mpnet-base-v2')
```

---

## 🐛 Troubleshooting

### Issue: "sentence-transformers not available"

**Solution:** Install dependencies:

```bash
pip install sentence-transformers torch
```

### Issue: "Error parsing PDF"

**Solution:** Ensure PyMuPDF is installed:

```bash
pip install PyMuPDF
```

### Issue: Model download fails

**Solution:** Download manually:

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
```

---

## 📊 Performance

- **Parsing Speed:** ~0.5-1s per document
- **Analysis Time:** ~1-2s with embeddings
- **Model Size:** ~80MB (all-MiniLM-L6-v2)
- **Memory Usage:** ~200-300MB

---

## 🌍 Multi-language Support (Coming Soon)

```python
# Support for multiple languages
SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'zh']

# Use multilingual model
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
```

---

## 📚 References

- [PyMuPDF Documentation](https://pymupdf.readthedocs.io/)
- [Sentence-Transformers](https://www.sbert.net/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 🎉 What Makes This Production-Grade?

✅ **Semantic Understanding** - Not just keyword matching
✅ **Comprehensive Analysis** - 5 scoring dimensions
✅ **Formatting Detection** - Identifies ATS-breaking elements
✅ **Actionable Feedback** - Specific improvement suggestions
✅ **Error Handling** - Graceful fallbacks
✅ **API Documentation** - Auto-generated with FastAPI
✅ **Testing Suite** - Comprehensive test script
✅ **Scalable Architecture** - Modular, maintainable code

---

**Status:** 🚀 Production Ready
**Version:** 2.0.0
**Last Updated:** October 2025
