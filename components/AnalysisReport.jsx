
const AnalysisReport = ({prediction,setPrediction}) => {
  const handleOptionClick = (option) => {
    alert(`You selected: ${option}`);
    // Replace with navigation or appropriate logic
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-purple-200 p-6">
      <button onClick={()=>setPrediction(null)}>close </button>
      <div className="mt-8 bg-purple-100 p-6 rounded-lg shadow-inner text-center">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              Prediction Result
            </h3>
              <>
                <p className="text-purple-900 text-lg">
                  <span className="font-semibold">Disease:</span>{" "}
                  {prediction.predicted_disease}
                </p>
                <p className="text-purple-900 text-lg">
                  <span className="font-semibold">Confidence:</span>{" "}
                  {(prediction.confidence * 1000).toFixed(2)}%
                </p>
              </>
          </div>
      {/* Main Container */}
      <div className="max-w-xl w-full bg-purple-100 p-8 rounded-3xl shadow-lg border border-purple-300 text-center">
        {/* Icon and Title */}
        <div className="mb-6">
          <div className="w-12 h-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-purple-700 mt-4">
            Analysis Report
          </h1>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-8">
          Your symptoms do not match any known disease. Please consult a doctor
          or choose an option below for assistance.
        </p>

        {/* Assistance Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleOptionClick("Find a Doctor")}
            className="bg-blue-600 text-white py-3 rounded-full shadow hover:bg-blue-700 hover:shadow-lg transition duration-300 ease-in-out"
          >
            Yes, find me a doctor
          </button>
          <button
            onClick={() => handleOptionClick("AI Assistance")}
            className="bg-indigo-600 text-white py-3 rounded-full shadow hover:bg-indigo-700 hover:shadow-lg transition duration-300 ease-in-out"
          >
            Yes, get me AI assistance
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          This analysis is for informational purposes only. Always consult a
          qualified doctor for medical advice.
        </p>
      </div>
    </div>
  );
};

export default AnalysisReport;
