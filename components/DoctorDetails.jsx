import { useLocation, useNavigate } from "react-router-dom";

const DoctorDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state;

  if (!doctor) {
    return <p>No doctor details available.</p>;
  }

  const availability = [
    { time: "10:00 AM", status: "Available" },
    { time: "11:00 AM", status: "Not Available" },
    { time: "12:00 PM", status: "Available" },
  ];

  const handleBookNow = (time) => {
    alert(`Booked appointment at ${time} with ${doctor.name}`);
  };

  return (
    <div className="p-6 bg-purple-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-purple-600 underline hover:text-purple-800"
      >
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <img
            src={doctor.imageUri}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-purple-600">{doctor.specialisation}</p>
            <p className="text-gray-600">Experience: {doctor.experience}</p>
            <p className="text-gray-500">{doctor.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-2 px-4">Time</th>
              <th className="py-2 px-4">Availability</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {availability.map((slot, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{slot.time}</td>
                <td
                  className={`py-2 px-4 ${
                    slot.status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {slot.status}
                </td>
                <td className="py-2 px-4">
                  {slot.status === "Available" && (
                    <button
                      onClick={() => handleBookNow(slot.time)}
                      className="bg-purple-600 text-white py-1 px-3 rounded-md hover:bg-purple-700 transition"
                    >
                      Book Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDetails;
