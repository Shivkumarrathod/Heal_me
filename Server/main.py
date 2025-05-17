from fastapi import FastAPI,HTTPException,Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import tensorflow as tf
import pandas as pd
from models import UserSchema, DoctorSchema


# Import MongoDB connection
from utiles import db

# Load static files
desc_df = pd.read_csv("symptom_Description[1].csv")
desc_dict = dict(zip(desc_df['Disease'].str.lower().str.strip(), desc_df['Description']))

prec_df = pd.read_csv("symptom_precaution[1].csv")
prec_dict = {
    row['Disease'].lower().strip(): [row['Precaution_1'], row['Precaution_2'], row['Precaution_3'], row['Precaution_4']]
    for _, row in prec_df.iterrows()
}

# Load model and encoders
model = tf.keras.models.load_model("disease_prediction_model.h5")
mlb = joblib.load("symptom_encoder.joblib")
le = joblib.load("label_encoder.joblib")

app = FastAPI(
    title="Symptom Analysis & Disease Prediction API",
    description="API with MongoDB integration",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomInput(BaseModel):
    symptoms: List[str]

@app.get("/")
async def root():
    return {"message": "FastAPI server running with MongoDB connected"}

#--------------------------------Model-----------------------------------------------------
@app.post("/predict")
async def predict_disease(data: SymptomInput):
    input_symptoms = [s.strip().lower() for s in data.symptoms]

    try:
        input_vector = mlb.transform([input_symptoms])
    except Exception as e:
        return {"error": f"Invalid input symptoms: {str(e)}"}

    prediction = model.predict(input_vector)[0]
    top_indices = prediction.argsort()[-4:][::-1]

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
    return {"predictions":results}
#---------------------------------------------User-------------------------------------------------------
@app.post("/register/user")
async def register_user(user: UserSchema):
    existing = await db.users.find_one({"phone": user.phone})
    if existing:
        return {"message": "User already registered"}
    await db.users.insert_one(user.dict())
    return {"message": "User registered successfully"}
from fastapi import HTTPException

@app.get("/user/{phone}")
async def get_user_by_phone(phone: str):
    user = await db.users.find_one({"phone": phone})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])  # Convert ObjectId to string for JSON serialization
    return {"user": user}

@app.put("/user/{phone}")
async def update_user_profile(phone: str = Path(..., example="9876543210"), user: UserSchema = ...):
    existing_user = await db.users.find_one({"phone": phone})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare dict with fields to update, ignoring phone because it's identifier
    update_data = user.dict(exclude_unset=True, exclude={"phone"})
    
    # Optional: preserve original created_at if not sent in update
    if "created_at" not in update_data:
        update_data["created_at"] = existing_user.get("created_at", datetime.utcnow())

    await db.users.update_one({"phone": phone}, {"$set": update_data})
    updated_user = await db.users.find_one({"phone": phone})
    updated_user["_id"] = str(updated_user["_id"])

    return {"message": "User profile updated successfully", "user": updated_user}

#-------------------------------------Doctor-----------------------------------------------

@app.post("/register/doctor")
async def register_doctor(doctor: DoctorSchema):
    existing = await db.doctors.find_one({"email": doctor.email})
    if existing:
        raise HTTPException(status_code=400, detail="Doctor already exists")
    await db.doctors.insert_one(doctor.dict())
    return {"message": "Doctor registered successfully"}

@app.get("/doctors")
async def get_all_doctors():
    doctors_cursor = db.doctors.find()
    doctors = []
    async for doctor in doctors_cursor:
        doctor["_id"] = str(doctor["_id"])  # Convert ObjectId to string
        doctors.append(doctor)
    return {"doctors": doctors}

@app.get("/doctor/email/{email}")
async def get_doctor_by_email(email: str):
    doctor = await db.doctors.find_one({"email": email})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor["_id"] = str(doctor["_id"])
    return {"doctor": doctor}
