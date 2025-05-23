import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isToday,
  isWithinInterval,
  isBefore,
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const MedicationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchMedicationSchedule();
    fetchMedicationHistory();
  }, [selectedDate]);

  // Fetch medication history
  const fetchMedicationHistory = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get the start and end of the current month view
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      const q = query(
        logsRef,
        where("timestamp", ">=", Timestamp.fromDate(start)),
        where("timestamp", "<=", Timestamp.fromDate(end))
      );

      const querySnapshot = await getDocs(q);
      const history = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Create a key using the same format as we check in getEventStatus
        const dateStr = format(data.timestamp.toDate(), "yyyy-MM-dd");
        const key = `${data.medicationId}-${dateStr}-${data.time}`;
        history[key] = data.status; // This will contain 'taken', 'skipped', or 'missed'
      });

      setMedicationHistory(history);
    } catch (error) {
      console.error("Error fetching medication history:", error);
    }
  };

  const fetchMedicationSchedule = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const medsRef = collection(db, "Users", user.uid, "medications");
      const medsQuery = query(medsRef, where("status", "==", "active"));
      const medsSnapshot = await getDocs(medsQuery);

      let allEvents = [];

      medsSnapshot.forEach((doc) => {
        const medData = doc.data();
        if (
          medData.timingPreferences &&
          Array.isArray(medData.timingPreferences)
        ) {
          const startDate = parseISO(medData.startDate);
          const endDate = medData.endDate ? parseISO(medData.endDate) : null;

          medData.timingPreferences.forEach((time) => {
            const [hours, minutes] = time.split(":");
            const days = eachDayOfInterval({ start, end });

            days.forEach((day) => {
              // Only create events within the medication's date range
              if (
                isWithinInterval(day, {
                  start: startDate,
                  end: endDate || new Date(2099, 11, 31), // Far future date if no end date
                })
              ) {
                allEvents.push({
                  id: `${doc.id}-${format(day, "yyyy-MM-dd")}-${time}`,
                  medicationId: doc.id,
                  medicationName: medData.name,
                  dosage: medData.dosage,
                  time: time,
                  date: day,
                  type: "medication",
                  instructions: medData.instructions,
                });
              }
            });
          });
        }
      });

      setEvents(allEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medication schedule:", error);
      setLoading(false);
    }
  };

  const getEventStatus = (event) => {
    const eventKey = `${event.medicationId}-${format(
      event.date,
      "yyyy-MM-dd"
    )}-${event.time}`;
    const eventDateTime = parseISO(
      `${format(event.date, "yyyy-MM-dd")}T${event.time}`
    );
    const now = new Date();

    // Check if we have a recorded status in medicationLogs
    const status = medicationHistory[eventKey];

    if (status) {
      return status; // Will return 'taken', 'skipped', or 'missed'
    }

    // Only mark as missed if it's in the past and has no status
    if (isBefore(eventDateTime, now)) {
      return "missed";
    }

    // Future events
    return "upcoming";
  };

  // Update getEventClassName to match the history page styling
  const getEventClassName = (event) => {
    const status = getEventStatus(event);
    switch (status) {
      case "taken":
        return "bg-success/10 text-success hover:bg-success/20";
      case "skipped":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "missed":
        return "bg-danger/10 text-danger hover:bg-danger/20";
      default: // upcoming
        return "bg-primary/10 text-primary hover:bg-primary/20";
    }
  };

  const navigateMonth = (direction) => {
    setSelectedDate(
      direction > 0 ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1)
    );
  };

  const EventModal = ({ event, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{event.medicationName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          <p className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {format(
              parseISO(`${format(event.date, "yyyy-MM-dd")}T${event.time}`),
              "h:mm a"
            )}
          </p>
          <p className="text-sm">
            <strong>Status:</strong> {getEventStatus(event)}
          </p>
          <p className="text-sm">
            <strong>Dosage:</strong> {event.dosage}
          </p>
          {event.instructions && (
            <p className="text-sm">
              <strong>Instructions:</strong> {event.instructions}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Medication Calendar</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium min-w-[140px] text-center">
            {format(selectedDate, "MMMM yyyy")}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}

        {eachDayOfInterval({
          start: startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 }),
          end: endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 }),
        }).map((day) => {
          const dayEvents = events.filter((event) =>
            isSameDay(event.date, day)
          );
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 rounded-lg border ${
                isToday(day) ? "border-primary" : "border-stroke"
              } ${!isCurrentMonth ? "opacity-50" : ""}`}
            >
              <div className="text-right mb-2">
                <span
                  className={`text-sm ${
                    isToday(day) ? "text-primary font-medium" : "text-gray-600"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventModal(true);
                    }}
                    className={`w-full text-left text-xs p-1.5 rounded transition-colors ${getEventClassName(
                      event
                    )}`}
                  >
                    {format(
                      parseISO(`${format(day, "yyyy-MM-dd")}T${event.time}`),
                      "h:mm a"
                    )}{" "}
                    - {event.medicationName}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default MedicationCalendar;
