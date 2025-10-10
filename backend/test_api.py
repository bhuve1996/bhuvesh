"""
Simple test script to verify our API is working
This is like a basic test to make sure everything is set up correctly
"""


import requests


# Test the API endpoints
def test_api():
    base_url = "http://localhost:8000"

    print("🧪 Testing ATS Resume Checker API...")

    # Test 1: Root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")

    # Test 2: Health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

    # Test 3: Supported formats
    try:
        response = requests.get(f"{base_url}/api/upload/supported-formats")
        print(f"✅ Supported formats: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Supported formats failed: {e}")

    print("\n🎉 API testing complete!")


if __name__ == "__main__":
    test_api()
