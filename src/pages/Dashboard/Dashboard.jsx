import React, { useState } from "react";

const PatientTracker = () => {
  const [patientData, setPatientData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    if (!patientData.phone) {
      alert("Phone number is required!");
      return;
    }
  
    // Generate unique patient ID (e.g., Patient2024-12345)
    const uniqueId = `Patient${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  
    try {
      const response = await fetch(
        `https://medicationreports-default-rtdb.firebaseio.com/patients/${uniqueId}.json`,
        {
          method: "PUT", // Ensure patient data is stored under a unique ID
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...patientData, id: uniqueId }), // Store patient ID in the record
        }
      );
  
      if (!response.ok) throw new Error("Failed to save data");
  
      alert(`Patient information saved successfully! ID: ${uniqueId}`);
    } catch (error) {
      alert("Error saving data: " + error.message);
    }
  };
  
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Patient Tracker</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={patientData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={patientData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            value={patientData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={patientData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={patientData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            name="address"
            value={patientData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={saveData}
          className="w-full border-2 border-blue-500 text-black p-2 rounded mt-4 hover:bg-blue-100"
        >
          Save Patient Information
        </button>
      </div>
    </div>
  );
};

export default PatientTracker;
