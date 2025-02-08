import React, { useState, useEffect } from "react";
import { Bell, Check, X, Clock } from "lucide-react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

const MedicationReminder = () => {
  const [reminders, setReminders] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  const formatTo12Hour = (time24h) => {
    try {
      const [hours, minutes] = time24h.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch (error) {
      console.error("Error converting time:", error);
      return time24h;
    }
  };

  const isUpcoming = (timeString) => {
    const now = new Date();
    const [hours, minutes] = timeString.split(":").map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0);
    return reminderTime > now;
  };

  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const generateDefaultTimes = (frequency) => {
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

  const fetchTodaysReminders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const medicationsRef = collection(db, "Users", user.uid, "medications");
      const q = query(medicationsRef, where("status", "==", "active"));
      const querySnapshot = await getDocs(q);

      const allReminders = [];
      querySnapshot.forEach((doc) => {
        const medication = { id: doc.id, ...doc.data() };

        const reminderTimes =
          medication.timingPreferences?.length > 0
            ? medication.timingPreferences
            : generateDefaultTimes(medication.frequency);

        reminderTimes.forEach((time) => {
          const timeString = typeof time === "string" ? time : time.time;
          allReminders.push({
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            time: timeString,
            displayTime: formatTo12Hour(timeString),
            instructions: medication.instructions,
            type: medication.type,
            priority: medication.priority,
            status: "pending",
          });
        });
      });

      // Sort all reminders by time
      const sortedReminders = allReminders.sort((a, b) => {
        return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
      });

      // Split into upcoming and past
      const upcoming = [];
      const past = [];

      sortedReminders.forEach((reminder) => {
        if (isUpcoming(reminder.time)) {
          upcoming.push(reminder);
        } else {
          past.push(reminder);
        }
      });

      setReminders({ upcoming, past });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysReminders();
    // Refresh reminders every minute to update upcoming/past status
    const interval = setInterval(fetchTodaysReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const addMedicationLog = async (reminder, status) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      await addDoc(logsRef, {
        medicationId: reminder.medicationId,
        medicationName: reminder.medicationName,
        dosage: reminder.dosage,
        time: reminder.time,
        displayTime: reminder.displayTime,
        status: status,
        timestamp: new Date(),
        type: reminder.type,
        priority: reminder.priority,
      });
    } catch (error) {
      console.error("Error adding medication log:", error);
    }
  };

  const handleMedicationAction = async (reminder, status) => {
    try {
      const updatedReminders = { ...reminders };
      const lists = ["upcoming", "past"];

      lists.forEach((list) => {
        updatedReminders[list] = reminders[list].map((r) =>
          r.medicationId === reminder.medicationId && r.time === reminder.time
            ? { ...r, status }
            : r
        );
      });

      setReminders(updatedReminders);
      await addMedicationLog(reminder, status);
    } catch (error) {
      console.error(`Error marking medication as ${status}:`, error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "text-primary";
    }
  };

  const ReminderCard = ({ reminder, showActions }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <Bell className={`w-5 h-5 ${getPriorityColor(reminder.priority)}`} />
        <div>
          <h4 className="font-medium">{reminder.medicationName}</h4>
          <p className="text-sm text-gray-500">
            {reminder.dosage} at {reminder.displayTime}
          </p>
          {reminder.instructions && (
            <p className="text-xs text-gray-400 mt-1">
              {reminder.instructions}
            </p>
          )}
        </div>
      </div>

      {showActions && reminder.status === "pending" ? (
        <div className="flex space-x-2">
          <button
            onClick={() => handleMedicationAction(reminder, "taken")}
            className="p-2 bg-success text-white rounded-full hover:bg-opacity-90 transition-colors"
            title="Mark as taken"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMedicationAction(reminder, "skipped")}
            className="p-2 bg-danger text-white rounded-full hover:bg-opacity-90 transition-colors"
            title="Mark as skipped"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          {reminder.status === "taken" && (
            <span className="text-success flex items-center">
              <Check className="w-4 h-4 mr-1" /> Taken
            </span>
          )}
          {reminder.status === "skipped" && (
            <span className="text-danger flex items-center">
              <X className="w-4 h-4 mr-1" /> Skipped
            </span>
          )}
          {reminder.status === "pending" && (
            <span className="text-warning flex items-center">
              <Clock className="w-4 h-4 mr-1" /> Pending
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-xl font-semibold mb-6">
        Today's Medication Schedule
      </h3>

      {/* Upcoming Reminders Section */}
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Upcoming Reminders
        </h4>
        <div className="space-y-4">
          {reminders.upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming reminders for today</p>
          ) : (
            reminders.upcoming.map((reminder, index) => (
              <ReminderCard
                key={`upcoming-${reminder.medicationId}-${reminder.time}-${index}`}
                reminder={reminder}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>

      {/* Past Reminders Section */}
      <div>
        <h4 className="text-lg font-medium mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-gray-500" />
          Past Reminders
        </h4>
        <div className="space-y-4">
          {reminders.past.length === 0 ? (
            <p className="text-gray-500">No past reminders for today</p>
          ) : (
            reminders.past.map((reminder, index) => (
              <ReminderCard
                key={`past-${reminder.medicationId}-${reminder.time}-${index}`}
                reminder={reminder}
                showActions={false}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationReminder;
