import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiUserPlus, FiMenu, FiX } from "react-icons/fi";
import Logo from "../images/logo/logo-dark.svg";
import model from "../images/landingpage/Picsart_25-02-08_21-36-00-562.png";
import dashboard from "../images/landingpage/Dashboard.jpg";
import medicationlist from "../images/landingpage/medication-list.jpg";
import reminderpage from "../images/landingpage/reminders-page.jpg";
import trackedmedication from "../images/landingpage/tracked-medication-history.jpg";
import DarkModeSwitcher from "../components/DarkModeSwitcher";

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2 dark:text-bodydark">
      {/* Navigation */}
      <nav className="fixed w-full bg-white dark:bg-boxdark shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <img src={Logo} className="h-8 w-auto" alt="Logo" />
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center space-x-2"
              >
                <FiLogIn />
                <span>Login</span>
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <FiUserPlus />
                <span>Sign Up</span>
              </button>

              <div className="flex items-center">
                <DarkModeSwitcher />
              </div>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-boxdark shadow-lg z-40">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => navigate("/signin")}
              className="w-full px-4 py-2 text-left text-gray-600 hover:text-gray-900 dark:text-gray-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full px-4 py-2 text-left bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </button>
            <div className="px-4 py-2">
              <DarkModeSwitcher />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white dark:from-boxdark dark:to-boxdark-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                MediTracker - Your Personal Health Companion
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                MediTracker is an intuitive and user-friendly platform designed
                to help users efficiently track their medications, appointments,
                and health records.
              </p>
            </div>
            <div className="relative">
              <img
                src={model}
                alt="MediTracker Model"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 bg-white dark:bg-boxdark-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                MediTracker Dashboard – Your Health at a Glance
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The MediTracker Dashboard provides users with a comprehensive
                view of their medication routine and health updates. It helps in
                managing upcoming medications, tracking missed doses, and
                ensuring timely renewals—all in one place.
              </p>
            </div>
            <div className="relative">
              <img
                src={dashboard}
                alt="Dashboard"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Medication List Section */}
      <section className="py-16 bg-gray-50 dark:bg-boxdark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={medicationlist}
                alt="Medication List"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="mb-12 lg:mb-0 order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Medication List – Track Your Prescriptions Easily
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The Medication List section provides a structured view of all
                your ongoing prescriptions, ensuring you never miss a dose. It
                helps in tracking medication details and managing your routine
                effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reminders Section */}
      <section className="py-16 bg-white dark:bg-boxdark-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Today's Medical Schedule – Stay on Track
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The Today's Medical Schedule section helps you stay organized by
                displaying upcoming and past medication reminders. It ensures
                that you take your medicines on time and track any missed doses.
              </p>
            </div>
            <div className="relative">
              <img
                src={reminderpage}
                alt="Reminders"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-gray-50 dark:bg-boxdark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={trackedmedication}
                alt="Medication History"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="mb-12 lg:mb-0 order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Medication History – Track Your Progress
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The Medication History section provides a clear record of your
                medication adherence, helping you stay informed about your
                progress and identify any missed doses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-boxdark-2">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Take Control of Your Medication Schedule?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who trust MediTracker to manage their
            medications effectively.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform transition hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
