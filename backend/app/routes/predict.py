from fastapi import APIRouter
from app.schemas.request_schema import InputData
from app.utils.preprocess import process_input
from app.utils.risk_logic import get_risk
import joblib

router = APIRouter()

model = joblib.load("app/models/model.pkl")

@router.post("/predict")
def predict(data: InputData):
    import traceback
    try:
        processed = process_input(data)
        prob = model.predict_proba([processed])[0][1]
        risk, scaled_prob = get_risk(prob)
        return {
            "probability": float(round(scaled_prob, 3)),
            "risk": risk
        }
    except Exception as e:
        traceback.print_exc()
        return {"error": str(e), "traceback": traceback.format_exc()}