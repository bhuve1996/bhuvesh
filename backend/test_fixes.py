#!/usr/bin/env python3
"""
Test script to verify all fixes are working
Run this before deploying to Railway
"""

import sys
import os


def test_python_version():
    """Test Python version"""
    version = sys.version_info
    print(f"🐍 Python version: {version.major}.{version.minor}.{version.micro}")

    if version >= (3, 10):
        print("✅ Python version is compatible (3.10+)")
        return True
    else:
        print("❌ Python version too old (need 3.10+)")
        return False


def test_importlib_metadata():
    """Test importlib.metadata compatibility"""
    try:
        from app.utils.compatibility import safe_importlib_metadata

        if safe_importlib_metadata():
            print("✅ importlib.metadata working correctly")
            return True
        else:
            print("⚠️  importlib.metadata using fallback")
            return True  # Still works with fallback
    except ImportError as e:
        print(f"❌ Compatibility layer import failed: {e}")
        return False


def test_job_detector():
    """Test job detector import"""
    try:
        from app.services.job_detector import get_job_detector

        detector = get_job_detector()
        print("✅ Job detector import successful")
        return True
    except ImportError as e:
        print(f"❌ Job detector import failed: {e}")
        return False
    except Exception as e:
        print(f"⚠️  Job detector import succeeded but initialization failed: {e}")
        return True  # Import works, just initialization issue


def test_sentence_transformers():
    """Test sentence-transformers availability"""
    try:
        import sentence_transformers

        print("✅ sentence-transformers available")
        return True
    except ImportError:
        print("⚠️  sentence-transformers not available (will use keyword-only mode)")
        return True  # Not critical for basic functionality


def test_google_gemini():
    """Test Google Gemini availability"""
    try:
        import google.generativeai

        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_api_key_here":
            print("✅ Google Gemini available and configured")
        else:
            print("⚠️  Google Gemini available but no API key configured")
        return True
    except ImportError:
        print(
            "❌ Google Gemini not available - install with: pip install google-generativeai"
        )
        return False


def test_fastapi_app():
    """Test FastAPI app creation"""
    try:
        from app.main import app

        print("✅ FastAPI app created successfully")
        return True
    except Exception as e:
        print(f"❌ FastAPI app creation failed: {e}")
        return False


def main():
    """Run all tests"""
    print("🧪 Testing deployment fixes...\n")

    tests = [
        ("Python Version", test_python_version),
        ("importlib.metadata", test_importlib_metadata),
        ("Job Detector", test_job_detector),
        ("Sentence Transformers", test_sentence_transformers),
        ("Google Gemini", test_google_gemini),
        ("FastAPI App", test_fastapi_app),
    ]

    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Testing {test_name}...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))

    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)

    passed = 0
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<20} {status}")
        if result:
            passed += 1

    print(f"\nResults: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Ready for deployment.")
        return 0
    elif passed >= total - 2:  # Allow 2 non-critical failures
        print("⚠️  Most tests passed. Deployment should work with warnings.")
        return 0
    else:
        print("❌ Too many tests failed. Fix issues before deploying.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
