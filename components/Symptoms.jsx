// SymptomAnalysis.jsx
import { useState } from 'react';

const SYMPTOMS = [
  'abdominal pain', 'back pain', 'belly pain', 'chest pain',
  'hip joint_pain', 'joint pain', 'knee pain', 'muscle pain', 'painful walking'
];

const SymptomAnalysis = () => {
  const [query, setQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const filteredSymptoms = SYMPTOMS.filter(symptom =>
    symptom.toLowerCase().includes(query.toLowerCase()) &&
    !selectedSymptoms.includes(symptom)
  );

  const addSymptom = (symptom) => {
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setQuery('');
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  return (
    <div className="min-h-screen   p-6">
      <div className="max-w-4xl mx-auto  rounded-3xl p-8 ">
        <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center">Symptom Analysis</h2>
        <p className="mb-6 text-gray-600 text-center">
          Experience instant clarity with our Symptom Analysis feature. Enter your symptoms and get precise recommendations and insights tailored to you.
        </p>

        <input
          type="text"
          placeholder="Type a symptom..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-purple-300 p-3 rounded-full mb-4  focus:border-purple-600 text-black"
        />

        <div className="flex flex-wrap gap-3 mb-6">
          {filteredSymptoms.map((symptom) => (
            <button
              key={symptom}
              onClick={() => addSymptom(symptom)}
              className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full hover:bg-purple-300 transition"
            >
              {symptom}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6 border p-4 rounded-lg bg-purple-50 min-h-[60px]">
          {selectedSymptoms.map((symptom) => (
            <div key={symptom} className="bg-purple-300 text-purple-900 px-4 py-2 rounded-full flex items-center gap-2">
              {symptom}
              <button onClick={() => removeSymptom(symptom)} className="font-bold text-purple-900">×</button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition">
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalysis;
