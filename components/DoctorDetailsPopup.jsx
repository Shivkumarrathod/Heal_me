import { useState } from "react";

const DoctorDetailsPopup = ({ doctor, onClose }) => {
  if (!doctor) return null;

  // Availability data for time slots
  const initialAvailability = [
    { time: "10:00 AM", status: "Available" },
    { time: "11:00 AM", status: "Not Available" },
    { time: "12:00 PM", status: "Available" },
  ];

  const [availability, setAvailability] = useState(initialAvailability);

  // Handle booking a slot
  const handleBookSlot = (index) => {
    setAvailability((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, status: "Booked" } : slot
      )
    );
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        {/* Doctor details */}
        <h3 className="text-2xl font-bold mb-4 text-purple-800">{doctor.name}</h3>
        <p className="text-purple-600 mb-2">
          Specialisation: {doctor.specialisation}
        </p>
        <p className="text-gray-600 mb-2">Experience: {doctor.experience}</p>
        <p className="text-gray-500 mb-4">Address: {doctor.address}</p>

        {/* Time slots */}
        <h4 className="text-lg font-semibold mb-2">Available Time Slots:</h4>
        <ul className="mb-4">
          {availability.map((slot, index) => (
            <li
              key={index}
              className={`flex justify-between items-center text-gray-700 mb-2 ${
                slot.status === "Not Available"
                  ? "text-red-500"
                  : slot.status === "Booked"
                  ? "text-blue-500"
                  : "text-green-500"
              }`}
            >
              {slot.time} - {slot.status}
              {slot.status === "Available" && (
                <button
                  onClick={() => handleBookSlot(index)}
                  className="ml-2 bg-purple-600 text-white py-1 px-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Book
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DoctorDetailsPopup;
