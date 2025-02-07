import React from "react";
import "../CSS/Landing.css";
import Logo from "../images/logo/logo.svg";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <div className="nav">
          <div className="nav-first">
            <h1>
              <img src={Logo} alt="my Theraphy" className="logo" />
            </h1>
          </div>
          <div className="between-head">
            <button onClick={() => navigate("/signin")}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </div>
      </nav>
      <section className="sec1">
        <div className="first-section">
          <div className="first-section-first">
            <h1>Reliable medication reminders for you </h1>
            <p className="mt-3">
              MyTherapy is your personal, digital health companion. Reliable
              medication reminders and consistent documentation of your intakes.
            </p>
            <p className="mb-3">
              <strong>Download now for free!</strong>
            </p>
            <div className="first-section-apps">
              <a
                href="https://itunes.apple.com/gb/app/mytherapy-meds-pill-reminder/id662170995?mt=8"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="https://www.mytherapyapp.com/media/pages/en/b005a924e6-1733691130/badge-appstore-en-optimized.svg"
                  alt="Get it on the App Store"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=eu.smartpatient.mytherapy&amp;referrer=utm_source%3Dwebsite-en"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  src="https://www.mytherapyapp.com/media/pages/en/1f24653710-1733691130/badge-googleplay-en-optimized.svg"
                  alt="Get it on Google Play"
                />
              </a>
            </div>
          </div>
          <div className="first-section-second">
            <div>
              <img
                src="https://www.mytherapyapp.com/media/pages/en/home/37fb82e5e5-1733690892/web-img1-hero-11-q65-optimized.png"
                alt="img"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="sec2">
        <div className="first-section">
          <div className="first-section-first">
            <h2>
              Get reminded of all your intakes thanks to reliable medication
              alarms
            </h2>
            <p>
              Reliable reminders for your tablets, pills and other medications
              as well as measurements, doctor’s appointments or symptom checks.
            </p>
            <p>
              The MyTherapy app keeps an eye on your medications and therapy for
              you, so you can focus on other important things.
            </p>
          </div>
          <div className="first-section-second">
            <img
              src="https://www.mytherapyapp.com/media/pages/en/home/d8d17f399e-1733690891/group-869-1-q65-optimized.png"
              alt="img"
            />
          </div>
        </div>
      </section>
      <section className="sec3">
        <div className="first-section">
          <div className="first-section-second">
            <img
              src="https://www.mytherapyapp.com/media/pages/en/home/cf0996ec1c-1733690891/web-img-eng-doctor-q65-optimized.png"
              alt="img"
            />
          </div>
          <div className="first-section-first">
            <h2>
              Get reminded of all your intakes thanks to reliable medication
              alarms
            </h2>
            <p>
              Reliable reminders for your tablets, pills and other medications
              as well as measurements, doctor’s appointments or symptom checks.
            </p>
            <p>
              The MyTherapy app keeps an eye on your medications and therapy for
              you, so you can focus on other important things.
            </p>
          </div>
        </div>
      </section>
      <section className="sec2">
        <div className="first-section">
          <div className="first-section-first">
            <h2>
              Get reminded of all your intakes thanks to reliable medication
              alarms
            </h2>
            <p>
              Reliable reminders for your tablets, pills and other medications
              as well as measurements, doctor’s appointments or symptom checks.
            </p>
            <p>
              The MyTherapy app keeps an eye on your medications and therapy for
              you, so you can focus on other important things.
            </p>
          </div>
          <div className="first-section-second">
            <img
              src="https://www.mytherapyapp.com/media/pages/en/home/aa3bb9440d-1733690891/group-870-1-q65-optimized.png"
              alt="img"
            />
          </div>
        </div>
      </section>
      <section className="sec3">
        <div className="first-section">
          <div className="first-section-second">
            <img
              src="https://www.mytherapyapp.com/media/pages/en/home/44fb462e87-1733690891/group-871-1-q65-optimized.png"
              alt="img"
            />
          </div>
          <div className="first-section-first">
            <h2>
              Get reminded of all your intakes thanks to reliable medication
              alarms
            </h2>
            <p>
              Reliable reminders for your tablets, pills and other medications
              as well as measurements, doctor’s appointments or symptom checks.
            </p>
            <p>
              The MyTherapy app keeps an eye on your medications and therapy for
              you, so you can focus on other important things.
            </p>
          </div>
        </div>
      </section>
      <section className="sec2">
        <div className="first-section">
          <div className="first-section-first">
            <h2>
              Get reminded of all your intakes thanks to reliable medication
              alarms
            </h2>
            <p>
              Reliable reminders for your tablets, pills and other medications
              as well as measurements, doctor’s appointments or symptom checks.
            </p>
            <p>
              The MyTherapy app keeps an eye on your medications and therapy for
              you, so you can focus on other important things.
            </p>
          </div>
          <div className="first-section-second">
            <img
              src="https://www.mytherapyapp.com/media/pages/en/home/aa3bb9440d-1733690891/group-870-1-q65-optimized.png"
              alt="img"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
