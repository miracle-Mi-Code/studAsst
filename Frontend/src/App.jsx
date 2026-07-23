import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Typewriter from "./components/Typewriter";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import MaterialsHub from "./components/MaterialsHub";
import "./index.css";
import visionIcon from "./assets/vision.svg";
import missionIcon from "./assets/mission.svg";

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch (e) {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {}
  }, [theme]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-950 text-gray-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === "light" ? "dark" : "light"))
        }
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 pt-24 pb-16">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <section className="py-16 md:py-24 text-center max-w-3xl mx-auto flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 text-sm font-medium mb-6 animate-pulse">
                  ✨ Centralized Departmental Resource Hub
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
                  Empowering Your <br className="hidden md:block"/>
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Academic Journey
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-2xl leading-relaxed">
                  Access verified departmental resources, lecture notes, textbook PDFs,
                  and past questions in one unified portal. Designed by students, for students.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button
                    onClick={() => navigate("/materials")}
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Get Started & Browse
                  </button>
                  <button
                    onClick={() => navigate("/about")}
                    className="px-8 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold transition-all duration-200"
                  >
                    Learn More
                  </button>
                </div>
              </section>
            }
          />

          {/* About Route */}
          <Route
            path="/about"
            element={
              <section className="py-8 max-w-4xl mx-auto">
                <Typewriter text="About STUDENT-ASST" />

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800/80 mt-6 card-animate">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold">STUDENT-ASST</strong> is a
                    centralized academic resource hub that connects students with
                    curated, verified departmental materials. Our objective is to streamline study and
                    collaboration, leading to better learning outcomes and a more transparent academic process.
                  </p>
                </div>

                <div className="grid gap-6 mt-8 md:grid-cols-2">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800/80 card-animate">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                        <img src={visionIcon} alt="Vision" className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Our Vision
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                          To become the trusted digital learning platform where
                          every student can easily discover, access, and contribute
                          high-quality academic resources.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800/80 card-animate">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                        <img src={missionIcon} alt="Mission" className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Our Mission
                        </h3>
                        <ul className="mt-3 text-slate-600 dark:text-slate-300 list-disc list-inside space-y-2 leading-relaxed">
                          <li>Curate and maintain verified departmental study materials.</li>
                          <li>Deliver an intuitive, accessible experience for all students.</li>
                          <li>Foster collaborative sharing and continuous content improvement.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            }
          />

          {/* Core Routes */}
          <Route path="/materials" element={<MaterialsHub />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer theme={theme} />
    </div>
  );
};

export default App;
