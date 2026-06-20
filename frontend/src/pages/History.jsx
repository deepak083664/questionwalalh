import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  FileText,
  Download,
  Edit3,
  Trash2,
  Calendar
} from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPapers = async () => {
    try {
      const res = await api.get('/api/papers');
      if (res.data.success) {
        setPapers(res.data.papers);
      }
    } catch (err) {
      console.error('Failed to fetch historical papers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDownloadPDF = (paperId) => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    window.open(`${cleanBase}/api/papers/${paperId}/pdf?token=${token}`, '_blank');
  };

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this question paper? This action is permanent.')) {
      return;
    }
    
    try {
      const res = await api.delete(`/api/papers/${paperId}`);
      if (res.data.success) {
        setPapers(papers.filter(p => p._id !== paperId));
      }
    } catch (err) {
      console.error('Delete paper failed:', err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-xs font-semibold text-slate-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Saved Papers & Archives
        </h1>
        <p className="text-slate-500 mt-1 font-semibold text-xs leading-relaxed">
          Open, duplicate, and download your previously generated question sheets.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white border border-slate-150 rounded-2xl"></div>
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white border border-slate-200/50 rounded-2xl p-16 text-center flex flex-col items-center">
          <FileText className="h-12 w-12 text-slate-350 mb-4" />
          <h3 className="text-base font-bold text-slate-800">No question papers archived</h3>
          <p className="text-xs text-slate-550 mt-1 max-w-xs font-semibold leading-relaxed">
            Create assessment question sheets using the AI Generator or scan print sheets to archive them here.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
          >
            Create Paper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-medium text-sm">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="bg-white/70 p-5 flex flex-col justify-between clay-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[9px] font-bold text-indigo-600 rounded-lg clay-badge">
                      Class {paper.class}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500 rounded-lg clay-badge">
                      {paper.subject}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(paper.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug truncate">
                    {paper.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 truncate uppercase tracking-wider">
                    {paper.schoolName || 'St. Xavier Institution'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 text-xs font-bold text-slate-500 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">Total Marks</span>
                    <span className="text-slate-800 font-extrabold">{paper.totalMarks} Marks</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">Questions</span>
                    <span className="text-slate-800 font-extrabold">{paper.questions?.length || 0} Items</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-150">
                <button
                  onClick={() => navigate(`/builder/${paper._id}`)}
                  className="flex-1 py-2 text-indigo-650 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all clay-btn clay-btn-flat"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                
                <button
                  onClick={() => handleDownloadPDF(paper._id)}
                  className="p-2 text-slate-450 hover:text-emerald-650 rounded-xl transition-all clay-btn clay-btn-flat"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDeletePaper(paper._id)}
                  className="p-2 text-slate-450 hover:text-rose-500 rounded-xl transition-all clay-btn clay-btn-flat"
                  title="Delete Paper"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
