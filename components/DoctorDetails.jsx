import React from "react";

function DoctorCard({ doctor }) {
  // Avatar always generated from doctor.name for consistency, ignoring any imageUri
  const avatarUrl = `https://i.pravatar.cc/${doctor.name}`;

  return (
    <div className="bg-white shadow rounded-xl py-4 flex flex-col items-center space-y-3">
      <img
        src={avatarUrl}
        alt={doctor.name}
        className="w-24 h-24 rounded-full object-cover"
      />
      <h3 className="font-semibold">{doctor.name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialisation}</p>
      <p className="text-xs text-gray-500">{doctor.experience} Experience</p>
      <p className="text-xs text-gray-500">{doctor.address}</p>
      <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorCard;
