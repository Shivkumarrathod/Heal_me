// ImageDiagnosis.jsx
import { Camera, Upload } from 'lucide-react';
import { useState } from 'react';

const ImageDiagnosis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      // Simulate a diagnosis process
      setTimeout(() => {
        setDiagnosisResult("Diagnosis complete: No abnormalities detected.");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">Image Diagnosis</h2>
        <p className="text-gray-600 mb-6 text-center">
          Upload an image for a quick and accurate diagnosis.
        </p>

        <div className="flex flex-col items-center mb-6">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected preview"
              className="w-48 h-48 object-cover rounded-xl border border-gray-300 mb-4"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-xl mb-4">
              <Camera size={48} className="text-gray-400" />
            </div>
          )}

          <label
            htmlFor="imageUpload"
            className="bg-green-600 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-green-700 transition flex items-center gap-2"
          >
            <Upload size={18} /> Upload Image
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedImage}
          className={`w-full py-3 rounded-full text-white transition ${
            selectedImage
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Analyze Image
        </button>

        {diagnosisResult && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800">
            {diagnosisResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDiagnosis;
