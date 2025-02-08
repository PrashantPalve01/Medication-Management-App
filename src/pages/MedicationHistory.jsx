import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addDays,
  subDays,
  parseISO,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const MedicationHistory = () => {
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    taken: 0,
    missed: 0,
    skipped: 0,
  });

  useEffect(() => {
    fetchMedicationLogs();
  }, [selectedDate, viewMode]);

  const getDateRange = () => {
    switch (viewMode) {
      case "weekly":
        return {
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
        };
      case "monthly":
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
        };
      default:
        const start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }
  };

  const fetchMedicationLogs = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const { start, end } = getDateRange();

      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      const q = query(
        logsRef,
        where("timestamp", ">=", Timestamp.fromDate(start)),
        where("timestamp", "<=", Timestamp.fromDate(end))
      );

      const querySnapshot = await getDocs(q);
      const logs = [];
      let taken = 0,
        missed = 0,
        skipped = 0;

      querySnapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        };
        logs.push(data);

        if (data.status === "taken") taken++;
        else if (data.status === "missed") missed++;
        else if (data.status === "skipped") skipped++;
      });

      setMedicationLogs(logs);
      setSummaryStats({
        total: logs.length,
        taken,
        missed,
        skipped,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medication logs:", error);
      setLoading(false);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    switch (viewMode) {
      case "weekly":
        newDate.setDate(newDate.getDate() + direction * 7);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      default:
        newDate.setDate(newDate.getDate() + direction);
    }
    setSelectedDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "taken":
        return "bg-success/10 text-success border-success/20";
      case "skipped":
        return "bg-warning/10 text-warning border-warning/20";
      case "missed":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const renderDateGrid = () => {
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    const groupedLogs = medicationLogs.reduce((acc, log) => {
      const dateKey = format(log.timestamp, "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    }, {});

    if (viewMode === "daily") {
      return (
        <div className="space-y-4">
          {groupedLogs[format(selectedDate, "yyyy-MM-dd")]?.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayLogs = groupedLogs[dateKey] || [];
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={dateKey}
              className={`min-h-[120px] p-2 rounded-lg border ${
                isToday ? "border-primary" : "border-stroke"
              }`}
            >
              <div className="text-right mb-2">
                <span
                  className={`text-sm ${
                    isToday ? "text-primary font-medium" : "text-gray-600"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="space-y-1">
                {dayLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`text-xs p-1 rounded ${getStatusColor(
                      log.status
                    )}`}
                  >
                    {format(log.timestamp, "HH:mm")} - {log.medicationName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const LogCard = ({ log }) => (
    <div className="rounded-lg border border-stroke p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-black dark:text-white">
            {log.medicationName}
          </h4>
          <p className="text-sm text-gray-500">
            {format(log.timestamp, "hh:mm a")}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
            log.status
          )}`}
        >
          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
        </span>
      </div>
      {log.notes && <p className="text-sm text-gray-500 mt-2">{log.notes}</p>}
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
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold">Medication History</h3>
        <div className="flex items-center space-x-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="rounded border border-stroke px-3 py-1.5 dark:border-strokedark focus:border-primary focus:ring-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate(-1)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium min-w-[150px] text-center">
              {viewMode === "monthly"
                ? format(selectedDate, "MMMM yyyy")
                : viewMode === "weekly"
                ? `Week of ${format(getDateRange().start, "MMM d")}`
                : format(selectedDate, "MMM d, yyyy")}
            </span>
            <button
              onClick={() => navigateDate(1)}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-sm text-gray-500">Total Doses</div>
          <div className="text-2xl font-semibold">{summaryStats.total}</div>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="text-sm text-success">Taken</div>
          <div className="text-2xl font-semibold text-success">
            {summaryStats.taken}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-warning/10">
          <div className="text-sm text-warning">Skipped</div>
          <div className="text-2xl font-semibold text-warning">
            {summaryStats.skipped}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-danger/10">
          <div className="text-sm text-danger">Missed</div>
          <div className="text-2xl font-semibold text-danger">
            {summaryStats.missed}
          </div>
        </div>
      </div>

      {/* Date Grid */}
      <div className="overflow-x-auto">{renderDateGrid()}</div>
    </div>
  );
};

export default MedicationHistory;
