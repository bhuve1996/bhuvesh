#!/usr/bin/env python3
"""
Simple health check script for Railway
This runs independently of the main app to verify the server is responding
"""

import os
import sys
import time

import requests


def check_health():
    """Check if the health endpoint is responding"""
    port = int(os.getenv("PORT", "8000"))
    url = f"http://localhost:{port}/health"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: HTTP {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False


if __name__ == "__main__":
    # Wait a bit for the server to start
    time.sleep(5)

    # Try multiple times
    for attempt in range(3):
        if check_health():
            sys.exit(0)
        time.sleep(10)

    print("❌ Health check failed after 3 attempts")
    sys.exit(1)
