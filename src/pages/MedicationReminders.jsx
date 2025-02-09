import React, { useState, useEffect } from "react";
import { Bell, Check, X, Clock, AlarmClock } from "lucide-react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { toast } from "react-hot-toast"; // Add this import

const SnoozeModal = ({ isOpen, onClose, onSnooze }) => {
  const [snoozeTime, setSnoozeTime] = useState("5");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSnooze(parseInt(snoozeTime));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-medium">Snooze Reminder</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block">Snooze for:</label>
            <select
              value={snoozeTime}
              onChange={(e) => setSnoozeTime(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white"
            >
              Snooze
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MedicationReminder = () => {
  const [reminders, setReminders] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [snoozedReminders, setSnoozedReminders] = useState({});

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

  const logMissedMedication = async (reminder) => {
    const user = auth.currentUser;
    if (!user) return;

    const logsRef = collection(db, "Users", user.uid, "medicationLogs");
    try {
      await addDoc(logsRef, {
        medicationId: reminder.medicationId,
        medicationName: reminder.medicationName,
        dosage: reminder.dosage,
        time: reminder.time,
        displayTime: reminder.displayTime,
        status: "missed",
        timestamp: new Date(),
        type: reminder.type,
        priority: reminder.priority,
        instructions: reminder.instructions,
      });
    } catch (error) {
      console.error("Error logging missed medication:", error);
    }
  };

  useEffect(() => {
    fetchTodaysReminders();
    const interval = setInterval(fetchTodaysReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodaysReminders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch medications
      const medicationsRef = collection(db, "Users", user.uid, "medications");
      const medicationsQuery = query(
        medicationsRef,
        where("status", "==", "active")
      );
      const medicationsSnapshot = await getDocs(medicationsQuery);

      // Fetch today's medication logs
      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      const logsQuery = query(logsRef, where("timestamp", ">=", today));
      const logsSnapshot = await getDocs(logsQuery);

      // Create a map of completed medications
      const completedMeds = {};
      logsSnapshot.forEach((doc) => {
        const log = doc.data();
        const key = `${log.medicationId}-${log.time}`;
        completedMeds[key] = log.status;
      });

      const allReminders = [];
      medicationsSnapshot.forEach((doc) => {
        const medication = { id: doc.id, ...doc.data() };
        const reminderTimes =
          medication.timingPreferences?.length > 0
            ? medication.timingPreferences
            : generateDefaultTimes(medication.frequency);

        reminderTimes.forEach((time) => {
          const timeString = typeof time === "string" ? time : time.time;
          const key = `${medication.id}-${timeString}`;
          const status = completedMeds[key] || "pending";

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
          });
        });
      });

      const upcoming = [];
      const past = [];

      allReminders.forEach((reminder) => {
        const key = `${reminder.medicationId}-${reminder.time}`;
        const existingStatus = completedMeds[key];

        if (isUpcoming(reminder.time)) {
          if (!existingStatus) {
            upcoming.push({ ...reminder, status: "pending" });
          }
        } else {
          if (existingStatus) {
            past.push({ ...reminder, status: existingStatus });
          } else {
            past.push({ ...reminder, status: "missed" });
            // Log missed status without using handleMedicationAction
            logMissedMedication(reminder);
          }
        }
      });

      // Sort past reminders by time (most recent first)
      past.sort(
        (a, b) => convertTimeToMinutes(b.time) - convertTimeToMinutes(a.time)
      );

      setReminders({ upcoming, past });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      setLoading(false);
    }
  };

  const handleMedicationAction = async (reminder, status, silent = false) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        if (!silent) toast.error("Please sign in to update medication status");
        return;
      }

      // Add to medication logs
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
        instructions: reminder.instructions,
      });

      // Update UI
      setReminders((prev) => {
        const updatedReminders = {
          upcoming: prev.upcoming.filter(
            (r) =>
              !(
                r.medicationId === reminder.medicationId &&
                r.time === reminder.time
              )
          ),
          past: [
            { ...reminder, status },
            ...prev.past.filter(
              (r) =>
                !(
                  r.medicationId === reminder.medicationId &&
                  r.time === reminder.time
                )
            ),
          ].sort(
            (a, b) =>
              convertTimeToMinutes(b.time) - convertTimeToMinutes(a.time)
          ),
        };
        return updatedReminders;
      });

      // Show toast notification if not silent
      if (!silent) {
        switch (status) {
          case "taken":
            toast.success(`${reminder.medicationName} marked as taken`);
            break;
          case "skipped":
            toast.error(`${reminder.medicationName} marked as skipped`);
            break;
          case "missed":
            toast.error(`${reminder.medicationName} was missed`);
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error(`Error marking medication as ${status}:`, error);
      if (!silent) {
        toast.error(`Failed to update ${reminder.medicationName} status`);
      }
    }
  };

  const handleSnooze = (reminder) => {
    setSelectedReminder(reminder);
    setShowSnoozeModal(true);
  };

  const handleSnoozeConfirm = (minutes) => {
    const snoozeUntil = new Date();
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes);

    setSnoozedReminders({
      ...snoozedReminders,
      [selectedReminder.medicationId + selectedReminder.time]: {
        reminder: selectedReminder,
        snoozeUntil: snoozeUntil,
      },
    });

    toast.success(
      `${selectedReminder.medicationName} snoozed for ${minutes} minutes`
    );
  };

  useEffect(() => {
    const checkExpiredSnoozes = () => {
      const now = new Date();
      const updatedSnoozes = { ...snoozedReminders };
      let changed = false;

      Object.entries(updatedSnoozes).forEach(
        ([key, { reminder, snoozeUntil }]) => {
          if (snoozeUntil <= now) {
            delete updatedSnoozes[key];
            handleMedicationAction(reminder, "missed");
            changed = true;
          }
        }
      );

      if (changed) {
        setSnoozedReminders(updatedSnoozes);
      }
    };

    const interval = setInterval(checkExpiredSnoozes, 60000);
    return () => clearInterval(interval);
  }, [snoozedReminders]);

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

  const ReminderCard = ({ reminder, showActions }) => {
    const isSnoozed = snoozedReminders[reminder.medicationId + reminder.time];

    return (
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
            {isSnoozed && (
              <p className="text-xs text-warning mt-1">
                <AlarmClock className="w-4 h-4 inline mr-1" />
                Snoozed until {isSnoozed.snoozeUntil.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {showActions && reminder.status === "pending" && !isSnoozed ? (
          <div className="flex space-x-2">
            <button
              onClick={() => handleMedicationAction(reminder, "taken")}
              className="p-2 bg-success text-white rounded-full hover:bg-opacity-90 transition-colors"
              title="Mark as taken"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSnooze(reminder)}
              className="p-2 bg-warning text-white rounded-full hover:bg-opacity-90 transition-colors"
              title="Snooze"
            >
              <AlarmClock className="w-4 h-4" />
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
            {reminder.status === "missed" && (
              <span className="text-danger flex items-center">
                <Clock className="w-4 h-4 mr-1" /> Missed
              </span>
            )}
            {reminder.status === "pending" && !isSnoozed && (
              <span className="text-warning flex items-center">
                <Clock className="w-4 h-4 mr-1" /> Pending
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

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

      <SnoozeModal
        isOpen={showSnoozeModal}
        onClose={() => setShowSnoozeModal(false)}
        onSnooze={handleSnoozeConfirm}
      />
    </div>
  );
};

export default MedicationReminder;
