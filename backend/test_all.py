import requests
import json

test_cases = [
    [60, 1, 14, 3, 29], # 1
    [50, 0, 16, 4, 30], # 2
    [72, 1, 12, 2, 24], # 3
    [75, 0, 8, 1, 23],  # 4
    [82, 1, 10, 1, 18], # 5
    [88, 0, 6, 1, 15],  # 6
    [85, 1, 12, 3, 28], # 7
    [55, 0, 14, 3, 20], # 8
    [68, 1, 12, 2, 25], # 9
    [62, 0, 16, 4, 29]  # 10
]

url = 'http://127.0.0.1:8000/predict'

for i, tc in enumerate(test_cases, start=1):
    payload = {
        "age": tc[0],
        "gender": tc[1],
        "education": tc[2],
        "ses": tc[3],
        "cognitive_score": tc[4]
    }
    
    resp = requests.post(url, json=payload)
    data = resp.json()
    
    print(f"Test Case {i}: Input={tc} -> Risk: {data.get('risk')} ({data.get('probability')})")
