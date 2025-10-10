"""
Test script to verify the complete ATS analysis system
This tests file parsing + ATS analysis end-to-end
"""


import requests


def test_complete_system():
    """
    Test the complete ATS analysis system with a real resume file
    """
    base_url = "http://localhost:8000"

    print("🧪 Testing Complete ATS Analysis System...")

    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Server is running")
        else:
            print("❌ Server health check failed")
            return
    except Exception as e:
        print(f"❌ Cannot connect to server: {e}")
        return

    # Test 2: Upload and analyze test resume
    try:
        with open("test_resume.txt", "rb") as f:
            files = {"file": ("test_resume.txt", f, "text/plain")}
            response = requests.post(f"{base_url}/api/upload/parse", files=files)

        if response.status_code == 200:
            result = response.json()
            print("✅ Resume analysis successful!")
            print(f"   Job Type: {result['data']['job_type']}")
            print(f"   ATS Score: {result['data']['ats_score']}/100")
            print(f"   Word Count: {result['data']['word_count']}")
            print(f"   Keyword Matches: {len(result['data']['keyword_matches'])}")
            print(f"   Missing Keywords: {len(result['data']['missing_keywords'])}")
            print(f"   Suggestions: {len(result['data']['suggestions'])}")

            # Show some details
            print("\n📊 Analysis Details:")
            print(
                f"   Matched Keywords: {', '.join(result['data']['keyword_matches'][:10])}"
            )
            print(
                f"   Missing Keywords: {', '.join(result['data']['missing_keywords'][:5])}"
            )
            print("   Top Suggestions:")
            for i, suggestion in enumerate(result["data"]["suggestions"][:3], 1):
                print(f"     {i}. {suggestion}")

        else:
            print(f"❌ Analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")

    except Exception as e:
        print(f"❌ Analysis test failed: {e}")

    print("\n🎉 Complete system test finished!")


if __name__ == "__main__":
    test_complete_system()
