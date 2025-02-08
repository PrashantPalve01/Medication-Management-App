import React, { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebase";

const MedicationHistory = () => {
  const [medicationLogs, setMedicationLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [adherenceData, setAdherenceData] = useState([]);
  const [viewMode, setViewMode] = useState("daily"); // 'daily', 'weekly', 'monthly'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicationLogs();
  }, [selectedDate, viewMode]);

  const fetchMedicationLogs = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const startDate = getStartDate();
      const endDate = getEndDate();

      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      const q = query(
        logsRef,
        where("timestamp", ">=", startDate),
        where("timestamp", "<=", endDate),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });

      setMedicationLogs(logs);
      calculateAdherenceData(logs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medication logs:", error);
      setLoading(false);
    }
  };

  const getStartDate = () => {
    switch (viewMode) {
      case "weekly":
        return startOfWeek(selectedDate);
      case "monthly":
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      default:
        return new Date(selectedDate.setHours(0, 0, 0, 0));
    }
  };

  const getEndDate = () => {
    switch (viewMode) {
      case "weekly":
        return endOfWeek(selectedDate);
      case "monthly":
        return new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0
        );
      default:
        return new Date(selectedDate.setHours(23, 59, 59, 999));
    }
  };

  const calculateAdherenceData = (logs) => {
    const adherenceByDate = {};
    logs.forEach((log) => {
      const date = format(log.timestamp.toDate(), "MMM dd");
      if (!adherenceByDate[date]) {
        adherenceByDate[date] = {
          date,
          taken: 0,
          missed: 0,
          total: 0,
        };
      }

      adherenceByDate[date].total++;
      if (log.status === "taken") {
        adherenceByDate[date].taken++;
      } else {
        adherenceByDate[date].missed++;
      }
    });

    const chartData = Object.values(adherenceByDate).map((data) => ({
      ...data,
      adherenceRate: ((data.taken / data.total) * 100).toFixed(1),
    }));

    setAdherenceData(chartData);
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

  if (loading) {
    return (
      <h1 className="flex justify-center items-center text-2xl">Loading...</h1>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Medication History</h3>
        <div className="flex items-center space-x-4">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="rounded border border-stroke px-2 py-1 dark:border-strokedark"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate(-1)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">
              {format(
                selectedDate,
                viewMode === "monthly" ? "MMMM yyyy" : "MMM dd, yyyy"
              )}
            </span>
            <button
              onClick={() => navigateDate(1)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple Adherence Visualization */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-2">
          {adherenceData.map((data, index) => (
            <div key={data.date} className="flex flex-col items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {data.date}
              </div>
              <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg mt-1 relative">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-lg transition-all duration-300"
                  style={{ height: `${data.adherenceRate}%` }}
                >
                  <div className="text-white text-xs text-center mt-1">
                    {data.adherenceRate}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-medium mb-2">Total Doses</h4>
          <p className="text-2xl font-semibold">{medicationLogs.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-medium mb-2">Doses Taken</h4>
          <p className="text-2xl font-semibold text-success">
            {medicationLogs.filter((log) => log.status === "taken").length}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-medium mb-2">Doses Missed</h4>
          <p className="text-2xl font-semibold text-danger">
            {medicationLogs.filter((log) => log.status === "missed").length}
          </p>
        </div>
      </div>

      {/* Medication Logs */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-2 dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Medication
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Time
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {medicationLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4">
                  <span className="font-medium text-black dark:text-white">
                    {log.medicationName}
                  </span>
                </td>
                <td className="py-5 px-4">
                  {format(log.timestamp.toDate(), "hh:mm a")}
                </td>
                <td className="py-5 px-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium
                    ${
                      log.status === "taken"
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {log.status === "taken" ? "Taken" : "Missed"}
                  </span>
                </td>
                <td className="py-5 px-4">{log.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicationHistory;
