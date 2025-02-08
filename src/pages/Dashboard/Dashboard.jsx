import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  Bell,
  Calendar,
  PieChart,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import AddMedicationModal from "../../components/AddMedicationModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [medications, setMedications] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [adherenceRate, setAdherenceRate] = useState(0);
  const [renewalNeeded, setRenewalNeeded] = useState([]);
  const [missedDoses, setMissedDoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch medications
        const medicationsRef = collection(db, "Users", user.uid, "medications");
        const medicationsQuery = query(
          medicationsRef,
          where("status", "==", "active")
        );
        const medicationsSnapshot = await getDocs(medicationsQuery);
        const medicationsList = [];
        const upcomingList = [];
        const renewalList = [];
        const missedList = [];

        const now = new Date();
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        medicationsSnapshot.forEach((doc) => {
          const medData = { id: doc.id, ...doc.data() };
          medicationsList.push(medData);

          // Process timing preferences for reminders
          if (
            medData.timingPreferences &&
            Array.isArray(medData.timingPreferences)
          ) {
            medData.timingPreferences.forEach((timeStr) => {
              const [hours, minutes] = timeStr.split(":");
              const reminderTime = new Date(now);
              reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

              // Only add to upcoming if it's later than current time
              if (reminderTime > now) {
                upcomingList.push({
                  id: doc.id,
                  medicationName: medData.name,
                  dosage: medData.dosage,
                  displayTime: timeStr,
                  reminderTime,
                  instructions: medData.instructions,
                  type: medData.type,
                });
              }
            });
          }

          // Check for renewals needed
          const remainingQty = parseInt(medData.remainingQuantity);
          if (remainingQty <= (medData.refillThreshold || 5)) {
            renewalList.push(medData);
          }

          // Check for missed doses
          const lastTaken = medData.lastTaken?.toDate();
          if (!lastTaken || lastTaken < now.setHours(0, 0, 0, 0)) {
            missedList.push(medData);
          }
        });

        // Sort upcoming reminders by time
        upcomingList.sort((a, b) => a.reminderTime - b.reminderTime);

        setMedications(medicationsList);
        setUpcomingReminders(upcomingList);
        setRenewalNeeded(renewalList);
        setMissedDoses(missedList);

        // Calculate adherence rate
        const adherenceStats = medicationsList.reduce(
          (acc, med) => ({
            taken: acc.taken + (med.dosesTaken || 0),
            total: acc.total + (med.totalDoses || 0),
          }),
          { taken: 0, total: 0 }
        );

        setAdherenceRate(
          adherenceStats.total > 0
            ? Math.round((adherenceStats.taken / adherenceStats.total) * 100)
            : 0
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb pageName="Dashboard" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-primary mr-2" />
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                {upcomingReminders.length}
              </h4>
              <p className="text-sm text-gray-500">Upcoming Today</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-meta-1 mr-2" />
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                {missedDoses.length}
              </h4>
              <p className="text-sm text-meta-1">Missed Doses</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <RefreshCw className="w-6 h-6 text-meta-5 mr-2" />
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                {renewalNeeded.length}
              </h4>
              <p className="text-sm text-meta-5">Need Renewal</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center">
            <PieChart className="w-6 h-6 text-meta-3 mr-2" />
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                {adherenceRate}%
              </h4>
              <p className="text-sm text-meta-3">Adherence Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Quick Actions Section */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                >
                  <Plus className="w-5 h-5" />
                  Add New Medication
                </button>
                <button
                  onClick={() => navigate("/medications")}
                  className="flex items-center justify-center gap-2 rounded bg-meta-5 p-3 font-medium text-white hover:bg-opacity-90"
                >
                  <RefreshCw className="w-5 h-5" />
                  Request Renewal
                </button>
                <button
                  onClick={() => navigate("/medicationhistory")}
                  className="flex items-center justify-center gap-2 rounded bg-meta-3 p-3 font-medium text-white hover:bg-opacity-90"
                >
                  <Calendar className="w-5 h-5" />
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Reminders Section */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Today's Schedule
              </h3>
            </div>
            <div className="p-4">
              {upcomingReminders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No medications scheduled for today
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={`${reminder.id}-${reminder.displayTime}`}
                      className="rounded-lg border border-stroke p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-black dark:text-white">
                          {reminder.medicationName}
                        </h4>
                        <span className="text-sm text-meta-3">
                          {formatTime(reminder.displayTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          {reminder.type} • {reminder.dosage}
                        </span>
                      </div>
                      {reminder.instructions && (
                        <p className="text-xs text-gray-500 mt-2">
                          {reminder.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
