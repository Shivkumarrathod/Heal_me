from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import shutil
import os

app = FastAPI(
    title="Skin Disease Image Diagnosis API",
    description="FastAPI backend for diagnosing skin conditions from images.",
    version="1.0.0",
)

# Enable CORS for frontend communication (adjust origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
IMG_SIZE = (224, 224)

try:
    model = load_model(MODEL_PATH, compile=False)
except Exception as e:
    raise RuntimeError(f"Failed to load model: {str(e)}")

# Disease class labels
class_labels = {
    0: "Actinic Keratoses or Bowens disease",
    1: "Basal Cell Carcinoma",
    2: "Benign Keratosis",
    3: "Dermatofibroma",
    4: "Melanoma",
    5: "Melanocytic Nevi",
    6: "Vascular skin lesion",
}

@app.get("/")
async def root():
    return {"message": "Skin Diagnosis API is running."}

@app.post("/predict1")
async def predict(image: UploadFile = File(...)):
    if not image:
        raise HTTPException(status_code=400, detail="No image uploaded")
    print(f"Received file: {image.filename} with content type: {image.content_type}")

    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)

    import uuid
    filename = f"{uuid.uuid4()}.jpg"  # safer unique filename
    temp_path = os.path.join(temp_dir, filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        print(f"Saved temp image to {temp_path}")

        img = load_img(temp_path, target_size=IMG_SIZE)
        print(f"Loaded image: {img}")

        img_array = img_to_array(img) / 255.0
        image_array = np.expand_dims(img_array, axis=0)
        print(f"Image array shape: {image_array.shape}")

        prediction = model.predict(image_array)
        predicted_class = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        print(f"Prediction: class={predicted_class}, confidence={confidence}")

        return {
            "class": class_labels.get(predicted_class, "Unknown"),
            "confidence": round(confidence * 100, 2),
        }

    except Exception as e:
        print(f"Error processing image: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
