from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import tensorflow as tf

# === Load model and encoders ===
model = tf.keras.models.load_model("disease_prediction_model.h5")
mlb = joblib.load("symptom_encoder.joblib")
le = joblib.load("label_encoder.joblib")

# === FastAPI app instance ===
app = FastAPI(
    title="Symptom Analysis & Disease Prediction API",
    description="Backend API for symptom analysis and disease prediction with CORS enabled",
    version="1.0.0",
)

# === CORS configuration ===
origins = [
    "*"  # Allow all origins - change in production for security
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Request body structure ===
class SymptomInput(BaseModel):
    symptoms: List[str]

# === Health check endpoint ===
@app.get("/")
async def root():
    return {"message": "FastAPI server is running with CORS enabled"}

# === Symptom analysis (dummy example) ===
@app.post("/analyze-symptoms/")
async def analyze_symptoms(symptoms: List[str]):
    symptoms_lower = [s.lower().strip() for s in symptoms]
    if "fever" in symptoms_lower or "cough" in symptoms_lower:
        return {"prediction": "Possible Flu or Infection", "status": "Preliminary"}
    return {"prediction": "Unable to determine", "status": "Insufficient data"}

# === Disease prediction endpoint ===
@app.post("/predict")
async def predict_disease(data: SymptomInput):
    input_symptoms = [s.strip().lower() for s in data.symptoms]

    try:
        input_vector = mlb.transform([input_symptoms])
    except Exception as e:
        return {"error": f"Invalid input symptoms: {str(e)}"}

    prediction = model.predict(input_vector)
    predicted_class_index = np.argmax(prediction)
    predicted_disease = le.inverse_transform([predicted_class_index])[0]

    return {
        "predicted_disease": predicted_disease,
        "confidence": float(np.max(prediction))
    }
