import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const AddMedicationModal = ({ isOpen, onClose, onMedicationAdded }) => {
  const initialMedicationData = {
    name: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    instructions: "",
    remainingQuantity: "",
    prescribedBy: "",
    adherenceRate: 0,
    totalDoses: 0,
    dosesTaken: 0,
    status: "active",
    nextDoseTime: "",
    reminder: false,
    notes: "",
    type: "",
    refillReminder: false,
    refillThreshold: 5,
    sideEffects: [],
    priority: "medium",
    timingPreferences: [],
    lastTaken: null,
  };

  const [medicationData, setMedicationData] = useState(initialMedicationData);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setMedicationData(initialMedicationData);
    }
  }, [isOpen]);

  const getNumberOfDoses = (frequency) => {
    switch (frequency) {
      case "once":
        return 1;
      case "twice":
        return 2;
      case "thrice":
        return 3;
      case "custom":
        return 4; // You can modify this for custom frequency
      default:
        return 0;
    }
  };

  // Handle frequency change to reset timing preferences
  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    const numberOfDoses = getNumberOfDoses(frequency);

    // Initialize empty timing preferences array based on frequency
    const timingPreferences = Array(numberOfDoses).fill("");

    setMedicationData({
      ...medicationData,
      frequency,
      timingPreferences,
    });
  };

  // Handle timing preference change
  const handleTimingChange = (index, value) => {
    const newTimingPreferences = [...medicationData.timingPreferences];
    newTimingPreferences[index] = value;

    setMedicationData({
      ...medicationData,
      timingPreferences: newTimingPreferences,
    });
  };

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

    // Check if required props are provided
    if (!onMedicationAdded) {
      toast.error(
        "Configuration error: onMedicationAdded callback is required"
      );
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Adding medication...");

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.dismiss(loadingToast);
        toast.error("User not authenticated");
        return;
      }

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

      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToast);
      toast.success("Medication added successfully!", {
        duration: 3000,
        position: "top-right",
      });

      // Reset form state
      setMedicationData(initialMedicationData);

      // Call callbacks
      onMedicationAdded();
      onClose();
    } catch (error) {
      // Dismiss loading toast and show error toast
      toast.dismiss(loadingToast);
      toast.error("Failed to add medication. Please try again.", {
        duration: 4000,
        position: "top-right",
      });
      console.error("Error adding medication:", error);
    }
  };

  const handleClose = () => {
    setMedicationData(initialMedicationData);
    onClose();
  };

  // Render timing preference inputs based on frequency
  const renderTimingInputs = () => {
    const numberOfDoses = getNumberOfDoses(medicationData.frequency);

    if (numberOfDoses === 0) return null;

    return Array.from({ length: numberOfDoses }).map((_, index) => (
      <div key={index}>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {index === 0
            ? "First Dose Time"
            : index === 1
            ? "Second Dose Time"
            : index === 2
            ? "Third Dose Time"
            : `Dose ${index + 1} Time`}
        </label>
        <input
          type="time"
          value={medicationData.timingPreferences[index] || ""}
          onChange={(e) => handleTimingChange(index, e.target.value)}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          required
        />
      </div>
    ));
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
                onClick={handleClose}
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
                    value={medicationData.name}
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
                    value={medicationData.type}
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
                    value={medicationData.priority}
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
                    value={medicationData.dosage}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                {/* Updated Frequency field */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={medicationData.frequency}
                    onChange={handleFrequencyChange}
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

                {/* Dynamic Timing Preferences */}
                {medicationData.frequency && (
                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    {renderTimingInputs()}
                  </div>
                )}

                {/* Reminder Settings */}
                <div>
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Enable Reminders
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="reminder"
                      checked={medicationData.reminder}
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
                    value={medicationData.startDate}
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
                    value={medicationData.endDate}
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
                    value={medicationData.instructions}
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
                    value={medicationData.remainingQuantity}
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
                    value={medicationData.prescribedBy}
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
                    value={medicationData.notes}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    rows="2"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
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
