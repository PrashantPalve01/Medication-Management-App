import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Breadcrumb from "../../components/Breadcrumb";
import AddMedicationModal from "../../components/AddMedicationModal";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDocs(
            query(collection(db, "Users"), where("email", "==", user.email))
          );
          if (!userDoc.empty) {
            setUserData(userDoc.docs[0].data());
          }
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <h1 className="flex justify-center items-center text-2xl">Loading...</h1>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Dashboard" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Welcome, {userData?.firstName || "User"}
          </h4>
          <p className="text-sm">Medication Management Dashboard</p>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
            Today's Medications
          </h4>
          <p className="text-meta-3">3 Pending</p>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
            Prescriptions
          </h4>
          <p className="text-meta-5">2 Need Renewal</p>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
            Adherence Rate
          </h4>
          <p className="text-primary">85%</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  Add New Medication
                </button>
                <button className="w-full rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Request Prescription Renewal
                </button>
                <button className="w-full rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  View Medication History
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-4 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Upcoming Reminders
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                <div className="rounded border border-stroke p-3 dark:border-strokedark">
                  <p className="text-sm font-medium">Medicine A</p>
                  <p className="text-xs text-meta-3">Today, 2:00 PM</p>
                </div>
                <div className="rounded border border-stroke p-3 dark:border-strokedark">
                  <p className="text-sm font-medium">Medicine B</p>
                  <p className="text-xs text-meta-3">Today, 8:00 PM</p>
                </div>
              </div>
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
