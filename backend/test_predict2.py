import traceback
from fastapi.testclient import TestClient
from app.main import app

def run():
    client = TestClient(app)
    response = client.post("/predict", json={
        "age": 65,
        "gender": 0,
        "education": 12,
        "ses": 3,
        "cognitive_score": 25
    })
    print("Status code:", response.status_code)
    try:
        print("Response JSON:", response.json())
    except:
        print("Response text:", response.text)

if __name__ == "__main__":
    run()
