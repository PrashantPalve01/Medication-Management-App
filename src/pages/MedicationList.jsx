import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { format, isValid, parseISO } from "date-fns";
import Breadcrumb from "../components/Breadcrumb";
import AddMedicationModal from "../components/AddMedicationModal";
import { useNavigate } from "react-router-dom";

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const medicationsRef = collection(db, "Users", user.uid, "medications");
        const querySnapshot = await getDocs(medicationsRef);
        const medicationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: isExpired(doc.data().endDate) ? "expired" : "active",
        }));
        setMedications(medicationsList);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medications:", error);
      setLoading(false);
    }
  };

  const handleMedicationAdded = () => {
    fetchMedications(); // Refresh the medication list after adding
  };

  const isExpired = (endDate) => {
    if (!endDate) return false;
    const date =
      typeof endDate === "string" ? parseISO(endDate) : new Date(endDate);
    return isValid(date) && date < new Date();
  };

  // Helper function to safely format dates
  const formatDate = (dateValue) => {
    if (!dateValue) return "No end date";

    try {
      // Handle different date formats
      let date;
      if (typeof dateValue === "string") {
        date = parseISO(dateValue);
      } else if (dateValue.toDate && typeof dateValue.toDate === "function") {
        // Handle Firestore Timestamp
        date = dateValue.toDate();
      } else {
        date = new Date(dateValue);
      }

      if (isValid(date)) {
        return format(date, "MMM dd, yyyy");
      } else {
        return "Invalid date";
      }
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.prescribedBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || med.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    return status === "active"
      ? "inline-flex rounded-full bg-success px-2.5 py-0.5 text-sm font-medium text-white"
      : "inline-flex rounded-full bg-danger px-2.5 py-0.5 text-sm font-medium text-white";
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
      <Breadcrumb pageName="MedicationList" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
              My Medications
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
            >
              Add New Medication
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-transparent py-2 pl-8 pr-4 outline-none focus:border-primary dark:border-strokedark"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 13.75L17.5 17.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Medication Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Dosage
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Frequency
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Remaining
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  End Date
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((medication, index) => (
                <tr
                  key={medication.id}
                  onClick={() => navigate(`/medications/${medication.id}`)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-meta-4"
                >
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {medication.name || "Unknown Medication"}
                    </h5>
                    <p className="text-sm">
                      {medication.prescribedBy || "Unknown Prescriber"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black dark:text-white">
                      {medication.dosage || "N/A"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black dark:text-white">
                      {medication.frequency || "N/A"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black dark:text-white">
                      {medication.remainingQuantity || "0"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black dark:text-white">
                      {formatDate(medication.endDate)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <span className={getStatusBadgeClass(medication.status)}>
                      {medication.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddMedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMedicationAdded={handleMedicationAdded}
      />
    </>
  );
};

export default MedicationList;
