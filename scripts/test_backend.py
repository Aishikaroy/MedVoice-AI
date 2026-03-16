import requests  # type: ignore
import json

BASE_URL = "http://localhost:8001"

def test_root():
    print("Testing Root...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_chat():
    print("\nTesting Chat/Analysis...")
    payload = {
        "messages": [
            {"role": "user", "content": "I have a sharp pain in my chest and a dry cough."}
        ],
        "user_id": "00000000-0000-0000-0000-000000000000",
        "conversation_id": None
    }
    try:
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        print(f"Status: {response.status_code}")
        res_json = response.json()
        if res_json.get("status") == "success":
            data = res_json.get("data", {})
            messages = data.get("messages", [])
            if messages:
                last_msg = messages[-1]
                content = last_msg.get("content", "")
                try:
                    # Assistant content is a JSON string
                    content_data = dict(json.loads(str(content)))
                    analysis = content_data.get("diagnosis", "No diagnosis found")
                    analysis_str = str(analysis)
                    print(f"Analysis: {analysis_str[:200]}...") # type: ignore
                except Exception:
                    raw_content = str(content)
                    print(f"Raw Content: {raw_content[:200]}...") # type: ignore
            else:
                print("No messages in response")
        else:
            print(f"Error from API: {res_json}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    print("Starting Backend Verification (Ensure FastAPI is running on localhost:8001)")
    test_root()
    test_chat()
