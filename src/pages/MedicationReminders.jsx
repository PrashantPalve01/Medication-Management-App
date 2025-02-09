import React, { useState, useEffect } from "react";
import { Bell, Check, X, Clock, Clock4, AlertTriangle } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";

const CustomAlert = ({ children }) => (
  <div className="flex items-center p-4 mb-4 bg-red-100 border border-red-400 rounded-lg">
    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
    <div className="text-red-700">{children}</div>
  </div>
);

const MedicationReminder = () => {
  const [reminders, setReminders] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [activeReminder, setActiveReminder] = useState(null);
  const [selectedSnoozeTime, setSelectedSnoozeTime] = useState("15");
  const [missedReminders, setMissedReminders] = useState([]);

  // Check for missed medications every minute
  useEffect(() => {
    const checkMissedMedications = () => {
      const now = new Date();
      const currentTime = now.getTime();

      const newUpcoming = [...reminders.upcoming];
      const newPast = [...reminders.past];
      const newMissed = [];

      // Use filter instead of forEach to properly handle array modifications
      const remainingUpcoming = newUpcoming.filter((reminder) => {
        const reminderTime = reminder.reminderTime.getTime();
        // If the reminder is more than 30 minutes past due
        if (currentTime > reminderTime + 30 * 60000) {
          // Update status to missed
          const missedReminder = {
            ...reminder,
            status: "missed",
          };
          // Add to past and missed
          newPast.unshift(missedReminder);
          newMissed.push(missedReminder);
          return false; // Remove from upcoming
        }
        return true; // Keep in upcoming
      });

      // Update states if there are changes
      if (newMissed.length > 0) {
        setReminders({
          upcoming: remainingUpcoming,
          past: newPast,
        });
        setMissedReminders((prev) => [...prev, ...newMissed]);

        // Process notifications and updates
        handleMissedMedications(newMissed);
      }
    };

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Initial check
    checkMissedMedications();

    const interval = setInterval(checkMissedMedications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  // Render missed medication alerts
  const MissedMedicationAlert = () => {
    if (missedReminders.length === 0) return null;

    return (
      <CustomAlert>
        <div>
          You missed {missedReminders.length} medication
          {missedReminders.length > 1 ? "s" : ""}:
          {missedReminders.map((reminder, index) => (
            <div key={index} className="ml-2 mt-1">
              • {reminder.medicationName} at {reminder.displayTime}
            </div>
          ))}
        </div>
      </CustomAlert>
    );
  };

  const snoozeOptions = [
    { value: "5", label: "5 minutes" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
  ];

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

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

  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleMissedMedications = async (missedMeds) => {
    // Show notification for missed medications
    if (Notification.permission === "granted") {
      missedMeds.forEach((reminder) => {
        new Notification("Missed Medication Alert", {
          body: `You missed your ${reminder.medicationName} dose at ${reminder.displayTime}`,
          icon: "/medication-icon.png",
        });
      });
    }

    // Update missed status in Firestore
    missedMeds.forEach(async (reminder) => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Log the missed medication
        const logData = {
          medicationId: reminder.medicationId,
          medicationName: reminder.medicationName,
          time: reminder.time,
          status: "missed",
          timestamp: serverTimestamp(),
          userId: user.uid,
        };

        await addDoc(
          collection(db, "Users", user.uid, "medicationLogs"),
          logData
        );

        // Update medication stats
        const medicationRef = doc(
          db,
          "Users",
          user.uid,
          "medications",
          reminder.medicationId
        );

        await updateDoc(medicationRef, {
          missedCount: increment(1),
          lastAction: {
            status: "missed",
            timestamp: serverTimestamp(),
          },
        });

        toast.error(
          `Missed medication: ${reminder.medicationName} at ${reminder.displayTime}`
        );
      } catch (error) {
        console.error("Error updating missed medication:", error);
      }
    });
  };

  const handleSnooze = async (reminder, minutes) => {
    const loadingToastId = toast.loading("Snoozing reminder...");

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in to continue", { id: loadingToastId });
        return;
      }

      const snoozeTime = new Date(new Date().getTime() + minutes * 60000);
      const newTimeString = `${snoozeTime
        .getHours()
        .toString()
        .padStart(2, "0")}:${snoozeTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      const updatedReminder = {
        ...reminder,
        originalTime: reminder.time,
        time: newTimeString,
        displayTime: formatTo12Hour(newTimeString),
        snoozed: true,
      };

      // Update in Firestore
      const reminderRef = doc(
        db,
        "Users",
        user.uid,
        "medications",
        reminder.medicationId
      );
      await updateDoc(reminderRef, {
        snoozedTime: snoozeTime,
        originalTime: reminder.time,
      });

      // Update local state
      const updatedUpcoming = reminders.upcoming.map((r) =>
        r.medicationId === reminder.medicationId ? updatedReminder : r
      );
      setReminders({ ...reminders, upcoming: updatedUpcoming });
      setIsSnoozeModalOpen(false);

      toast.success(`Reminder snoozed for ${minutes} minutes`, {
        id: loadingToastId,
      });
    } catch (error) {
      console.error("Error snoozing reminder:", error);
      toast.error("Failed to snooze reminder. Please try again.", {
        id: loadingToastId,
      });
    }
  };

  // Your existing fetchTodaysReminders function
  const fetchTodaysReminders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch medication logs for today
      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      const logsSnapshot = await getDocs(
        query(logsRef, where("timestamp", ">=", today))
      );
      const todaysLogs = {};
      logsSnapshot.forEach((doc) => {
        const log = doc.data();
        const key = `${log.medicationId}-${log.time}`;
        todaysLogs[key] = log.status;
      });

      const medicationsRef = collection(db, "Users", user.uid, "medications");
      const q = query(medicationsRef, where("status", "==", "active"));
      const querySnapshot = await getDocs(q);

      const now = new Date();
      const allReminders = [];
      querySnapshot.forEach((doc) => {
        const medication = { id: doc.id, ...doc.data() };

        const reminderTimes =
          medication.timingPreferences?.length > 0
            ? medication.timingPreferences
            : generateDefaultTimes(medication.frequency);

        reminderTimes.forEach((time) => {
          const timeString = typeof time === "string" ? time : time.time;
          const reminderKey = `${medication.id}-${timeString}`;

          let status = todaysLogs[reminderKey];
          if (!status) {
            const [hours, minutes] = timeString.split(":").map(Number);
            const reminderTime = new Date();
            reminderTime.setHours(hours, minutes, 0);

            if (reminderTime < new Date(now.getTime() - 30 * 60000)) {
              status = "missed";
            } else {
              status = "pending";
            }
          }

          allReminders.push({
            medicationId: medication.id,
            medicationName: medication.name,
            dosage: medication.dosage,
            time: timeString,
            displayTime: formatTo12Hour(timeString),
            instructions: medication.instructions,
            type: medication.type,
            priority: medication.priority,
            status: status,
            snoozed: medication.snoozedTime ? true : false,
            reminderTime: new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              ...timeString.split(":").map(Number)
            ),
          });
        });
      });

      // Sort and split reminders
      const sortedReminders = allReminders.sort((a, b) => {
        return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
      });

      const upcoming = [];
      const past = [];

      sortedReminders.forEach((reminder) => {
        const now = new Date();
        if (reminder.reminderTime > now && reminder.status === "pending") {
          upcoming.push(reminder);
        } else {
          if (reminder.status === "pending" && reminder.reminderTime < now) {
            reminder.status = "missed";
          }
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
    const interval = setInterval(fetchTodaysReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  // Your existing helper functions
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

  const getStatusColor = (status) => {
    switch (status) {
      case "taken":
        return "text-success";
      case "skipped":
      case "missed":
        return "text-danger";
      default:
        return "text-warning";
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
            {reminder.snoozed && " (Snoozed)"}
          </p>
          {reminder.instructions && (
            <p className="text-xs text-gray-400 mt-1">
              {reminder.instructions}
            </p>
          )}
        </div>
      </div>

      {showActions && reminder.status === "pending" && (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setActiveReminder(reminder);
              setIsSnoozeModalOpen(true);
            }}
            className="p-2 border rounded-md hover:bg-gray-50 flex items-center"
          >
            <Clock4 className="w-4 h-4" />
          </button>
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
      )}

      {!showActions && (
        <div className="flex items-center">
          <span
            className={`flex items-center ${getStatusColor(reminder.status)}`}
          >
            {reminder.status === "taken" && <Check className="w-4 h-4 mr-1" />}
            {reminder.status === "skipped" && <X className="w-4 h-4 mr-1" />}
            {reminder.status === "missed" && <Clock className="w-4 h-4 mr-1" />}
            {reminder.status === "pending" && (
              <Clock className="w-4 h-4 mr-1" />
            )}
            {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-xl font-semibold mb-6">
        Today's Medication Schedule
      </h3>

      {/* Snooze Modal */}
      <MissedMedicationAlert />

      <Modal
        isOpen={isSnoozeModalOpen}
        onClose={() => setIsSnoozeModalOpen(false)}
        title="Snooze Reminder"
      >
        <div className="space-y-4">
          {snoozeOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                value={option.value}
                checked={selectedSnoozeTime === option.value}
                onChange={(e) => setSelectedSnoozeTime(e.target.value)}
                className="w-4 h-4 text-blue-500"
              />
              <span>{option.label}</span>
            </label>
          ))}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setIsSnoozeModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (activeReminder) {
                  handleSnooze(activeReminder, parseInt(selectedSnoozeTime));
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

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
