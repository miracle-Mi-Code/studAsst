import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({ regNumber: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userLevel', response.data.user.level);
      
      // Dispatch authorization state change event
      window.dispatchEvent(new Event("authChange"));
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid credentials or portal configurations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-16 md:mt-24 p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/80 card-animate">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Portal Log In</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Enter your metrics to access resources and dashboard
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Registration / Matrix Number
          </label>
          <input 
            type="text" 
            name="regNumber" 
            placeholder="e.g. COSC/2021/045"
            value={formData.regNumber} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••"
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Authenticating Profile...' : 'Authenticate Profile'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center text-sm text-slate-500 dark:text-slate-400">
        New to the platform?{' '}
        <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;