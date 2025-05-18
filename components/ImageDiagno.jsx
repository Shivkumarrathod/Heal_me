'use client';
import { Camera, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';

import axios from 'axios';

const STORAGE_KEY = 'imageDiagnosisResult';

const ImageDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(() => {
    // Initialize from sessionStorage to persist across refreshes
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Persist diagnosisResult to sessionStorage whenever it changes
  useEffect(() => {
    if (diagnosisResult) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(diagnosisResult));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    console.log("diagnosisResult changed:", diagnosisResult);
  }, [diagnosisResult]);

  // Clean up preview URL on unmount or when it changes
  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (previewURL) URL.revokeObjectURL(previewURL);
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      console.log("Submitting image...");

      const response = await axios.post('http://localhost:9000/predict1', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000, // optional timeout
      });

      console.log("Response data:", response.data);
      setDiagnosisResult(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setDiagnosisResult({ error: 'Error processing image.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6 flex items-center justify-center">
      <div className="w-full p-8 rounded-3xl flex gap-x-12 max-w-6xl">
        {/* Left side: Image preview and upload */}
        <div className="flex flex-col items-center w-1/2">
          <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
            Image Diagnosis
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Upload an image for a quick and accurate diagnosis.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-xl mb-6 overflow-hidden">
              {previewURL ? (
                <img
                  src={previewURL}
                  alt="Selected preview"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Camera size={64} className="text-gray-400" />
              )}
            </div>

            <label
              htmlFor="imageUpload"
              className="bg-green-600 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-green-700 transition flex items-center gap-2 mb-4"
            >
              <Upload size={18} /> Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className={`w-full py-3 rounded-full text-white transition ${
                selectedFile && !loading
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </form>
        </div>

        {/* Right side: Diagnosis result + Tips */}
        <div className="w-1/2 flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">Diagnosis Result</h3>
          <div className="p-6 bg-green-100 border border-green-300 rounded-lg min-h-[200px] flex flex-col items-center justify-center">
            {!diagnosisResult ? (
              <div className="flex flex-col gap-4 w-full">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-semibold mb-2">What Image?</h4>
                  <p className="text-gray-600 text-sm">
                    Upload a clear, well-lit photo showing the area of concern.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-semibold mb-2">How to Upload?</h4>
                  <p className="text-gray-600 text-sm">
                    Click the "Upload Image" button and select an image file from your device.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-semibold mb-2">Image Format</h4>
                  <p className="text-gray-600 text-sm">
                    Supported formats: JPG, PNG, or BMP. Max size 5MB.
                  </p>
                </div>
              </div>
            ) : diagnosisResult.error ? (
              <p className="text-red-600 text-center">{diagnosisResult.error}</p>
            ) : (
              <div className="text-green-800 text-center space-y-2">
                <p>
                  <strong>Class:</strong> {diagnosisResult.class || "N/A"}
                </p>
                {/* <p>
                  <strong>Confidence:</strong> {diagnosisResult.confidence}
                </p> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDiagnosis;
