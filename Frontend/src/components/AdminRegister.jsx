import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    regNumber: '',
    email: '',
    password: '',
    level: '400'
  });
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
      const response = await axios.post(`${API_BASE_URL}/api/auth/register-admin`, formData);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userLevel', response.data.user.level);
      
      // Dispatch authorization state change event
      window.dispatchEvent(new Event("authChange"));
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred during administrator profile setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-12 p-8 bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-3xl shadow-xl card-animate">
      <div className="text-center mb-8">
        <span className="inline-flex px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4">
          🔐 Administrator Setup Portal
        </span>
        <h2 className="text-3xl font-black text-white">Create Admin Account</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Configure an administrator account to manage materials and verify student records.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-rose-400 text-sm flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Admin Full Name
          </label>
          <input 
            type="text" 
            name="fullName" 
            placeholder="e.g. System Admin"
            value={formData.fullName} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-550/20 focus:border-amber-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Admin Registration / Employee Number
          </label>
          <input 
            type="text" 
            name="regNumber" 
            placeholder="e.g. ADMIN/2026/001"
            value={formData.regNumber} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-550/20 focus:border-amber-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <input 
            type="email" 
            name="email" 
            placeholder="admin@student-asst.com"
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-550/20 focus:border-amber-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••"
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-550/20 focus:border-amber-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            Academic Status Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-550/20 focus:border-amber-500 transition-all duration-200"
          >
            <option value="400">400 Level (Chief Admin)</option>
            <option value="300">300 Level (Assistant Admin)</option>
            <option value="200">200 Level (Officer Admin)</option>
            <option value="100">100 Level (Junior Admin)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-650/15 hover:shadow-amber-650/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Registering Admin Profile...' : 'Register Administrator'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-amber-400 font-bold hover:underline">
          Log in here
        </Link>
      </div>
    </div>
  );
};

export default AdminRegister;
