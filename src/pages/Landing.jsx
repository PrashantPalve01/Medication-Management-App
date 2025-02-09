import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiUserPlus, FiMenu, FiX } from "react-icons/fi";
import DarkLogo from "../images/logo/logo-dark.svg";
import LightLogo from "../images/logo/logo.svg";
import model from "../images/landingpage/Picsart_25-02-08_21-36-00-562.png";
import dashboard from "../images/landingpage/Dashboard.jpg";
import medicationlist from "../images/landingpage/medication-list.jpg";
import reminderpage from "../images/landingpage/reminders-page.jpg";
import trackedmedication from "../images/landingpage/tracked-medication-history.jpg";
import DarkModeSwitcher from "../components/DarkModeSwitcher";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Navigation */}
      <nav className="fixed w-full bg-white dark:bg-boxdark shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <img
                src={DarkLogo}
                className="h-20 w-auto dark:hidden"
                alt="Logo"
              />
              <img
                src={LightLogo}
                className="h-20  w-auto hidden dark:block"
                alt="Logo"
              />
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 text-black dark:text-white hover:text-primary dark:hover:text-primary flex items-center space-x-2"
              >
                <FiLogIn />
                <span>Login</span>
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 flex items-center space-x-2"
              >
                <FiUserPlus />
                <span>Sign Up</span>
              </button>

              <div className="flex items-center">
                <DarkModeSwitcher />
              </div>
            </div>

            <button
              className="md:hidden p-2 text-black dark:text-white"
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
              className="w-full px-4 py-2 text-left text-black dark:text-white hover:text-primary dark:hover:text-primary"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full px-4 py-2 text-left bg-primary text-white rounded-lg hover:bg-opacity-90"
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
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
                MediTrack - Your Personal Health Companion
              </h1>
              <p className="text-xl text-body dark:text-bodydark mb-8">
                MediTrack is an intuitive and user-friendly platform designed to
                help users efficiently track their medications, appointments,
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
      <section className="py-16 bg-white dark:bg-boxdark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                MediTrack Dashboard – Your Health at a Glance
              </h2>
              <p className="text-body dark:text-bodydark">
                The MediTrack Dashboard provides users with a comprehensive view
                of their medication routine and health updates. It helps in
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
      <section className="py-16 bg-stroke dark:bg-boxdark-2">
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
      <section className="py-16 bg-white dark:bg-boxdark">
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
      <section className="py-16 bg-stroke dark:bg-boxdark-2">
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
      <section className="py-16 bg-white dark:bg-boxdark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            Ready to Take Control of Your Medication Schedule?
          </h2>
          <p className="text-xl text-body dark:text-bodydark mb-8">
            Join thousands of users who trust MediTracker to manage their
            medications effectively.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transform transition hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>

      <footer className="bg-black dark:bg-boxdark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <img src={LightLogo} alt="MediTracker" className="h-20 w-auto" />
              <p className="text-gray-400">
                Your trusted companion for medication management and health
                tracking.
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>support@meditracker.com</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>123 Health Street, Med City</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">
                © {new Date().getFullYear()} MediTracker. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </button>
                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sitemap
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
