import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/logo/logo.svg";
import model from"../images/landingpage/Picsart_25-02-08_21-36-00-562.png"
import dashboard from"../images/landingpage/Dashboard.jpg"
import medicationlist from"../images/landingpage/medication-list.jpg"
import reminderpage from"../images/landingpage/reminders-page.jpg"
import trackedmedication from"../images/landingpage/tracked-medication-history.jpg"
import { FiSun, FiMoon, FiLogIn, FiUserPlus, FiMenu, FiX } from "react-icons/fi";import "../CSS/Landing.css";
const Landing = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <div>
      <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-logo">
          {/* <img src={Logo} className="logo" /> */}
          <h1 className="head-name">MEDITRACK</h1>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "show" : ""}`}>
          <button 
            onClick={() => navigate("/signin")} 
            className="nav-btn login-btn"
          >
            <FiLogIn /> <span>Login</span>
          </button>
          
          <button 
            onClick={() => navigate("/signup")} 
            className="nav-btn signup-btn"
          >
            <FiUserPlus /> <span>Sign Up</span>
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="nav-btn theme-btn"
            aria-label="Toggle theme"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
    <section className="sec3">
        <div className="model-section">
          <div className="model-section-second">
            <img
              src={model}
              alt="img"
            />
          </div>
          <div className="model-section-first">
            <h2>
                MediTracker - Your Personal Health Companion
            </h2>
            <p>
               MediTracker is an intuitive and user-friendly platform designed to help users efficiently track their medications, appointments, and health records. It ensures timely medication reminders and provides a seamless way to manage personal health data in one place.
            </p>
          </div>
        </div>
      </section>
      <section className="sec2">
        <div className="first-section">
          <div className="first-section-first">
            <h2>
              MediTracker Dashboard – Your Health at a Glance
            </h2>
            <p>
            The MediTracker Dashboard provides users with a comprehensive view of their medication routine and health updates. It helps in managing upcoming medications, tracking missed doses, and ensuring timely renewals—all in one place.
            </p>
          </div>
          <div className="first-section-second">
            <img
              src={dashboard}
              alt="img"
            />
          </div>
        </div>
      </section>
      <section className="sec3">
        <div className="first-section">
          <div className="first-section-second">
            <img
              src={medicationlist}
              alt="img"
            />
          </div>
          <div className="first-section-first">
            <h2>
               Medication List – Track Your Prescriptions Easily
            </h2>
            <p>
            The Medication List section provides a structured view of all your ongoing prescriptions, ensuring you never miss a dose. It helps in tracking medication details and managing your routine effectively.
            </p>
          </div>
        </div>
      </section>
      <section className="sec2">
        <div className="first-section">
          <div className="first-section-first">
            <h2>
            Today's Medical Schedule – Stay on Track with Your Medications
            </h2>
            <p>
            The Today's Medical Schedule section helps you stay organized by displaying upcoming and past medication reminders. It ensures that you take your medicines on time and track any missed doses.
            </p>
          </div>
          <div className="first-section-second">
            <img
              src={reminderpage}
              alt="img"
            />
          </div>
        </div>
      </section>
      <section className="sec3">
        <div className="first-section">
          <div className="first-section-second">
            <img
              src={trackedmedication}
              alt="img"
            />
          </div>
          <div className="first-section-first">
            <h2>
            Medication History – Track Your Progress
            </h2>
            <p>
            The Medication History section provides a clear record of your medication adherence, helping you stay informed about your progress and identify any missed doses.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Landing;
