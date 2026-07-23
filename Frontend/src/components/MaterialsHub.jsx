import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const MaterialsHub = () => {
  const [materials, setMaterials] = useState([]);
  const [levelFilter, setLevelFilter] = useState(localStorage.getItem('userLevel') || '100');
  const [semesterFilter, setSemesterFilter] = useState('First');
  
  // Admin upload states
  const isAdmin = localStorage.getItem('userRole') === 'admin';
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    courseCode: '',
    level: '100',
    semester: 'First',
    fileUrl: ''
  });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/materials?level=${levelFilter}&semester=${semesterFilter}`);
      setMaterials(response.data.data);
    } catch (err) {
      console.error('Could not compile download listings.', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [levelFilter, semesterFilter]);

  const handleDownload = async (id, fileUrl) => {
    try {
      // Trigger counter endpoint on database
      await axios.put(`${API_BASE_URL}/api/materials/download/${id}`);
      
      // Update local downloads state immediately for responsiveness
      setMaterials(prev => 
        prev.map(mat => mat._id === id ? { ...mat, downloadCount: mat.downloadCount + 1 } : mat)
      );
      
      window.open(fileUrl, '_blank');
    } catch (err) {
      console.error('Download trigger error', err);
    }
  };

  const handleUploadChange = (e) => {
    setUploadData({ ...uploadData, [e.target.name]: e.target.value });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');
    setUploadLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`${API_BASE_URL}/api/materials`, uploadData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploadSuccess('Material uploaded successfully!');
      setUploadData({
        title: '',
        courseCode: '',
        level: levelFilter,
        semester: semesterFilter,
        fileUrl: ''
      });
      fetchMaterials(); // Reload lists
      setTimeout(() => setShowUploadModal(false), 1500);
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Error occurred while uploading material.');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto card-animate">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Departmental Resource Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Browse and download verified lecture notes, textbooks, and past question sheets.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setUploadSuccess('');
              setUploadError('');
              setShowUploadModal(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 transition-all duration-200 flex items-center gap-2 self-start sm:self-center"
          >
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Material
          </button>
        )}
      </header>
      
      {/* Filtering Navigation controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Level Filter
            </label>
            <select 
              value={levelFilter} 
              onChange={(e) => setLevelFilter(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Semester
            </label>
            <select 
              value={semesterFilter} 
              onChange={(e) => setSemesterFilter(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials List Render Grid */}
      {materials.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <svg className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="font-semibold text-slate-500 dark:text-slate-300">No documents found</p>
          <p className="text-sm text-slate-400 mt-1">There are no study materials matching this level and semester combination yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => (
            <div 
              key={mat._id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                  {mat.courseCode}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-4 line-clamp-2 min-h-[3.5rem] leading-snug">
                  {mat.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 mb-6">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{mat.downloadCount} download{mat.downloadCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload(mat._id, mat.fileUrl)} 
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-600/15 hover:shadow-teal-600/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Download PDF Resource</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Admin Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800/80 card-animate relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Upload Lecture Material</h3>

            {uploadError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-sm">
                {uploadError}
              </div>
            )}
            
            {uploadSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 text-sm">
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Document Title
                </label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g. MTH 101 Lecture Notes - Vectors"
                  value={uploadData.title} 
                  onChange={handleUploadChange} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Course Code
                </label>
                <input 
                  type="text" 
                  name="courseCode" 
                  placeholder="e.g. MTH101"
                  value={uploadData.courseCode} 
                  onChange={handleUploadChange} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={uploadData.semester}
                    onChange={handleUploadChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="First">First Semester</option>
                    <option value="Second">Second Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Document URL / Resource Link
                </label>
                <input 
                  type="url" 
                  name="fileUrl" 
                  placeholder="https://example.com/lecture-note.pdf"
                  value={uploadData.fileUrl} 
                  onChange={handleUploadChange} 
                  required 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={uploadLoading}
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/15 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                {uploadLoading ? 'Publishing Material...' : 'Publish Material'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsHub;