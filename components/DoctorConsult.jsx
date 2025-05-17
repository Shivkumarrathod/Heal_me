'use client'
import React, { useState } from "react";
import DoctorCard from './DoctorDetails';

const DoctorConsult = () => {
  const allDoctors = [
    {
      imageUri: "https://via.placeholder.com/150",
      name: "Dr. Shiv Kumar",
      specialisation: "Cardiologist",
      experience: "10 years",
      address: "123, Health Street, Bangalore",
    },
    {
      imageUri: "https://via.placeholder.com/150",
      name: "Dr. Priya Sharma",
      specialisation: "Dermatologist",
      experience: "8 years",
      address: "456, Skin Avenue, Mumbai",
    },
    {
      imageUri: "https://via.placeholder.com/150",
      name: "Dr. Raj Mehra",
      specialisation: "Orthopedic",
      experience: "12 years",
      address: "789, Bone Road, Delhi",
    },
    {
      imageUri: "https://via.placeholder.com/150",
      name: "Dr. Sneha Verma",
      specialisation: "Cardiologist",
      experience: "9 years",
      address: "101, Heart Lane, Chennai",
    },
  ];

  const [filter, setFilter] = useState("All");

  const filteredDoctors =
    filter === "All" ? allDoctors : allDoctors.filter((doc) => doc.specialisation === filter);

  const specialisations = ["All", ...new Set(allDoctors.map((doc) => doc.specialisation))];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">Find Doctors</h2>

      <div className="flex space-x-4">
        {specialisations.map((spec) => (
          <button
            key={spec}
            onClick={() => setFilter(spec)}
            className={`px-4 py-2 rounded-full  ${
              filter === spec ? "bg-purple-600 text-white" : "bg-white text-purple-600"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <DoctorCard key={index} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorConsult;
