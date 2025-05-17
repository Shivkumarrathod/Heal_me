import { useState } from "react";
import { FaStar } from "react-icons/fa";
import doctorsData from "./doctorsData";

const DoctorConsult = () => {
  const [filter, setFilter] = useState("");

  const filteredDoctors = filter
    ? doctorsData.filter((doc) => doc.specialisation === filter)
    : doctorsData;

  const specialisations = [...new Set(doctorsData.map((doc) => doc.specialisation))];

  const handleSeeTimings = (doctorName) => {
    alert(`See timings for ${doctorName}`);
  };

  return (
    <div className="p-6 bg-purple-100 rounded-lg">
      <h2 className="text-3xl font-bold text-purple-800 mb-4">Consult Doctor</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="py-2 px-4 mb-6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
      >
        <option value="">Select a filter</option>
        {specialisations.map((spec) => (
          <option key={spec} value={spec}>
            {spec}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={doctor.imageUri}
              alt={doctor.name}
              className="w-33 h-55 object-cover"
            />
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-purple-600">{doctor.specialisation}</p>
                <p className="text-gray-600">{doctor.experience}</p>
                <p className="text-gray-500">{doctor.address}</p>
              </div>
              <div className="mt-2 flex items-center">
                {[...Array(doctor.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
                {[...Array(5 - doctor.rating)].map((_, i) => (
                  <FaStar key={`empty-${i}`} className="text-gray-300" />
                ))}
              </div>
              <button
                onClick={() => handleSeeTimings(doctor.name)}
                className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg shadow hover:bg-purple-700 transition"
              >
                See All Timings
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorConsult;
