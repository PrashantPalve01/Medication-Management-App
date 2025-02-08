import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Bell, Check, X } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const MedicationReminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysReminders();
  }, []);

  const fetchTodaysReminders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const medicationsRef = collection(db, "Users", user.uid, "medications");
      const q = query(medicationsRef, where("status", "==", "active"));
      const querySnapshot = await getDocs(q);

      const todayReminders = [];
      querySnapshot.forEach((doc) => {
        const medication = { id: doc.id, ...doc.data() };
        // Create reminders based on frequency
        const reminderTimes = generateReminderTimes(medication.frequency);
        reminderTimes.forEach((time) => {
          todayReminders.push({
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            time,
            status: "pending",
          });
        });
      });

      setReminders(todayReminders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setLoading(false);
    }
  };

  const generateReminderTimes = (frequency) => {
    switch (frequency) {
      case "once":
        return ["09:00"];
      case "twice":
        return ["09:00", "21:00"];
      case "thrice":
        return ["09:00", "14:00", "21:00"];
      default:
        return ["09:00"];
    }
  };

  const handleMedicationTaken = async (reminder) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Update reminder status
      const updatedReminders = reminders.map((r) =>
        r.medicationId === reminder.medicationId && r.time === reminder.time
          ? { ...r, status: "taken" }
          : r
      );
      setReminders(updatedReminders);

      // Log the medication taken in Firestore
      // You'll need to create a new collection for medication logs
      await addMedicationLog(reminder, "taken");
    } catch (error) {
      console.error("Error marking medication as taken:", error);
    }
  };

  const handleMedicationSkipped = async (reminder) => {
    try {
      const updatedReminders = reminders.map((r) =>
        r.medicationId === reminder.medicationId && r.time === reminder.time
          ? { ...r, status: "skipped" }
          : r
      );
      setReminders(updatedReminders);
      await addMedicationLog(reminder, "skipped");
    } catch (error) {
      console.error("Error marking medication as skipped:", error);
    }
  };

  if (loading) {
    return (
      <h1 className="flex justify-center items-center text-2xl">Loading...</h1>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-xl font-semibold mb-4">
        Today's Medication Schedule
      </h3>
      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <div
            key={`${reminder.medicationId}-${reminder.time}-${index}`}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-medium">{reminder.medicationName}</h4>
                <p className="text-sm text-gray-500">
                  {reminder.dosage} at {reminder.time}
                </p>
              </div>
            </div>

            {reminder.status === "pending" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMedicationTaken(reminder)}
                  className="p-2 bg-success text-white rounded-full hover:bg-opacity-90"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMedicationSkipped(reminder)}
                  className="p-2 bg-danger text-white rounded-full hover:bg-opacity-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {reminder.status === "taken" && (
              <span className="text-success">✓ Taken</span>
            )}

            {reminder.status === "skipped" && (
              <span className="text-danger">⨉ Skipped</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationReminder;
