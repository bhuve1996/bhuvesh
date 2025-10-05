# 🧪 Frontend Testing Guide

## Quick Test: Is Backend Connected?

### **Method 1: Browser Console (30 seconds)**

1. Open your Next.js app: `http://localhost:3000`
2. Press `F12` (or `Cmd+Option+I` on Mac) to open DevTools
3. Go to **Console** tab
4. Paste and run:

```javascript
// Test backend connection
fetch('http://localhost:8000/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend not reachable:', err));
```

**Expected Output:**

```
✅ Backend connected: {status: 'healthy', message: 'API is running successfully', version: '1.0.0'}
```

---

### **Method 2: Test the ATS Checker Page**

1. Go to: `http://localhost:3000/resume/ats-checker`
2. Upload a resume (any PDF, DOCX, or TXT file)
3. Check the box **"Compare with specific job description"**
4. Paste this sample job description:

```
Software Engineer - Full Stack Developer

We are seeking an experienced Full Stack Developer.

Requirements:
- 3+ years of experience in software development
- Strong proficiency in JavaScript, TypeScript, Python
- Experience with React, Node.js, and Express
- Knowledge of SQL databases (PostgreSQL, MySQL)
- Experience with AWS, Docker, and Kubernetes
- Strong problem-solving skills
- Bachelor's degree in Computer Science

Responsibilities:
- Develop and maintain web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Implement automated testing
```

5. Click **"Analyze with Job Description"**
6. Wait for results (should take 1-3 seconds)

---

### **Method 3: Check Network Tab**

1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Upload a resume and click analyze
4. Look for request to `localhost:8000/api/upload/analyze`
5. Check the response:
   - **Status 200** = ✅ Success
   - **Status 404/500** = ❌ Error

---

## 🔍 What to Look For

### **✅ Success Indicators:**

1. **Score Display**: You should see an ATS score (0-100)
2. **Match Category**: "Excellent Match", "Good Match", etc.
3. **Keyword Matches**: List of matched keywords
4. **Suggestions**: Specific improvement suggestions
5. **Strengths/Weaknesses**: Listed clearly

### **❌ Common Issues:**

#### **Issue 1: "Failed to connect to analysis server"**

**Solution:**

```bash
# Check if backend is running
curl http://localhost:8000/health

# If not running, start it:
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### **Issue 2: CORS Error**

**Check browser console for:**

```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS
```

**Solution:** Backend is already configured for CORS. Restart backend server.

#### **Issue 3: "Job description is too short"**

**Solution:** Provide at least 50 characters in the job description field.

---

## 🎯 Test Checklist

- [ ] Backend health check works
- [ ] Can upload resume (PDF/DOCX/TXT)
- [ ] Can analyze without job description (basic parse)
- [ ] Can analyze WITH job description (full analysis)
- [ ] See ATS score displayed
- [ ] See keyword matches
- [ ] See suggestions
- [ ] No CORS errors in console
- [ ] Loading states work
- [ ] Error messages are clear

---

## 📊 Expected Analysis Flow

1. **Upload Resume** → File validated, name displayed
2. **Add Job Description** (optional) → Checkbox enables textarea
3. **Click Analyze** → Button shows "Analyzing with AI..."
4. **Backend Processing** (1-3 seconds):
   - Parse resume with PyMuPDF
   - Extract keywords from JD
   - Calculate semantic similarity
   - Generate scores & recommendations
5. **Display Results** → Show score, keywords, suggestions

---

## 🐛 Debugging Steps

### **1. Check Backend Logs**

Look at the terminal where backend is running:

```
INFO:     127.0.0.1:xxxxx - "POST /api/upload/analyze HTTP/1.1" 200 OK
```

### **2. Check Browser Console**

Look for errors or API responses:

```javascript
console.log('API Response:', result);
```

### **3. Test API Directly**

```bash
# Create test file
echo "John Doe - Software Engineer" > test-resume.txt

# Test API
curl -X POST "http://localhost:8000/api/upload/analyze" \
  -F "file=@test-resume.txt" \
  -F "job_description=Software Engineer with 3+ years experience"
```

---

## 📸 Screenshots of Expected Behavior

### **Before Analysis:**

- File upload area
- Checkbox for job description
- "Start Analysis" button

### **During Analysis:**

- Loading spinner
- Progress message: "🧠 Using semantic AI matching..."
- Animated progress bar

### **After Analysis:**

- Large score display (e.g., "78/100")
- Match category badge
- Keyword chips (green for matched, red for missing)
- Suggestions list
- Strengths/Weaknesses sections

---

## 🚀 Performance Expectations

| Action                      | Expected Time |
| --------------------------- | ------------- |
| File upload                 | < 0.5s        |
| Parse only (no JD)          | ~0.5-1s       |
| Full analysis (with JD)     | ~1-3s         |
| First analysis (model load) | ~3-5s         |
| Subsequent analyses         | ~1-2s         |

---

## ✨ Features to Test

### **1. Basic Parsing**

- [ ] Upload resume without job description
- [ ] Should parse and show word count
- [ ] Should suggest adding job description

### **2. Full Analysis**

- [ ] Upload resume WITH job description
- [ ] Should show detailed scores
- [ ] Should show semantic similarity
- [ ] Should identify missing keywords
- [ ] Should provide specific suggestions

### **3. Error Handling**

- [ ] Try invalid file type → Should show error
- [ ] Try file over 10MB → Should show error
- [ ] Try empty job description → Should warn
- [ ] Disconnect backend → Should show connection error

---

## 🎓 What Makes It "Production-Grade"?

When testing, you should see:

✅ **Semantic Understanding**

- "developed applications" matches "built software"
- Conceptual alignment, not just exact keywords

✅ **Comprehensive Scoring**

- 5 different score dimensions
- Weighted algorithm
- Detailed breakdown

✅ **Actionable Feedback**

- Specific keywords to add
- Content improvements
- Formatting suggestions

✅ **Professional UX**

- Loading states
- Error messages
- Smooth animations
- Clear layout

---

## 📝 Sample Test Cases

### **Test Case 1: Perfect Match**

- Upload well-formatted resume
- Add matching job description
- **Expected**: Score 80-90, "Excellent Match"

### **Test Case 2: Poor Match**

- Upload unrelated resume (e.g., chef resume)
- Add software engineer job description
- **Expected**: Score < 50, "Poor Match", many missing keywords

### **Test Case 3: No Job Description**

- Upload any resume
- Don't check the job description box
- **Expected**: Basic parse, suggestion to add JD

---

## 🔗 Quick Links

- **Frontend**: http://localhost:3000/resume/ats-checker
- **Backend API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

**Happy Testing! 🎉**

If everything works, you now have a production-grade ATS checker with AI-powered semantic matching!
