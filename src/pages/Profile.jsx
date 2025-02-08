import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Calendar, Activity, Mail } from "lucide-react";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchUserData();
    });
    return () => unsubscribe();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
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
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-6 sm:px-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              <div className="flex items-center justify-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>{userData.email}</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Phone className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
                </div>
                <p className="text-gray-700">{userData.phone || "Not provided"}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                </div>
                <p className="text-gray-700">{userData.address || "Not provided"}</p>
              </div>
            </div>

            {/* Disease History */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-8">
              <div className="flex items-center mb-6">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Disease History</h2>
              </div>
              
              {userData.diseaseHistory && userData.diseaseHistory.length > 0 ? (
                <div className="space-y-4">
                  {userData.diseaseHistory.map((disease, index) => (
                    <div 
                      key={index}
                      className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{disease.condition}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{disease.diagnosedDate || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No disease history recorded</p>
                </div>
              )}
            </div>

            {/* Edit Button */}
            <div className="flex justify-center">
              <Link
                to="/edit-profile"
                className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-black font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => setTimeout(fetchUserData, 500)}
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
