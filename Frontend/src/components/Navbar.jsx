import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Asst.png";

const Navbar = ({ theme, onToggleTheme }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

  // Listen to local storage changes to keep auth state updated
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };
    checkAuth();
    
    // Listen for custom login/logout events to immediately sync state
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userLevel");
    
    // Dispatch auth state change
    window.dispatchEvent(new Event("authChange"));
    setIsAuthenticated(false);
    setOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-2 w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-850/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <img
            src={logo}
            alt="STUDENT-ASST logo"
            className="h-9 w-9 md:h-10 md:w-10 transform group-hover:scale-105 transition-transform duration-200"
          />
          <div className="text-xl md:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            STUDENT-<span className="text-indigo-600 dark:text-indigo-400">ASST</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={linkClass("/")}>
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link to="/about" className={linkClass("/about")}>
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </Link>
          <Link to="/materials" className={linkClass("/materials")}>
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Materials
          </Link>

          {isAuthenticated ? (
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              Dashboard
            </Link>
          ) : null}

          {/* Theme toggler */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.71.7a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.41zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm8 7a1 1 0 011-1v-1a1 1 0 10-2 0v1a1 1 0 011 1zM15.78 4.22a1 1 0 010 1.41l-.71.71a1 1 0 11-1.42-1.42l.71-.71a1 1 0 011.42 0zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.22 15.78a1 1 0 000 1.42l.71.71a1 1 0 101.42-1.42l-.71-.71a1 1 0 00-1.42 0zM15.78 15.78a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-650" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 116.707 2.707 7 7 0 0017.293 13.293z" />
              </svg>
            )}
          </button>

          {/* Action buttons */}
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-500/10 transition-all duration-200"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white rounded-xl text-sm font-semibold transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.71.7a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.41zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm8 7a1 1 0 011-1v-1a1 1 0 10-2 0v1a1 1 0 011 1zM15.78 4.22a1 1 0 010 1.41l-.71.71a1 1 0 11-1.42-1.42l.71-.71a1 1 0 011.42 0zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.22 15.78a1 1 0 000 1.42l.71.71a1 1 0 101.42-1.42l-.71-.71a1 1 0 00-1.42 0zM15.78 15.78a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-650" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 116.707 2.707 7 7 0 0017.293 13.293z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setOpen((s) => !s)}
            className="text-slate-700 dark:text-slate-350 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 shadow-2xl transition-all duration-300">
          <Link to="/" onClick={() => setOpen(false)} className={mobileLinkClass("/")}>
            Home
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className={mobileLinkClass("/about")}>
            About
          </Link>
          <Link to="/materials" onClick={() => setOpen(false)} className={mobileLinkClass("/materials")}>
            Materials
          </Link>

          {isAuthenticated ? (
            <Link to="/dashboard" onClick={() => setOpen(false)} className={mobileLinkClass("/dashboard")}>
              Dashboard
            </Link>
          ) : null}

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full text-center py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-md transition-all duration-200"
            >
              Sign Out
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full text-center py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white rounded-xl font-bold transition-all duration-250"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="w-full text-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all duration-250"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
