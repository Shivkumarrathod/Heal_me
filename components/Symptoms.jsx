"use client";
import { useState } from "react";
import { symptoms as SYMPTOMS } from "@/utils/disease";
import AnalysisReport from "./AnalysisReport";

const SymptomAnalysis = () => {
  const [query, setQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null); // { predicted_disease, confidence }
  const [error, setError] = useState(null);

  const formatSymptom = (symptom) => symptom.replace(/_/g, " ");

  const filteredSymptoms = SYMPTOMS.filter(
    (symptom) =>
      symptom
        .toLowerCase()
        .includes(query.toLowerCase().replace(/ /g, "_")) &&
      !selectedSymptoms.includes(symptom)
  );

  const addSymptom = (symptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setQuery("");
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const analyzeSymptoms = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      // Assuming data = { predicted_disease: "Jaundice", confidence: 0.04 }
      console.log(data);

      setPrediction(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (<>
    {prediction ? (<AnalysisReport prediction={prediction} setPrediction={setPrediction}/>):
    (
      <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="max-w-4xl w-full rounded-3xl p-8  ">
        <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center">
          Symptom Analysis
        </h2>
        <p className="mb-6 text-gray-600 text-center">
          Enter your symptoms and get precise recommendations and insights
          tailored to you.
        </p>

        <input
          type="text"
          placeholder="Type a symptom..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-2 border-purple-600 p-3 rounded-full mb-4 focus:border-purple-600 text-black"
        />

        {filteredSymptoms.length > 0 ? (
          <div className="flex flex-wrap gap-3 mb-6 max-h-40 overflow-y-auto">
            {filteredSymptoms.slice(0, 10).map((symptom) => (
              <button
                key={symptom}
                onClick={() => addSymptom(symptom)}
                className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full hover:bg-purple-300 transition"
              >
                {formatSymptom(symptom)}
              </button>
            ))}
          </div>
        ) : (
          query && (
            <p className="text-center text-gray-500 mb-6">
              No matching symptoms found.
            </p>
          )
        )}

        <div className="flex flex-wrap gap-3 mb-6 border p-4 rounded-lg bg-purple-50 min-h-[60px]">
          {selectedSymptoms.map((symptom) => (
            <div
              key={symptom}
              className="bg-purple-300 text-purple-900 px-4 py-2 rounded-full flex items-center gap-2"
            >
              {formatSymptom(symptom)}
              <button
                onClick={() => removeSymptom(symptom)}
                className="font-bold text-purple-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={analyzeSymptoms}
            disabled={selectedSymptoms.length === 0 || loading}
            className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <p className="mt-6 text-center text-red-600 font-semibold">{error}</p>
        )}

        
      </div>
     </div>
    )}
    </>
  );
};

export default SymptomAnalysis;
