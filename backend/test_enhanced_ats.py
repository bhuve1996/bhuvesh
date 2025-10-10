"""
Test script for enhanced ATS checker
Tests the new semantic matching and formatting analysis features
"""

import json

import requests

BASE_URL = "http://localhost:8000"


def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_supported_formats():
    """Test supported formats endpoint"""
    print("\n=== Testing Supported Formats ===")
    response = requests.get(f"{BASE_URL}/api/upload/supported-formats")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_parse_resume():
    """Test resume parsing (without job description)"""
    print("\n=== Testing Resume Parsing ===")

    # You can change this to your resume file path
    resume_path = "test_resume.txt"

    try:
        with open(resume_path, "rb") as f:
            files = {"file": (resume_path, f, "text/plain")}
            response = requests.post(f"{BASE_URL}/api/upload/parse", files=files)

            print(f"Status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                print(f"Success: {data['success']}")
                print(f"Message: {data['message']}")
                print("\nParsed Data:")
                print(f"  - Filename: {data['data'].get('filename')}")
                print(f"  - Word Count: {data['data'].get('word_count')}")
                print(f"  - Character Count: {data['data'].get('character_count')}")

                formatting = data["data"].get("formatting_analysis", {})
                print("\nFormatting Analysis:")
                print(f"  - ATS Friendly: {formatting.get('ats_friendly', 'N/A')}")
                print(f"  - Images: {formatting.get('images_count', 0)}")
                print(f"  - Tables: {formatting.get('tables_detected', False)}")

                if formatting.get("formatting_issues"):
                    print(f"  - Issues: {formatting['formatting_issues']}")

                return True
            else:
                print(f"Error: {response.json()}")
                return False

    except FileNotFoundError:
        print(f"Error: File '{resume_path}' not found")
        return False


def test_analyze_with_job_description():
    """Test full ATS analysis with job description"""
    print("\n=== Testing ATS Analysis with Job Description ===")

    resume_path = "test_resume.txt"

    # Sample job description
    job_description = """
    Software Engineer - Full Stack Developer

    We are seeking an experienced Full Stack Developer to join our team.

    Requirements:
    - 3+ years of experience in software development
    - Strong proficiency in JavaScript, TypeScript, Python
    - Experience with React, Node.js, and modern web frameworks
    - Knowledge of SQL databases (PostgreSQL, MySQL)
    - Experience with AWS, Docker, and Kubernetes
    - Strong problem-solving skills and attention to detail
    - Bachelor's degree in Computer Science or related field

    Nice to have:
    - Experience with GraphQL and REST APIs
    - Knowledge of CI/CD pipelines
    - Agile/Scrum methodology experience

    Responsibilities:
    - Develop and maintain web applications
    - Collaborate with cross-functional teams
    - Write clean, maintainable code
    - Participate in code reviews
    - Implement automated testing
    """

    try:
        with open(resume_path, "rb") as f:
            files = {"file": (resume_path, f, "text/plain")}
            data = {"job_description": job_description}

            response = requests.post(
                f"{BASE_URL}/api/upload/analyze", files=files, data=data
            )

            print(f"Status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                print(f"Success: {result['success']}")
                print(f"Message: {result['message']}")

                analysis = result["data"]

                print(f"\n{'='*60}")
                print("ATS ANALYSIS RESULTS")
                print(f"{'='*60}")

                print(f"\n📊 OVERALL SCORE: {analysis.get('ats_score', 0)}/100")
                print(f"📈 Match Category: {analysis.get('match_category', 'N/A')}")

                print("\n📋 DETAILED SCORES:")
                scores = analysis.get("detailed_scores", {})
                print(f"  - Keyword Matching: {scores.get('keyword_score', 0)}/100")
                print(f"  - Semantic Similarity: {scores.get('semantic_score', 0)}/100")
                print(f"  - Format Quality: {scores.get('format_score', 0)}/100")
                print(f"  - Content Quality: {scores.get('content_score', 0)}/100")
                print(f"  - ATS Compatibility: {scores.get('ats_score', 0)}/100")

                print("\n✅ STRENGTHS:")
                for strength in analysis.get("strengths", []):
                    print(f"  • {strength}")

                print("\n❌ WEAKNESSES:")
                for weakness in analysis.get("weaknesses", []):
                    print(f"  • {weakness}")

                print("\n💡 SUGGESTIONS:")
                for suggestion in analysis.get("suggestions", []):
                    print(f"  • {suggestion}")

                print("\n🔑 KEYWORD MATCHES:")
                matched = analysis.get("keyword_matches", [])[:10]
                print(f"  Matched ({len(matched)}): {', '.join(matched)}")

                print("\n⚠️  MISSING KEYWORDS:")
                missing = analysis.get("missing_keywords", [])[:10]
                print(f"  Missing ({len(missing)}): {', '.join(missing)}")

                if not analysis.get("ats_friendly", True):
                    print("\n🚨 FORMATTING ISSUES:")
                    for issue in analysis.get("formatting_issues", []):
                        print(f"  • {issue}")

                print(f"\n{'='*60}\n")

                return True
            else:
                print(f"Error: {response.json()}")
                return False

    except FileNotFoundError:
        print(f"Error: File '{resume_path}' not found")
        print("Creating a sample test resume...")

        # Create sample resume
        sample_resume = """
        John Doe
        Software Engineer
        Email: john.doe@email.com | Phone: (555) 123-4567
        LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

        EXPERIENCE

        Senior Software Engineer - Tech Company Inc.
        January 2020 - Present
        - Developed and maintained full-stack web applications using React and Node.js
        - Implemented RESTful APIs serving 1M+ requests daily
        - Reduced application load time by 40% through optimization
        - Led code reviews and mentored junior developers
        - Collaborated with cross-functional teams in Agile environment

        Software Developer - StartUp XYZ
        June 2018 - December 2019
        - Built responsive web applications using JavaScript and Python
        - Designed and implemented database schemas in PostgreSQL
        - Deployed applications to AWS using Docker containers
        - Increased test coverage from 30% to 85%

        EDUCATION

        Bachelor of Science in Computer Science
        University of Technology, 2018
        GPA: 3.8/4.0

        SKILLS

        Programming Languages: JavaScript, TypeScript, Python, Java
        Web Technologies: React, Node.js, Express, HTML, CSS
        Databases: PostgreSQL, MySQL, MongoDB
        Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD
        Tools: Git, GitHub, VS Code, Jira
        """

        with open(resume_path, "w") as f:
            f.write(sample_resume)

        print(f"Created sample resume at: {resume_path}")
        print("Please run the script again to test with this resume.")
        return False
    except Exception as e:
        print(f"Error: {e!s}")
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("ENHANCED ATS CHECKER TEST SUITE")
    print("=" * 60)

    results = {
        "Health Check": test_health(),
        "Supported Formats": test_supported_formats(),
        "Parse Resume": test_parse_resume(),
        "Full ATS Analysis": test_analyze_with_job_description(),
    }

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")

    passed = sum(results.values())
    total = len(results)
    print(f"\nTotal: {passed}/{total} tests passed")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
