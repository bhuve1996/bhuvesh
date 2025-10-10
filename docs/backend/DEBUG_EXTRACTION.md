# Debug Extraction Issues 🔍

## Problem

Resume extraction seems incomplete - only extracting ~470 words when there should be much more.

## Changes Made

1. ✅ Commented out AI/ML processing (semantic analysis, job detection)
2. ✅ Added simple job detection from resume text keywords
3. ✅ Created test_extraction.py for local debugging

## How to Test Locally

### Step 1: Test Extraction Directly

```bash
cd backend
source venv/bin/activate
python test_extraction.py ../public/Bhuvesh_Singla_Resume.docx
```

This will:

- Extract text from your resume
- Show word count, character count
- Display first 500 and last 500 characters
- Save full extracted text to `Bhuvesh_Singla_Resume.docx_extracted.txt`
- Show formatting issues (images, tables, etc.)

### Step 2: Check the Extracted File

```bash
# View the extracted text file
cat Bhuvesh_Singla_Resume.docx_extracted.txt

# Count words
wc -w Bhuvesh_Singla_Resume.docx_extracted.txt

# Count characters
wc -c Bhuvesh_Singla_Resume.docx_extracted.txt
```

### Step 3: Test via API

```bash
# Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# In another terminal, test with curl
curl -X POST http://localhost:8000/api/upload/analyze \
  -F "file=@../public/Bhuvesh_Singla_Resume.docx" \
  -F "job_description=Senior Frontend Developer" \
  | jq '.data.extraction_details' > extraction_output.json

# Check the output
cat extraction_output.json
```

## What to Look For

### Good Extraction:

```
Word Count: 600-800 (for a typical resume)
Character Count: 4000-6000
Extracted text shows:
- Full name
- Full work experience
- All skills
- Education
- Complete job descriptions
```

### Bad Extraction (Current Issue):

```
Word Count: 470 (too low!)
Missing sections
Text cuts off mid-sentence
```

## Common Issues & Solutions

### Issue 1: Resume is Image-Based

**Problem:** DOCX contains images of text (screenshot of resume)
**Solution:**

- Re-export resume as text-based DOCX (not images)
- Or use OCR (Optical Character Recognition)

### Issue 2: Complex Formatting

**Problem:** Tables, text boxes, shapes blocking extraction
**Solution:**

- Simplify resume layout
- Use standard paragraphs
- Avoid text boxes

### Issue 3: Hidden Text/Layers

**Problem:** Text in hidden layers or comments
**Solution:**

- Copy-paste resume content to new document
- Save as simple DOCX

## Debugging Output Example

```
================================================================================
Testing extraction for: ../public/Bhuvesh_Singla_Resume.docx
================================================================================

📄 File Type: docx
📊 Word Count: 470
📊 Character Count: 3245
📊 Paragraph Count: 15

🎨 Formatting Analysis:
  - Images: 3
  - Tables: 0
  - ATS Friendly: False

⚠️  Formatting Issues:
  - Contains 3 image(s) - may cause ATS issues

📝 Extracted Text Preview (first 500 chars):
--------------------------------------------------------------------------------
BHUVESH SINGLA
 +91 - 9530529550 |   bhuve1996@gmail.com | Linkedin

SUMMARY
Senior Software Developer / Frontend Engineer with 7+ years...
--------------------------------------------------------------------------------
```

## Next Steps

1. Run `test_extraction.py` to see what's being extracted
2. Check if your DOCX has images (formatting_issues will show this)
3. If images found, re-export resume as text-only DOCX
4. Re-test extraction
5. Once extraction is good, re-enable AI processing

## Files Changed (Temporary)

- `backend/app/services/ats_analyzer.py` - Disabled AI processing
- `backend/test_extraction.py` - New test script

## To Re-Enable AI Processing

Uncomment these lines in `ats_analyzer.py`:

```python
# Line 73: semantic_analysis = self._analyze_semantic_match(resume_text, jd_text)
# Line 87: detected_job, job_confidence = job_detector.detect_job_type(resume_text)
```

And remove the placeholder code.
