# NeuroSense

NeuroSense is an application designed for Alzheimer's prediction and cognitive testing. It acts as a comprehensive platform featuring an easy-to-use interface and a robust backend to process user inputs, conduct interactive cognitive tests, and evaluate the risk of Alzheimer's disease using machine learning models.

## Project Structure

The project is split into two primary components:
- **`backend/`**: A Python-based FastAPI server that handles data processing, API endpoints, and machine learning model integrations for risk assessment.
- **`frontend/`**: A modern React application (built with Vite and TypeScript) that provides a dynamic, user-friendly interface for cognitive testing and dashboard visualization.

---

## Getting Started

To run NeuroSense locally on your machine, you will need to start both the backend and frontend development servers.

### 1. Run the Backend (FastAPI)

Ensure you have Python installed on your system. 

```bash
# Navigate to the backend directory
cd backend

# Make sure you have the required packages installed (e.g., fastapi, uvicorn).
# You can install them if they are missing:
# pip install fastapi uvicorn

# Start the FastAPI server in development mode
uvicorn app.main:app --reload
```

The backend server defaults to running on `http://127.0.0.1:8000`. 
(Tip: You can access the auto-generated interactive API documentation at `http://127.0.0.1:8000/docs`).

### 2. Run the Frontend (React + Vite)

Ensure you have [Node.js](https://nodejs.org/) and `npm` installed.

```bash
# Open a NEW terminal window and navigate to the frontend directory
cd frontend

# Install all the necessary node dependencies (only required the first time)
npm install

# Start the Vite development server
npm run dev
```

The frontend will start running, and you can view it in your browser (typically at `http://localhost:5173`).
