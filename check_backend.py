import http.client
import json
import time

def check_health():
    conn = http.client.HTTPConnection("127.0.0.1", 8000)
    try:
        conn.request("GET", "/health")
        res = conn.getresponse()
        data = res.read()
        print(f"Status: {res.status}")
        print(f"Data: {data.decode()}")
        return res.status == 200
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    # Give it a few tries
    for i in range(5):
        if check_health():
            print("Backend is Healthy!")
            break
        print(f"Retry {i+1}...")
        time.sleep(2)
