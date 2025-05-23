import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { RefreshCw, AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

const RenewalRequest = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const medsRef = collection(db, "Users", user.uid, "medications");
      const q = query(medsRef, where("status", "==", "active"));
      const querySnapshot = await getDocs(q);

      const medsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        needsRenewal: isRenewalNeeded(doc.data()),
      }));

      setMedications(medsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setLoading(false);
    }
  };

  const isRenewalNeeded = (medication) => {
    const remainingQty = parseInt(medication.remainingQuantity) || 0;
    const threshold = medication.refillThreshold || 5;
    return remainingQty <= threshold;
  };

  const toggleMedicationSelection = (medId) => {
    setSelectedMeds((prev) =>
      prev.includes(medId)
        ? prev.filter((id) => id !== medId)
        : [...prev, medId]
    );
  };

  const submitRenewalRequest = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const renewalRequestRef = collection(
        db,
        "Users",
        user.uid,
        "renewalRequests"
      );
      const requestData = {
        medications: selectedMeds.map((medId) => {
          const med = medications.find((m) => m.id === medId);
          return {
            medicationId: medId,
            name: med.name,
            dosage: med.dosage,
            currentQuantity: med.remainingQuantity,
          };
        }),
        status: "pending",
        requestDate: Timestamp.now(),
        userId: user.uid,
        userName: user.displayName || "Unknown User",
        userEmail: user.email,
      };

      await addDoc(renewalRequestRef, requestData);
      setRequestStatus("success");

      for (const medId of selectedMeds) {
        const medRef = doc(db, "Users", user.uid, "medications", medId);
        await updateDoc(medRef, {
          renewalRequested: true,
          lastRenewalRequest: Timestamp.now(),
        });
      }

      setTimeout(() => {
        navigate("/medication");
      }, 2000);
    } catch (error) {
      console.error("Error submitting renewal request:", error);
      setRequestStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb pageName="Request Renewal" />
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Request Medication Renewal
          </h2>
        </div>

        <div className="p-6">
          {medications.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-stroke p-4 bg-gray-50 dark:border-strokedark dark:bg-meta-4">
              <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No medications found that need renewal.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className={`p-4 rounded-lg border ${
                      med.needsRenewal
                        ? "border-meta-1 bg-meta-1/10 dark:bg-meta-1/20"
                        : "border-stroke dark:border-strokedark"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedMeds.includes(med.id)}
                          onChange={() => toggleMedicationSelection(med.id)}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary dark:border-gray-600"
                          disabled={!med.needsRenewal}
                        />
                        <div>
                          <h3 className="font-medium text-black dark:text-white">
                            {med.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {med.dosage} • Remaining: {med.remainingQuantity}
                          </p>
                        </div>
                      </div>
                      {med.needsRenewal && (
                        <span className="text-sm text-meta-1">
                          Renewal Needed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <button
                  onClick={submitRenewalRequest}
                  disabled={selectedMeds.length === 0}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-boxdark"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Submit Renewal Request
                </button>

                {requestStatus === "success" && (
                  <div className="flex items-center gap-2 rounded-lg border border-meta-1 p-4 bg-meta-1/10 dark:bg-meta-1/20">
                    <X className="h-4 w-4 text-meta-1" />
                    <p className="text-sm text-meta-1">
                      This feature is temporarily unavailable. Please stay
                      patient — it will be resolved soon!
                    </p>
                  </div>
                )}

                {requestStatus === "error" && (
                  <div className="flex items-center gap-2 rounded-lg border border-meta-1 p-4 bg-meta-1/10 dark:bg-meta-1/20">
                    <X className="h-4 w-4 text-meta-1" />
                    <p className="text-sm text-meta-1">
                      Error submitting renewal request. Please try again.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RenewalRequest;
