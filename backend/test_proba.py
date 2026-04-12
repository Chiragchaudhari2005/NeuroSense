import joblib
import numpy as np
from scipy.special import softmax

scaler = joblib.load('d:/CODE/NeuroSense/backend/scaler.pkl')
model = joblib.load('d:/CODE/NeuroSense/backend/alzheimers_fastest.pkl')

import cv2
from skimage.feature import hog
image = np.zeros((128, 128, 3), dtype=np.uint8)
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
features = hog(
    gray,
    orientations=9,
    pixels_per_cell=(8, 8),
    cells_per_block=(2, 2),
    block_norm='L2-Hys'
)

scaled_features = scaler.transform(features.reshape(1, -1))

try:
    scores = model.decision_function(scaled_features)
    print("Decision function:", scores)
    
    if scores.ndim == 1:
        # Binary case or multiclass OvR in some situations
        probs = np.exp(scores) / np.sum(np.exp(scores)) # Not truly correct for binary but let's test softmax
        pass
    else:
        probs = softmax(scores, axis=1)
    
    print("Calculated Probs:", probs)
    print("Max prob:", np.max(probs))
except Exception as e:
    print("Decision func error:", e)
