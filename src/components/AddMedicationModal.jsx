import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddMedicationModal = ({ isOpen, onClose }) => {
  const [medicationData, setMedicationData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    instructions: "",
    remainingQuantity: "",
    prescribedBy: "",
    // New fields for tracking
    adherenceRate: 0,
    totalDoses: 0,
    dosesTaken: 0,
    status: "active",
    nextDoseTime: "",
    reminder: false,
    notes: "",
    type: "",
    refillReminder: false,
    refillThreshold: 5, // Default reminder when 5 doses remaining
    sideEffects: [],
    priority: "medium",
    timingPreference: "",
    lastTaken: null,
  });

  const handleInputChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setMedicationData({
      ...medicationData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const timestamp = new Date();
        await addDoc(collection(db, "Users", user.uid, "medications"), {
          ...medicationData,
          createdAt: timestamp,
          lastUpdated: timestamp,
          status: "active",
          adherenceStats: {
            adherenceRate: 0,
            totalDoses: 0,
            dosesTaken: 0,
            missedDoses: 0,
            lastTracked: timestamp,
          },
        });
        onClose();
      }
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative mx-4 my-8 w-full max-w-xl rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:mx-auto">
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 border-b border-stroke bg-white px-6 py-4 dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-black dark:text-white">
                Add New Medication
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-3xl w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Existing fields */}
                <div className="col-span-2">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                {/* Type and Priority */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Medication Type
                  </label>
                  <select
                    name="type"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="liquid">Liquid</option>
                    <option value="injection">Injection</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Priority
                  </label>
                  <select
                    name="priority"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Existing dosage and frequency fields */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="once">Once daily</option>
                    <option value="twice">Twice daily</option>
                    <option value="thrice">Three times daily</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {/* Timing Preference */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Preferred Timing
                  </label>
                  <input
                    type="time"
                    name="timingPreference"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Reminder Settings */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Enable Reminders
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="reminder"
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">
                      Send dose reminders
                    </span>
                  </div>
                </div>

                {/* Existing date fields */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* Remaining fields */}
                <div className="col-span-2">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    rows="3"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Remaining Quantity
                  </label>
                  <input
                    type="number"
                    name="remainingQuantity"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Prescribed By
                  </label>
                  <input
                    type="text"
                    name="prescribedBy"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                {/* Notes field */}
                <div className="col-span-2">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationModal;
