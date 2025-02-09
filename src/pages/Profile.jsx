import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";

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

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Profile Summary */}
        <div className="col-span-1 xl:col-span-1 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full border-4 border-white dark:border-boxdark shadow-lg overflow-hidden">
                  {userData.imageUrl ? (
                    <img
                      src={userData.imageUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 dark:bg-meta-4 flex items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <h2 className="text-xl font-semibold text-center text-black dark:text-white mb-2">
                {userData.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {userData.email}
              </p>
              <Link
                to="/edit-profile"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-200"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="col-span-1 xl:col-span-3 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default">
          <div className="border-b border-stroke dark:border-strokedark px-6 py-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Medical Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Blood Type
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {userData.bloodType || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Date of Birth
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {userData.dateOfBirth || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Pill className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allergies
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {userData.allergies?.join(", ") || "None reported"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
                  Emergency Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Name
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {userData.emergencyContact?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {userData.emergencyContact?.phone || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-primary mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Relationship
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {userData.emergencyContact?.relationship ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disease History */}
        <div className="col-span-1 xl:col-span-4 bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default">
          <div className="flex justify-between items-center border-b border-stroke dark:border-strokedark px-6 py-4">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Disease History
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.diseaseHistory?.map((disease, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-meta-4 rounded-lg hover:bg-gray-100 dark:hover:bg-meta-3 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <Activity className="w-5 h-5 text-primary mr-2" />
                    <h4 className="font-semibold text-black dark:text-white">
                      {disease.condition}
                    </h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Diagnosed: {disease.diagnosedDate}</span>
                  </div>
                </div>
              ))}
              {(!userData.diseaseHistory ||
                userData.diseaseHistory.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No disease history recorded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
