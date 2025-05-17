import { useState } from "react";

const AnalysisReport = ({ prediction, setPrediction }) => {
  const [selectedDisease, setSelectedDisease] = useState(null);

  if (!prediction || !prediction.predictions) return null;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-purple-50 to-purple-200 p-6">
      {/* Top Disclaimer */}
      <div className="max-w-3xl mx-auto mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 text-sm rounded shadow">
        <strong>Tip:</strong> Entering clear and specific symptoms helps improve the accuracy of disease predictions.
      </div>

      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setPrediction(null)}
          className="bg-red-100 text-red-500 hover:bg-red-200 px-4 py-2 rounded-full font-semibold"
        >
          ✕ Close
        </button>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        Top Disease Predictions
      </h2>

      {/* Disease List */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <ul className="divide-y divide-purple-100">
          {prediction.predictions.map((item, index) => (
            <li
              key={index}
              className="p-4 hover:bg-purple-50 cursor-pointer flex justify-between items-center"
              onClick={() => setSelectedDisease(item)}
            >
              <span className="text-lg font-medium text-purple-800">{item.name}</span>
              <span className="text-sm text-gray-500">
                {(item.confidence * 100).toFixed(2)}% Matched
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Full-Screen Modal */}
      {selectedDisease && (
        <div className="fixed min-h-screen inset-0 z-50 flex items-center justify-center wi">
          {/* Blurred Background */}
          <div className="absolute inset-0 w-[] bg-opacity-40 backdrop-blur-sm"></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 z-50">
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute top-3 right-3 bg-red-100 text-red-500 hover:bg-red-200 px-3 py-1 rounded-full font-semibold"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-purple-700 mb-4">
              {selectedDisease.name}
            </h3>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-purple-600">Matched:</span>{" "}
              {(selectedDisease.confidence * 100).toFixed(2)}%
            </p>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-purple-600 mb-1">
                Description:
              </h4>
              <p className="text-gray-700">{selectedDisease.description}</p>
            </div>

            {/* Precautions */}
            <div>
              <h4 className="text-lg font-semibold text-purple-600 mb-1">
                Precautions:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {selectedDisease.precautions.map((precaution, idx) => (
                  <li key={idx}>{precaution}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Disclaimer */}
      <div className="mt-8 max-w-3xl mx-auto p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm rounded shadow">
        <strong>Note:</strong> These predictions are AI-generated. Please consult a healthcare professional for accurate diagnosis and treatment.
      </div>
    </div>
  );
};

export default AnalysisReport;
