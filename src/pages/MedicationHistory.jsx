import React, { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
      <div className="flex justify-center items-center h-24">Loading...</div>
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

      {/* Adherence Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={adherenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="adherenceRate"
              stroke="#3b82f6"
              name="Adherence Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
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
