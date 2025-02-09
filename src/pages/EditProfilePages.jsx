import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Mail,
  Pill,
  Clock,
  AlertCircle,
  Camera,
  Plus,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "",
    bloodType: "",
    dateOfBirth: "",
    allergies: [],
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    diseaseHistory: [],
  });
  const [newDisease, setNewDisease] = useState({
    condition: "",
    diagnosedDate: "",
  });
  const [isAddingDisease, setIsAddingDisease] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDocs(
          query(collection(db, "Users"), where("email", "==", user.email))
        );
        if (!userDoc.empty) {
          setUserData({ ...userDoc.docs[0].data(), id: userDoc.docs[0].id });
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setUserData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (userData.id) {
        const userRef = doc(db, "Users", userData.id);
        await updateDoc(userRef, userData);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addDisease = () => {
    if (newDisease.condition && newDisease.diagnosedDate) {
      setUserData((prev) => ({
        ...prev,
        diseaseHistory: [...(prev.diseaseHistory || []), newDisease],
      }));
      setNewDisease({ condition: "", diagnosedDate: "" });
      setIsAddingDisease(false);
    }
  };

  const removeDisease = (index) => {
    setUserData((prev) => ({
      ...prev,
      diseaseHistory: prev.diseaseHistory.filter((_, i) => i !== index),
    }));
  };

  if (!userData.email) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Edit Profile" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Profile Image Section */}
        <div className="col-span-1 xl:col-span-1">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-6">
              <div className="relative mx-auto mb-6 h-36 w-36 rounded-full">
                <div className="relative h-full w-full rounded-full border-4 border-white dark:border-boxdark shadow-lg">
                  {userData.imageUrl ? (
                    <img
                      src={userData.imageUrl}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-meta-4">
                      <User size={40} className="text-gray-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="mb-1.5 text-xl font-semibold text-black dark:text-white text-center">
                  {userData.name || "Your Name"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="col-span-1 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Basic Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Blood Type
                  </label>
                  <input
                    type="text"
                    name="bloodType"
                    value={userData.bloodType}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={userData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Emergency Contact
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={userData.emergencyContact?.name}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.phone"
                    value={userData.emergencyContact?.phone}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Relationship
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={userData.emergencyContact?.relationship}
                    onChange={handleChange}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disease History */}
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Disease History
                </h3>
                <button
                  onClick={() => setIsAddingDisease(true)}
                  className="flex items-center gap-2 rounded bg-primary px-3 py-1 text-white hover:bg-opacity-90"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
            <div className="p-6">
              {isAddingDisease && (
                <div className="mb-6 rounded border border-stroke p-4 dark:border-strokedark">
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Condition"
                      value={newDisease.condition}
                      onChange={(e) =>
                        setNewDisease((prev) => ({
                          ...prev,
                          condition: e.target.value,
                        }))
                      }
                      className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                    />
                    <input
                      type="date"
                      value={newDisease.diagnosedDate}
                      onChange={(e) =>
                        setNewDisease((prev) => ({
                          ...prev,
                          diagnosedDate: e.target.value,
                        }))
                      }
                      className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setIsAddingDisease(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addDisease}
                        className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                      >
                        Add Disease
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {userData.diseaseHistory?.map((disease, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border border-stroke p-4 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {disease.condition}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        {disease.diagnosedDate}
                      </div>
                    </div>
                    <button
                      onClick={() => removeDisease(index)}
                      className="rounded-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {(!userData.diseaseHistory ||
                  userData.diseaseHistory.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Activity
                      size={32}
                      className="text-gray-300 dark:text-gray-600 mb-2"
                    />
                    <p className="text-gray-500 dark:text-gray-400">
                      No disease history recorded
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Allergies Section */}
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Allergies & Medical Notes
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={userData.allergies?.join(", ")}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      allergies: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    }))
                  }
                  placeholder="Enter allergies (separate with commas)"
                  className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary min-h-[100px]"
                />
              </div>
              <div>
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Additional Medical Notes
                </label>
                <textarea
                  name="medicalNotes"
                  value={userData.medicalNotes}
                  onChange={handleChange}
                  placeholder="Enter any additional medical information"
                  className="w-full rounded border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-1 xl:col-span-4">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-6">
              <div className="flex flex-wrap gap-4 justify-end">
                <button
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md border border-stroke px-6 py-3 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4"
                >
                  <span className="text-black dark:text-white">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
