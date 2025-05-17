from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import tensorflow as tf
import pandas as pd

# Load descriptions CSV and create lowercase key dict with stripped keys
desc_df = pd.read_csv("symptom_Description[1].csv")
desc_dict = dict(zip(desc_df['Disease'].str.lower().str.strip(), desc_df['Description']))

# Load precautions CSV and create lowercase key dict with stripped keys
prec_df = pd.read_csv("symptom_precaution[1].csv")
prec_dict = {
    row['Disease'].lower().strip(): [row['Precaution_1'], row['Precaution_2'], row['Precaution_3'], row['Precaution_4']]
    for _, row in prec_df.iterrows()
}

# Load your ML model and encoders
model = tf.keras.models.load_model("disease_prediction_model.h5")
mlb = joblib.load("symptom_encoder.joblib")
le = joblib.load("label_encoder.joblib")

app = FastAPI(
    title="Symptom Analysis & Disease Prediction API",
    description="Backend API for symptom analysis and disease prediction with CORS enabled",
    version="1.0.0",
)

origins = ["*"]  # Allow all origins for now; restrict in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomInput(BaseModel):
    symptoms: List[str]

@app.get("/")
async def root():
    return {"message": "FastAPI server is running with CORS enabled"}

@app.post("/predict")
async def predict_disease(data: SymptomInput):
    # Normalize input symptoms
    input_symptoms = [s.strip().lower() for s in data.symptoms]

    try:
        input_vector = mlb.transform([input_symptoms])
    except Exception as e:
        return {"error": f"Invalid input symptoms: {str(e)}"}

    # Get prediction probabilities
    prediction = model.predict(input_vector)[0]  # 1D array of probabilities

    # Get indices of top 4 predictions
    top_indices = prediction.argsort()[-4:][::-1]  # descending order

    # Create result list
    results = []
    for index in top_indices:
        disease = le.inverse_transform([index])[0]
        confidence = float(prediction[index])
        disease_key = disease.lower().strip()
        description = desc_dict.get(disease_key, "No description available")
        precautions = prec_dict.get(disease_key, ["No precautions found"])

        results.append({
            "name": disease,
            "confidence": confidence,
            "description": description,
            "precautions": precautions
        })

    return {"predictions": results}
