# NeuroSense Backend

The NeuroSense backend is a high-performance FastAPI application designed to provide cognitive health risk assessments using machine learning. It serves a predictive model that analyzes user demographic and cognitive data to estimate the probability of neurological conditions.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- [Optional] Virtual environment (venv)

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Server
Start the FastAPI server with Uvicorn:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

## 📁 Project Structure

```text
backend/
├── app/
│   ├── main.py          # Application entry point and CORS configuration
│   ├── models/          # Trained ML models and scalers (.pkl files)
│   ├── routes/          # API route definitions
│   │   └── predict.py   # Prediction endpoint logic
│   ├── schemas/         # Pydantic data models for request/response
│   └── utils/           # Helper functions for processing and logic
│       ├── mmse_mapper.py  # Maps cognitive scores to standardized metrics
│       ├── preprocess.py   # Data transformation and scaling
│       └── risk_logic.py   # Categorizes prediction probability into risk levels
├── requirements.txt     # Python dependencies
└── README.md            # This file
```

## 🔌 API Endpoints

### `POST /predict`
Estimates the risk level based on input data.

**Request Body:**
```json
{
  "age": 70,
  "gender": 1,
  "education": 16,
  "ses": 2,
  "cognitive_score": 85
}
```

**Response:**
```json
{
  "probability": 0.12,
  "risk": "Low Risk"
}
```

## 🧠 Model Details
- **Algorithm**: XGBoost (Extreme Gradient Boosting).
- **Features**: Age, Gender, Education Level, SES (Socioeconomic Status), and MMSE (Mini-Mental State Examination).
- **Preprocessing**: 
  - Standardized MMSE mapping from raw cognitive scores.
  - Feature scaling using a pre-trained `StandardScaler`.
- **Risk Thresholds**:
  - **Low Risk**: Probability < 0.3
  - **Medium Risk**: 0.3 ≤ Probability < 0.85
  - **High Risk**: Probability ≥ 0.85

## 🛡️ Security & CORS
The application is configured with `CORSMiddleware` to allow requests from the frontend development environment by default.

## 📄 License
This project is part of the NeuroSense platform. All rights reserved.
