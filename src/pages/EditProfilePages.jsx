import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Plus,
  X,
  Save,
  ArrowLeft,
  Activity
} from "lucide-react";

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "",
    diseaseHistory: []
  });
  const [newDisease, setNewDisease] = useState({ condition: "", diagnosedDate: "" });
  const [isAddingDisease, setIsAddingDisease] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDocs(
            query(collection(db, "Users"), where("email", "==", user.email))
          );
          if (!userDoc.empty) {
            const data = userDoc.docs[0].data();
            setUserData({
              ...data,
              id: userDoc.docs[0].id,
              diseaseHistory: data.diseaseHistory || []
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiseaseChange = (e) => {
    setNewDisease({ ...newDisease, [e.target.name]: e.target.value });
  };

  const addDisease = () => {
    if (newDisease.condition && newDisease.diagnosedDate) {
      setUserData(prevState => ({
        ...prevState,
        diseaseHistory: [
          ...(prevState.diseaseHistory || []),
          {
            condition: newDisease.condition,
            diagnosedDate: newDisease.diagnosedDate
          }
        ]
      }));
      setNewDisease({ condition: "", diagnosedDate: "" });
      setIsAddingDisease(false);
    }
  };

  const removeDisease = (index) => {
    setUserData(prevState => ({
      ...prevState,
      diseaseHistory: prevState.diseaseHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      
      if (userData.id) {
        const userRef = doc(db, "Users", userData.id);
        await updateDoc(userRef, {
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          imageUrl: userData.imageUrl,
          diseaseHistory: userData.diseaseHistory || []
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!userData.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium">Back to Profile</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="relative group">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {userData.imageUrl ? (
                    <img
                      src={userData.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Click to upload new photo
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-3 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-500">{userData.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Disease History */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Activity className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-semibold">Disease History</h2>
                </div>
                <button
                  onClick={() => setIsAddingDisease(true)}
                  className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </button>
              </div>

              {isAddingDisease && (
                <div className="mb-6 p-6 border border-blue-100 bg-blue-50 rounded-lg">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="condition"
                      value={newDisease.condition}
                      onChange={handleDiseaseChange}
                      placeholder="Disease/Condition"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      name="diagnosedDate"
                      value={newDisease.diagnosedDate}
                      onChange={handleDiseaseChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsAddingDisease(false)}
                        className="px-4 py-2 text-black-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addDisease}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {userData.diseaseHistory && userData.diseaseHistory.length > 0 ? (
                  userData.diseaseHistory.map((disease, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{disease.condition}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {disease.diagnosedDate}
                        </div>
                      </div>
                      <button
                        onClick={() => removeDisease(index)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No disease history recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;