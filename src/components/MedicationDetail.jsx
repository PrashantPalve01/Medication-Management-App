import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Clock,
  Calendar,
  User,
  AlertCircle,
  Pill,
  FileText,
  ChevronLeft,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const MedicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medication, setMedication] = useState(null);
  //   const [adherenceStats, setAdherenceStats] = useState(null);
  const [sideEffects, setSideEffects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchMedicationDetails();
  }, [id]);

  const fetchMedicationDetails = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch medication details
      const medicationDoc = await getDoc(
        doc(db, "Users", user.uid, "medications", id)
      );
      if (medicationDoc.exists()) {
        setMedication({ id: medicationDoc.id, ...medicationDoc.data() });
      }

      // Fetch medication logs for adherence stats
      const logsRef = collection(db, "Users", user.uid, "medicationLogs");
      const q = query(
        logsRef,
        where("medicationId", "==", id),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      // Calculate adherence stats
      const logs = [];
      let takenCount = 0;
      querySnapshot.forEach((doc) => {
        const log = doc.data();
        logs.push(log);
        if (log.status === "taken") takenCount++;
      });

      //   setAdherenceStats({
      //     totalDoses: logs.length,
      //     dosesTaken: takenCount,
      //     adherenceRate:
      //       logs.length > 0 ? ((takenCount / logs.length) * 100).toFixed(1) : 0,
      //   });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching medication details:", error);
      setLoading(false);
    }
  };

  const tabClasses = (tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg ${
      activeTab === tab
        ? "bg-primary text-white"
        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">Loading...</div>
    );
  }

  if (!medication) {
    return <div>Medication not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {medication.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {medication.dosage}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-stroke pb-4">
        <button
          className={tabClasses("overview")}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={tabClasses("history")}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={tabClasses("sideEffects")}
          onClick={() => setActiveTab("sideEffects")}
        >
          Side Effects
        </button>
        <button
          className={tabClasses("prescription")}
          onClick={() => setActiveTab("prescription")}
        >
          Prescription
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Pill className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Dosage</p>
                    <p className="font-medium">{medication.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Frequency</p>
                    <p className="font-medium">{medication.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Prescribed By</p>
                    <p className="font-medium">{medication.prescribedBy}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Adherence Stats */}
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
              <h2 className="text-lg font-semibold mb-4">
                Adherence Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Adherence Rate</p>
                  <p className="text-2xl font-semibold text-primary">
                    {/* {adherenceStats.adherenceRate}% */}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Doses Taken</p>
                  <p className="text-2xl font-semibold text-success">
                    {/* {adherenceStats.dosesTaken}/{adherenceStats.totalDoses} */}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Dates */}
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
              <h2 className="text-lg font-semibold mb-4">Important Dates</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {format(new Date(medication.startDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                {medication.endDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-medium">
                        {format(new Date(medication.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
              <h2 className="text-lg font-semibold mb-4">Instructions</h2>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-primary" />
                <p className="text-gray-600 dark:text-gray-300">
                  {medication.instructions ||
                    "No special instructions provided."}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-lg font-semibold mb-4">Medication History</h2>
            {/* Add medication history component here */}
          </div>
        )}

        {activeTab === "sideEffects" && (
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-lg font-semibold mb-4">
              Side Effects Tracking
            </h2>
            {/* Add side effects tracking component here */}
          </div>
        )}

        {activeTab === "prescription" && (
          <div className="rounded-lg border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-lg font-semibold mb-4">Prescription Details</h2>
            {/* Add prescription details component here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationDetail;
