import React, { useState } from "react";
import { Clock, Calendar, PlusCircle, Trash } from "lucide-react";

const MedicationForm = () => {
  const [medications, setMedications] = useState([]);
  const [patientId, setPatientId] = useState(""); // Track selected patient
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    time: "",
    date: "",
    reminderTime: "",
    status: "Pending",
    patientId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMedication.name || !newMedication.time || !patientId) {
      alert("Please select a patient and enter medication details.");
      return;
    }

    try {
      const response = await fetch(
        `https://medicationreports-default-rtdb.firebaseio.com/patients/${patientId}/medications.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMedication),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add medication");
      }

      const data = await response.json();

      alert("Medication added successfully!");

      setMedications((prev) => [...prev, { ...newMedication, id: data.name }]);

      setNewMedication({
        name: "",
        dosage: "",
        time: "",
        date: "",
        reminderTime: "",
        status: "Pending",
        patientId: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add medication");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Medication Schedule</h2>
        </div>

        {/* Patient ID Input */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium">Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter patient ID"
            required
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Medication Name</label>
            <input
              type="text"
              name="name"
              value={newMedication.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter medication name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Dosage Amount</label>
            <input
              type="text"
              name="dosage"
              value={newMedication.dosage}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              placeholder="Enter dosage (e.g., 1 pill, 5ml)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium">Time for Doses</label>
              <input
                type="time"
                name="time"
                value={newMedication.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md pl-10"
                required
              />
              <Clock className="absolute left-3 top-9 h-5 w-5 text-gray-500" />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="date"
                value={newMedication.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md pl-10"
              />
              <Calendar className="absolute left-3 top-9 h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium">Reminder Time</label>
            <input
              type="time"
              name="reminderTime"
              value={newMedication.reminderTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md pl-10"
            />
            <Clock className="absolute left-3 top-9 h-5 w-5 text-gray-500" />
          </div>

          <button
            type="submit"
            className="w-full border-2 border-blue-500 text-black p-2 rounded-md hover:bg-blue-100 flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Medication
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicationForm;
