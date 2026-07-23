import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

// ==========================================
// STUDENT DASHBOARD COMPONENT
// ==========================================
const StudentDashboard = ({ navigate }) => {
  const [records, setRecords] = useState([]);
  const [cgpaSummary, setCgpaSummary] = useState({ cgpa: '0.00', remark: 'No entries' });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Grade Form Inputs state hooks
  const [newCourse, setNewCourse] = useState({ 
    courseCode: '', 
    courseTitle: '', 
    creditUnits: 3, 
    score: 70, 
    semester: 'First', 
    academicSession: '2025/2026' 
  });

  const fetchAcademicData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/grades/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.data.courses);
      setCgpaSummary(response.data.data.summary);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load summary blocks', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setErrorMsg('Could not fetch academic records from server.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/api/grades/add`, newCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Clear form except session and semester
      setNewCourse({
        ...newCourse,
        courseCode: '',
        courseTitle: '',
        creditUnits: 3,
        score: 70
      });
      fetchAcademicData(); // Refresh list and CGPA calculations
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error entering course grade validation.');
    }
  };

  const getGradeBadgeClass = (grade) => {
    const base = "px-2.5 py-1 rounded-full text-xs font-bold ";
    switch (grade) {
      case 'A': return base + "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      case 'B': return base + "bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400";
      case 'C': return base + "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400";
      case 'D': return base + "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      case 'E': return base + "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400";
      default: return base + "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">Loading Academic Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Block with CGPA stats */}
      <header className="p-6 md:p-8 bg-gradient-to-r from-indigo-900 via-indigo-955 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">Academic Grade Matrix</h1>
          <p className="text-slate-300 text-sm mt-1">
            Add course results below to calculate your GPA and track progress.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-6">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Current CGPA</span>
            <div className="text-3xl md:text-4xl font-black text-amber-300 mt-1">{cgpaSummary.cgpa}</div>
          </div>
          <div className="h-10 w-px bg-white/20"></div>
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Classification</span>
            <div className="text-lg font-bold text-white mt-1">{cgpaSummary.remark}</div>
          </div>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {errorMsg}
        </div>
      )}

      {/* Main Grid: Form Left, Table Right */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Form panel entry */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add Grade Entry</h3>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Course Code
              </label>
              <input 
                type="text" 
                name="courseCode" 
                value={newCourse.courseCode} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g. COSC 311"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Course Title
              </label>
              <input 
                type="text" 
                name="courseTitle" 
                value={newCourse.courseTitle} 
                onChange={handleInputChange} 
                required 
                placeholder="e.g. Database Design"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Credit Units
                </label>
                <input 
                  type="number" 
                  name="creditUnits" 
                  min="1" 
                  max="6" 
                  value={newCourse.creditUnits} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Exam Score (%)
                </label>
                <input 
                  type="number" 
                  name="score" 
                  min="0" 
                  max="100" 
                  value={newCourse.score} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Semester
                </label>
                <select
                  name="semester"
                  value={newCourse.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Session
                </label>
                <input 
                  type="text" 
                  name="academicSession" 
                  placeholder="2025/2026"
                  value={newCourse.academicSession} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Save Course & Compute GPA
            </button>
          </form>
        </div>

        {/* Dynamic Display Table */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Course Registry Records</h3>
          
          <div className="flex-1 overflow-x-auto">
            {records.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <svg className="w-12 h-12 stroke-current mb-3" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm">No course records entered yet</p>
                <p className="text-xs text-slate-400 mt-1">Use the form on the left to add your grades.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4 text-center">Semester / Session</th>
                    <th className="py-3 px-4 text-center">Credits</th>
                    <th className="py-3 px-4 text-center">Score (%)</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                  {records.map((rec) => (
                    <tr key={rec._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        <div>{rec.courseCode}</div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{rec.courseTitle}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="text-xs font-semibold">{rec.semester} Semester</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{rec.academicSession}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium">{rec.creditUnits}</td>
                      <td className="py-3.5 px-4 text-center font-medium">{rec.score}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={getGradeBadgeClass(rec.grade)}>
                          {rec.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">{rec.gradePoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// ADMIN DASHBOARD COMPONENT
// ==========================================
const AdminDashboard = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, totalMaterials: 0, totalDownloads: 0 });
  const [materials, setMaterials] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' or 'students'
  const [errorMsg, setErrorMsg] = useState('');
  
  // Material Upload Form
  const [uploadData, setUploadData] = useState({
    title: '',
    courseCode: '',
    level: '100',
    semester: 'First',
    fileUrl: ''
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/materials/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { stats, materials, students } = response.data.data;
      setStats(stats);
      setMaterials(materials);
      setStudents(students);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load admin stats', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        setErrorMsg('Could not fetch administrator stats from database.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUploadChange = (e) => {
    setUploadData({ ...uploadData, [e.target.name]: e.target.value });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setUploadSuccess('');
    setUploadLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/api/materials`, uploadData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploadSuccess('Academic material published successfully!');
      setUploadData({
        title: '',
        courseCode: '',
        level: '100',
        semester: 'First',
        fileUrl: ''
      });
      fetchAdminData(); // Reload statistics and list
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving study material.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study document? This action is permanent.')) {
      return;
    }
    
    setErrorMsg('');
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/api/materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData(); // Refresh UI
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while deleting material.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-650 mx-auto"></div>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">Loading System Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin stats header */}
      <header className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl shadow-xl">
        <h1 className="text-2xl md:text-3xl font-black">Admin Management Dashboard</h1>
        <p className="text-indigo-300 text-sm mt-1">Configure study resources, monitor analytics, and oversee student registries.</p>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Students</span>
            <div className="text-2xl md:text-3xl font-black text-indigo-400 mt-1">{stats.totalStudents}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Materials uploaded</span>
            <div className="text-2xl md:text-3xl font-black text-teal-400 mt-1">{stats.totalMaterials}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Downloads logged</span>
            <div className="text-2xl md:text-3xl font-black text-amber-400 mt-1">{stats.totalDownloads}</div>
          </div>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {errorMsg}
        </div>
      )}
      
      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-sm">
          {uploadSuccess}
        </div>
      )}

      {/* Main Grid: Upload left, Registry right */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload form block */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md self-start">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Upload Material</h3>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Document Title
              </label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. MTH 101 Notes - Algebra"
                value={uploadData.title} 
                onChange={handleUploadChange} 
                required 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Course Code
              </label>
              <input 
                type="text" 
                name="courseCode" 
                placeholder="e.g. MTH101"
                value={uploadData.courseCode} 
                onChange={handleUploadChange} 
                required 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Academic Level
                </label>
                <select
                  name="level"
                  value={uploadData.level}
                  onChange={handleUploadChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Semester
                </label>
                <select
                  name="semester"
                  value={uploadData.semester}
                  onChange={handleUploadChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Document URL / PDF Link
              </label>
              <input 
                type="url" 
                name="fileUrl" 
                placeholder="https://example.com/notes.pdf"
                value={uploadData.fileUrl} 
                onChange={handleUploadChange} 
                required 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <button 
              type="submit" 
              disabled={uploadLoading}
              className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/15 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              {uploadLoading ? 'Publishing Material...' : 'Publish Material'}
            </button>
          </form>
        </div>

        {/* Tab-driven Table Block */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex flex-col">
          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              onClick={() => setActiveTab('materials')}
              className={`py-3 px-5 font-bold text-sm border-b-2 transition-all duration-200 ${
                activeTab === 'materials'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Academic Materials ({materials.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-3 px-5 font-bold text-sm border-b-2 transition-all duration-200 ${
                activeTab === 'students'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Registered Students ({students.length})
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {activeTab === 'materials' ? (
              materials.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="font-semibold text-sm">No study documents uploaded yet</p>
                  <p className="text-xs mt-1">Use the upload tool to publish your first academic material.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-400 text-xs font-bold uppercase">
                      <th className="py-3 px-4">Material</th>
                      <th className="py-3 px-4 text-center">Audience</th>
                      <th className="py-3 px-4 text-center">Downloads</th>
                      <th className="py-3 px-4 text-center">Uploaded By</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {materials.map((mat) => (
                      <tr key={mat._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                          <span className="inline-flex px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wider mb-1">
                            {mat.courseCode}
                          </span>
                          <div className="line-clamp-1">{mat.title}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="text-xs font-semibold">{mat.level} Level</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{mat.semester} Semester</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">{mat.downloadCount}</td>
                        <td className="py-3.5 px-4 text-center text-xs">
                          <div>{mat.uploadedBy?.fullName || 'System Seed'}</div>
                          <div className="text-[9px] text-slate-400">{mat.uploadedBy?.email || 'N/A'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDeleteMaterial(mat._id)}
                            className="p-2 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all duration-200"
                            title="Delete Material"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              students.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="font-semibold text-sm">No students registered yet</p>
                  <p className="text-xs mt-1">Students will appear here once they create an account.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Registration No.</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4 text-center">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {students.map((stud) => (
                      <tr key={stud._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{stud.fullName}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{stud.regNumber}</td>
                        <td className="py-3.5 px-4">{stud.email}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold">
                            {stud.level} Level
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// CORE EXPORTED SWITCH COMPONENT
// ==========================================
const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'student';

  return (
    <div className="max-w-6xl mx-auto">
      {userRole === 'admin' ? (
        <AdminDashboard navigate={navigate} />
      ) : (
        <StudentDashboard navigate={navigate} />
      )}
    </div>
  );
};

export default Dashboard;