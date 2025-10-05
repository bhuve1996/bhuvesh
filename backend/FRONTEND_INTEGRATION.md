# 🔗 Frontend Integration Guide

## Quick Start - Connecting Next.js to Enhanced ATS Backend

### 1. Update Your Next.js API Calls

The main endpoint you'll use is:

```
POST http://localhost:8000/api/upload/analyze
```

### 2. Frontend Implementation (TypeScript)

#### Create API Service (`src/lib/ats/api.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ATSAnalysisResult {
  ats_score: number;
  match_category: string;
  keyword_matches: string[];
  missing_keywords: string[];
  semantic_similarity: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  formatting_issues: string[];
  ats_friendly: boolean;
  word_count: number;
  detailed_scores: {
    keyword_score: number;
    semantic_score: number;
    format_score: number;
    content_score: number;
    ats_score: number;
  };
}

export interface ATSAnalysisResponse {
  success: boolean;
  data: ATSAnalysisResult;
  message: string;
}

export async function analyzeResume(
  file: File,
  jobDescription: string
): Promise<ATSAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  const response = await fetch(`${API_BASE_URL}/api/upload/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Analysis failed');
  }

  return response.json();
}
```

#### Update Your Component

```typescript
'use client';

import { useState } from 'react';
import { analyzeResume, ATSAnalysisResult } from '@/lib/ats/api';

export function ATSChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeResume(file, jobDescription);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block mb-2">Upload Resume</label>
        <input
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="block mb-2">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
          placeholder="Paste the job description here..."
          className="w-full p-4 border rounded"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !file || !jobDescription}
        className="px-6 py-3 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg">
            <h2 className="text-3xl font-bold">
              ATS Score: {result.ats_score}/100
            </h2>
            <p className="text-xl mt-2">{result.match_category}</p>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(result.detailed_scores).map(([key, value]) => (
              <div key={key} className="p-4 bg-gray-100 rounded">
                <div className="text-2xl font-bold">{value.toFixed(0)}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                ✅ Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {result.weaknesses.length > 0 && (
            <div className="p-6 bg-red-50 rounded-lg">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                ❌ Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {result.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                💡 Suggestions
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-3">
                🔑 Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.keyword_matches.slice(0, 15).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-3">
                ⚠️ Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.slice(0, 10).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formatting Issues */}
          {!result.ats_friendly && result.formatting_issues.length > 0 && (
            <div className="p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">
                🚨 Formatting Issues
              </h3>
              <ul className="space-y-2">
                {result.formatting_issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 3. Environment Variables

Create `.env.local` in your Next.js root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### 4. CORS Configuration

The backend is already configured to accept requests from `http://localhost:3000`.

If you need to add more origins, edit `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Error Handling

```typescript
try {
  const response = await analyzeResume(file, jobDescription);
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    // Handle specific errors
    if (error.message.includes('too short')) {
      setError('Job description must be at least 50 characters');
    } else if (error.message.includes('Unsupported')) {
      setError('Please upload PDF, DOCX, or TXT files only');
    } else {
      setError(error.message);
    }
  }
}
```

### 6. Loading States

```typescript
// Show loading indicator
{loading && (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    <p className="ml-4">Analyzing your resume with AI...</p>
  </div>
)}
```

### 7. File Size Validation

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];

  if (selectedFile) {
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload PDF, DOCX, or TXT files only');
      return;
    }

    setFile(selectedFile);
    setError(null);
  }
};
```

### 8. TypeScript Types

Add to `src/types/index.ts`:

```typescript
export interface ATSScore {
  keyword_score: number;
  semantic_score: number;
  format_score: number;
  content_score: number;
  ats_score: number;
}

export interface ATSAnalysisResult {
  ats_score: number;
  match_category:
    | 'Excellent Match'
    | 'Good Match'
    | 'Fair Match'
    | 'Needs Improvement'
    | 'Poor Match';
  keyword_matches: string[];
  missing_keywords: string[];
  semantic_similarity: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  formatting_issues: string[];
  ats_friendly: boolean;
  word_count: number;
  detailed_scores: ATSScore;
}
```

### 9. Testing

```typescript
// Test with sample data
const testAnalysis = async () => {
  const testFile = new File(['test resume content'], 'test.txt', {
    type: 'text/plain',
  });

  const testJD = 'Software Engineer with 3+ years experience in Python...';

  const result = await analyzeResume(testFile, testJD);
  console.log('Test result:', result);
};
```

### 10. Production Deployment

**Backend:**

- Deploy FastAPI to services like Render, Railway, or AWS
- Update CORS origins
- Set up environment variables

**Frontend:**

- Update `NEXT_PUBLIC_API_URL` to production backend URL
- Deploy Next.js to Vercel/Netlify

---

## 🎯 Quick Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] CORS configured correctly
- [ ] File upload working
- [ ] Job description input working
- [ ] Results displaying correctly
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] File validation working
- [ ] Environment variables set

---

## 📚 API Response Example

```json
{
  "success": true,
  "data": {
    "ats_score": 78,
    "match_category": "Good Match",
    "semantic_similarity": 0.745,
    "keyword_matches": ["javascript", "python", "react"],
    "missing_keywords": ["kubernetes", "graphql"],
    "suggestions": ["Add more keywords..."],
    "strengths": ["Strong keyword match"],
    "weaknesses": ["Low semantic similarity"],
    "detailed_scores": {
      "keyword_score": 80.0,
      "semantic_score": 74.5,
      "format_score": 85.0,
      "content_score": 65.0,
      "ats_score": 90.0
    },
    "formatting_issues": [],
    "ats_friendly": true,
    "word_count": 450
  },
  "message": "ATS analysis completed successfully"
}
```

---

**Happy Coding! 🚀**
