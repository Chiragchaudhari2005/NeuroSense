from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
import cv2
import numpy as np
import joblib
from skimage.feature import hog
import sys
import os
import tempfile
import uuid
from app.utils.report_generator import create_report

# Append the directory containing the model files to the path or use absolute path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
MODEL_PATH = os.path.join(BASE_DIR, "alzheimers_fastest.pkl")

router = APIRouter()

try:
    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading models: {e}")
    scaler = None
    model = None

TEMP_DIR = os.path.join(tempfile.gettempdir(), "neurosense_reports")
os.makedirs(TEMP_DIR, exist_ok=True)

IMG_SIZE = 128
CLASSES = [
    "NonDemented",
    "VeryMildDemented",
    "MildDemented",
    "ModerateDemented"
]

def extract_features(image):
    image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    features = hog(
        gray,
        orientations=9,
        pixels_per_cell=(8, 8),
        cells_per_block=(2, 2),
        block_norm='L2-Hys'
    )
    return features

@router.post("/predict_image")
async def predict_image(file: UploadFile = File(...)):
    if model is None or scaler is None:
         return JSONResponse(status_code=500, content={"error": "Models not loaded. Check backend configuration."})
        
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            return JSONResponse(status_code=400, content={"error": "Invalid image file"})

        features = extract_features(image)
        scaled_features = scaler.transform(features.reshape(1, -1))

        pred_class_idx = model.predict(scaled_features)[0]
        pred_class = CLASSES[pred_class_idx]

        try:
            probabilities = model.predict_proba(scaled_features)[0]
            probability = float(np.max(probabilities))
        except AttributeError:
            # Fallback for scikit-learn 1.8 to 1.7.2 unpickling issue where predict_proba fails
            scores = model.decision_function(scaled_features)[0]
            exp_scores = np.exp(scores - np.max(scores))
            probabilities = exp_scores / np.sum(exp_scores)
            probability = float(np.max(probabilities))
        except:
            probability = 1.0

        # Generate Report
        temp_img_path = os.path.join(TEMP_DIR, f"temp_{uuid.uuid4()}.jpg")
        cv2.imwrite(temp_img_path, image)
        
        report_id, pdf_path = create_report(
            image_path=temp_img_path,
            predicted_class=pred_class,
            confidence=probability,
            output_dir=TEMP_DIR
        )

        return {"risk": pred_class, "probability": float(probability), "report_url": f"/download-report/{report_id}"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.get("/download-report/{report_id}")
async def download_report(report_id: str):
    pdf_path = os.path.join(TEMP_DIR, f"{report_id}.pdf")
    if os.path.exists(pdf_path):
         return FileResponse(pdf_path, media_type='application/pdf', filename=f"NeuroSense_Report_{report_id}.pdf")
    return JSONResponse(status_code=404, content={"error": "Report not found"})
