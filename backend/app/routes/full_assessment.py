from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import joblib
from skimage.feature import hog
import sys
import os
import tempfile
import uuid
from app.utils.preprocess import process_input
from app.utils.mmse_mapper import map_to_mmse
from app.utils.report_generator import create_full_report

router = APIRouter()
model_tabular = joblib.load("app/models/model.pkl")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
scaler_img = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
model_img = joblib.load(os.path.join(BASE_DIR, "alzheimers_fastest.pkl"))

CLASSES = ["NonDemented", "VeryMildDemented", "MildDemented", "ModerateDemented"]
IMG_SIZE = 128
TEMP_DIR = os.path.join(tempfile.gettempdir(), "neurosense_reports")
os.makedirs(TEMP_DIR, exist_ok=True)

class TabularDataTemp:
    def __init__(self, age, gender, education, ses, cognitive_score):
        self.age = age
        self.gender = gender
        self.education = education
        self.ses = ses
        self.cognitive_score = cognitive_score

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

@router.post("/full_assessment")
async def full_assessment(
    age: int = Form(...),
    gender: int = Form(...),
    education: int = Form(...),
    ses: int = Form(...),
    cognitive_score: float = Form(...),
    mri_image: UploadFile = File(...)
):
    try:
        # 1. Cognitive logic
        data = TabularDataTemp(age, gender, education, ses, cognitive_score)
        processed = process_input(data)
        cog_prob = float(model_tabular.predict_proba([processed])[0][1])
        
        # 2. MRI Logic
        contents = await mri_image.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            return JSONResponse(status_code=400, content={"error": "Invalid MRI image"})
        
        features = extract_features(image)
        scaled_features = scaler_img.transform(features.reshape(1, -1))
        pred_class_idx = model_img.predict(scaled_features)[0]
        pred_class = CLASSES[pred_class_idx]
        
        try:
             probabilities = model_img.predict_proba(scaled_features)[0]
             mri_prob = float(np.max(probabilities))
        except AttributeError:
             scores = model_img.decision_function(scaled_features)[0]
             exp_scores = np.exp(scores - np.max(scores))
             probabilities = exp_scores / np.sum(exp_scores)
             mri_prob = float(np.max(probabilities))
             
        # Normalize mri_prob to risk if necessary. We assume mri_prob is risk as requested:
        # final_score = (0.4 * cognitive_probability) + (0.6 * mri_probability)
        # But if NonDemented, high confidence means low risk. 
        # For simplicity and sticking exactly to the user's prompt formula:
        if pred_class == "NonDemented":
             normalized_mri_risk = 1.0 - mri_prob
        else:
             normalized_mri_risk = mri_prob
             
        final_score = (0.4 * cog_prob) + (0.6 * normalized_mri_risk)
        
        if final_score < 0.30:
            final_risk_category = "Low Risk"
        elif final_score <= 0.70:
            final_risk_category = "Medium Risk"
        else:
            final_risk_category = "High Risk"
            
        final_score = float(max(0.0, min(final_score, 1.0)))

        # Generate report
        temp_img_path = os.path.join(TEMP_DIR, f"temp_{uuid.uuid4()}.jpg")
        cv2.imwrite(temp_img_path, image)
        
        report_id, pdf_path = create_full_report(
            patient_data={"age": age, "gender": gender, "education": education, "ses": ses},
            cognitive_data={"cognitive_score": cognitive_score, "mmse_score": map_to_mmse(cognitive_score), "probability": cog_prob},
            mri_data={"predicted_class": pred_class, "confidence": mri_prob, "image_path": temp_img_path},
            final_data={"final_score": final_score, "final_risk_category": final_risk_category},
            output_dir=TEMP_DIR
        )
        
        return {
           "patient": {"age": age, "gender": gender, "education": education, "ses": ses},
           "cognitive_result": {"probability": cog_prob},
           "mri_result": {"risk": pred_class, "probability": mri_prob},
           "final_assessment": {"final_score": final_score, "final_risk_category": final_risk_category},
           "report_url": f"/download-report/{report_id}"
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
