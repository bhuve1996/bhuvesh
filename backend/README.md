# ATS Resume Checker - Python Backend

## 🐍 **Python Backend for ATS Resume Analysis**

This is the Python FastAPI backend that powers our ATS resume checker. It handles file parsing, analysis, and provides a REST API for our Next.js frontend.

## 🏗️ **Architecture**

```
backend/
├── app/
│   ├── __init__.py          # Makes app a Python package
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py      # API package
│   │   └── upload.py        # File upload endpoints
│   └── utils/
│       ├── __init__.py      # Utils package
│       └── file_parser.py   # File parsing utilities
├── requirements.txt         # Python dependencies
├── test_api.py             # Simple API testing script
└── README.md               # This file
```

## 🚀 **Getting Started**

### **1. Setup Virtual Environment**

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### **2. Install Dependencies**

```bash
pip install -r requirements.txt
```

### **3. Run the Server**

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **4. Test the API**

```bash
python test_api.py
```

## 📡 **API Endpoints**

### **Health Check**

- **GET** `/` - Root endpoint
- **GET** `/health` - Health check

### **File Upload**

- **POST** `/api/upload/parse` - Parse uploaded resume file
- **GET** `/api/upload/supported-formats` - Get supported file formats

## 🔧 **Supported File Types**

- **PDF** (.pdf) - Using PyPDF2
- **DOCX** (.docx, .doc) - Using python-docx
- **TXT** (.txt) - Plain text files

## 🧠 **Python Concepts Used**

### **1. FastAPI Framework**

- Modern, fast web framework for building APIs
- Automatic API documentation
- Type hints and validation

### **2. File Processing**

- **PyPDF2**: PDF text extraction
- **python-docx**: Word document processing
- **BytesIO**: In-memory file handling

### **3. Error Handling**

- Try/except blocks for robust error handling
- HTTP exceptions for API errors
- Custom error messages

### **4. Type Hints**

- `Dict[str, Any]`: Dictionary with string keys
- `UploadFile`: FastAPI file upload type
- `bytes`: Binary data type

## 🔄 **Integration with Next.js**

The Python backend provides a REST API that our Next.js frontend can call:

```javascript
// Frontend API call
const response = await fetch('http://localhost:8000/api/upload/parse', {
  method: 'POST',
  body: formData,
});
```

## 🎯 **Next Steps**

1. **Add ATS Analysis Engine** - Implement resume scoring
2. **Database Integration** - Add PostgreSQL for data persistence
3. **User Authentication** - Add user accounts and sessions
4. **Advanced Features** - AI-powered suggestions, job matching

## 🧪 **Testing**

Run the test script to verify everything works:

```bash
python test_api.py
```

## 📚 **Learning Resources**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [PyPDF2 Documentation](https://pypdf2.readthedocs.io/)
- [python-docx Documentation](https://python-docx.readthedocs.io/)

---

**Status**: 🚧 In Development  
**Version**: 1.0.0  
**Python Version**: 3.9+
