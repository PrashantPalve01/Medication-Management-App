import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, RefreshCw } from "lucide-react";

const MedicationTracker = () => {
  const [medications, setMedications] = useState([]);
  const [takenMedications, setTakenMedications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch(
          "https://medicationreports-default-rtdb.firebaseio.com/patients/medications.json"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging

        if (data) {
          const medList = Object.entries(data).map(([id, med]) => ({
            id,
            ...med,
            status: med.status || "Upcoming",
            dosage: med.dosage || "Not Specified",
            frequency: med.frequency || "Once Daily",
            refillNeeded: med.refillNeeded ?? false,
          }));

          setMedications(medList);
          setTakenMedications(medList.filter((med) => med.status === "Completed").length);
        } else {
          setMedications([]); // If data is null, set an empty array
        }
      } catch (err) {
        console.error("Error fetching medications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const handleTakeMedication = async (id) => {
    try {
      await fetch(
        `https://medicationreports-default-rtdb.firebaseio.com/patients/medications/${id}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" }),
        }
      );

      setMedications((prevMeds) =>
        prevMeds.map((med) => (med.id === id ? { ...med, status: "Completed" } : med))
      );

      setTakenMedications((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating medication status:", error);
      alert("Failed to mark as taken.");
    }
  };

  const remainingDoses = medications.filter((med) => med.status !== "Completed").length;
  const refillsDue = medications.filter((med) => med.refillNeeded).length;

  if (loading) return <p className="text-center text-gray-600">Loading medications...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-3 gap-6">
        
        {/* Medications List */}
        <div className="col-span-2">
          <h3 className="text-xl font-semibold mb-4">Current Medications</h3>
          {medications.length > 0 ? (
            medications.map((med) => (
              <div key={med.id} className="bg-white shadow rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-medium">{med.name}</h4>
                    <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                    <p className="text-sm text-gray-600 mt-1">Next dose: {med.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      med.status === "Completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {med.status === "Completed" ? "Taken" : "Upcoming"}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleTakeMedication(med.id)}
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-800"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Take Now</span>
                  </button>
                  {med.status !== "Completed" && (
                    <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Snooze</span>
                    </button>
                  )}
                  {med.status === "Completed" && (
                    <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center space-x-2">
                      <RefreshCw className="w-5 h-5" />
                      <span>Request Renewal</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No medications found.</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Upcoming Reminders */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Upcoming Reminders</h3>
            {medications.length > 0 ? (
              medications
                .filter((med) => med.status !== "Completed")
                .map((med) => (
                  <div key={med.id} className="flex items-center justify-between py-2 border-b last:border-none">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          med.status === "Upcoming" ? "bg-red-500" : "bg-blue-400"
                        }`}
                      ></span>
                      <p className="text-gray-700">{med.name}</p>
                    </div>
                    <p className="text-gray-600 text-sm">{med.time}</p>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center">No upcoming reminders.</p>
            )}
          </div>

          {/* Status Summary */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Status Summary</h3>
            <p className="text-sm text-gray-600 mb-1">Today's Compliance</p>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-black h-3 rounded-full transition-all duration-300"
                style={{
                  width: medications.length > 0 ? `${Math.round((takenMedications / medications.length) * 100)}%` : "0%",
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mt-2">
              <p>Remaining Doses: <strong>{remainingDoses}</strong></p>
              <p className="text-red-500">Refills Due: <strong>{refillsDue}</strong></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MedicationTracker;
