import requests

# We need a sample image to test with
url = 'http://127.0.0.1:8000/predict_image'

# Let's use any dummy image from the dataset if available, or just create a random image.
import numpy as np
import cv2
import os

img = np.zeros((128, 128, 3), dtype=np.uint8)
cv2.imwrite("test_img.jpg", img)

with open("test_img.jpg", "rb") as f:
    files = {"file": f}
    resp = requests.post(url, files=files)
    print(resp.json())

os.remove("test_img.jpg")
