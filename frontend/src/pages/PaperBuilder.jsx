import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  FileText,
  Save,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  School,
  Clock,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

const PaperBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Paper state
  const [paper, setPaper] = useState(null);

  // Modal / Add custom question state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'Short',
    marks: 2,
    options: ['', '', '', ''],
    answer: '',
  });

  const fetchPaper = async () => {
    try {
      const res = await api.get(`/api/papers/${id}`);
      if (res.data.success) {
        setPaper(res.data.paper);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch paper details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaper();
  }, [id]);

  const handleSavePaper = async () => {
    setSaveLoading(true);
    setError('');
    setSuccess('');

    const computedTotal = paper.questions.reduce((sum, q) => sum + parseInt(q.marks || 0, 10), 0);
    const updatedPaper = { ...paper, totalMarks: computedTotal };

    try {
      const res = await api.put(`/api/papers/${id}`, updatedPaper);
      if (res.data.success) {
        setPaper(res.data.paper);
        setSuccess('Question paper saved successfully!');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save paper.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    window.open(`${cleanBase}/api/papers/${id}/pdf?token=${token}`, '_blank');
  };

  const moveQuestion = (index, direction) => {
    if (!paper) return;
    const questions = [...paper.questions];
    if (direction === 'up' && index > 0) {
      const temp = questions[index];
      questions[index] = questions[index - 1];
      questions[index - 1] = temp;
    } else if (direction === 'down' && index < questions.length - 1) {
      const temp = questions[index];
      questions[index] = questions[index + 1];
      questions[index + 1] = temp;
    }
    setPaper({ ...paper, questions });
  };

  const deleteQuestion = (index) => {
    if (!paper) return;
    const questions = paper.questions.filter((_, i) => i !== index);
    setPaper({ ...paper, questions });
  };

  const updateQuestionText = (index, text) => {
    const questions = [...paper.questions];
    questions[index].text = text;
    setPaper({ ...paper, questions });
  };

  const updateQuestionMarks = (index, marks) => {
    const questions = [...paper.questions];
    questions[index].marks = parseInt(marks, 10) || 1;
    setPaper({ ...paper, questions });
  };

  const handleAddCustomQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.text.trim()) return;

    const options = newQuestion.type === 'MCQ' ? newQuestion.options.filter(Boolean) : [];

    const updatedQuestions = [
      ...paper.questions,
      {
        text: newQuestion.text,
        type: newQuestion.type,
        marks: parseInt(newQuestion.marks, 10) || 1,
        options,
        answer: newQuestion.answer || 'Not specified',
      },
    ];

    setPaper({ ...paper, questions: updatedQuestions });
    setShowAddModal(false);
    
    setNewQuestion({
      text: '',
      type: 'Short',
      marks: 2,
      options: ['', '', '', ''],
      answer: '',
    });
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-650 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !paper) {
    return (
      <div className="p-4 rounded-xl bg-red-50 text-red-650 font-bold border border-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Navbar Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors clay-btn clay-btn-flat px-3.5 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Archives
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePaper}
            disabled={saveLoading}
            className="px-5 py-3 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow-sm clay-btn clay-btn-indigo"
          >
            {saveLoading ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-3 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow-sm clay-btn clay-btn-emerald animate-pulse"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-150 flex items-center gap-2">
          <CheckCircle className="h-4.5 w-4.5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Layout Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white/60 dark:bg-slate-900/60 p-6 shadow-sm space-y-4 clay-card">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/40">
              <School className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
              School details & metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">School Name</label>
                <input
                  type="text"
                  value={paper.schoolName}
                  onChange={(e) => setPaper({ ...paper, schoolName: e.target.value })}
                  placeholder="School Name Header"
                  className="w-full px-3 py-2 text-xs font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Assessment Name</label>
                <input
                  type="text"
                  value={paper.examName}
                  onChange={(e) => setPaper({ ...paper, examName: e.target.value })}
                  placeholder="e.g. Mid-Term Examination"
                  className="w-full px-3 py-2 text-xs font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Exam Title</label>
                <input
                  type="text"
                  value={paper.title}
                  onChange={(e) => setPaper({ ...paper, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Time (Mins)</label>
                  <input
                    type="number"
                    value={paper.duration}
                    onChange={(e) => setPaper({ ...paper, duration: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs font-bold focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Total Marks</label>
                  <div className="w-full py-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs font-extrabold text-center text-slate-800 dark:text-slate-200 shadow-inner">
                    {paper.questions.reduce((sum, q) => sum + (q.marks || 0), 0)} Marks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-150 dark:border-slate-800/40">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Exam questions ({paper.questions.length})</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2.5 text-indigo-500 dark:text-indigo-400 font-bold rounded-xl text-[10px] flex items-center gap-1 clay-btn clay-btn-flat"
              >
                <Plus className="h-3.5 w-3.5" /> Add Question
              </button>
            </div>

            {paper.questions.length === 0 ? (
              <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-10 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold clay-card">
                No questions compiled. Click add button to build a question.
              </div>
            ) : (
              paper.questions.map((q, index) => (
                <div key={index} className="bg-white/60 dark:bg-slate-900/60 p-5 shadow-sm space-y-4 clay-card">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-[10px] font-bold text-indigo-755 dark:text-indigo-350 bg-indigo-55/30 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                      Question {index + 1}
                    </span>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 rounded-xl clay-btn clay-btn-flat animate-hover"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveQuestion(index, 'down')}
                        disabled={index === paper.questions.length - 1}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 rounded-xl clay-btn clay-btn-flat animate-hover"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded-xl clay-btn clay-btn-flat animate-hover"
                        title="Remove Question"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Question Text</label>
                    <textarea
                      value={q.text}
                      onChange={(e) => updateQuestionText(index, e.target.value)}
                      rows="2"
                      className="w-full px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-indigo-600 leading-relaxed"
                    />
                  </div>

                  {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Option {String.fromCharCode(65 + oIdx)}</label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updatedQuestions = [...paper.questions];
                              updatedQuestions[index].options[oIdx] = e.target.value;
                              setPaper({ ...paper, questions: updatedQuestions });
                            }}
                            className="w-full px-3 py-1.5 text-[11px] font-semibold outline-none focus:border-indigo-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="w-full max-w-[100px] space-y-1">
                    <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Marks Weight</label>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => updateQuestionMarks(index, e.target.value)}
                      min="1"
                      className="w-full px-3 py-1.5 text-xs font-extrabold outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Preview */}
        <div>
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-5 space-y-4 sticky top-20 gpu-accelerated clay-card">
            <h3 className="font-extrabold text-slate-850 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
              Live Structure Preview
            </h3>

            <div className="bg-white/80 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/80 shadow-inner font-mono text-[9px] space-y-4 max-h-[460px] overflow-y-auto select-none leading-relaxed text-slate-650 dark:text-slate-350 clay-input">
              {/* Preview Details */}
              <div className="text-center font-bold border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                  {paper.schoolName || 'YOUR SCHOOL NAME HERE'}
                </p>
                <p className="mt-0.5 truncate">{paper.examName || 'Assessment Name'}</p>
                <div className="flex justify-between text-[7px] mt-2 font-semibold">
                  <span>Class: {paper.class}</span>
                  <span>Subj: {paper.subject}</span>
                  <span>Time: {paper.duration}m</span>
                  <span>Marks: {paper.questions.reduce((sum, q) => sum + (q.marks || 0), 0)}</span>
                </div>
              </div>

              {/* Instructions Preview */}
              {paper.instructions.length > 0 && (
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3 space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[7px]">Instructions:</span>
                  {paper.instructions.map((inst, i) => (
                    <p key={i} className="truncate">{i + 1}. {inst}</p>
                  ))}
                </div>
              )}

              {/* Questions preview */}
              <div className="space-y-2.5">
                {paper.questions.map((q, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-2">
                    <div className="flex-1 truncate">
                      <span className="font-bold">{idx + 1}.</span> {q.text}
                      {q.type === 'MCQ' && (
                        <div className="grid grid-cols-2 gap-1 mt-1 pl-3 text-[7.5px] text-slate-400 dark:text-slate-500 font-semibold">
                          <span>A) {q.options?.[0]?.substring(0, 15)}...</span>
                          <span>B) {q.options?.[1]?.substring(0, 15)}...</span>
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-indigo-500 dark:text-indigo-400">[{q.marks}M]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-7 w-full max-w-md animate-zoom-in space-y-5 font-sans clay-card">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Add custom question</h3>

            <form onSubmit={handleAddCustomQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Question Text</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  placeholder="Write the question prompt here..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-indigo-650"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs outline-none select"
                  >
                    <option value="Short">Short Answer</option>
                    <option value="Long">Long Answer</option>
                    <option value="MCQ">MCQ (Multiple Choice)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Marks weight</label>
                  <input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value, 10) || 1 })}
                    min="1"
                    className="w-full px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {newQuestion.type === 'MCQ' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Options</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {newQuestion.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const options = [...newQuestion.options];
                          options[idx] = e.target.value;
                          setNewQuestion({ ...newQuestion, options });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="px-3 py-1.5 text-xs outline-none focus:border-indigo-600"
                        required
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ml-1">Answer Key / Solution</label>
                <input
                  type="text"
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                  placeholder="Expected points / correct key option"
                  className="w-full px-3 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4.5 py-2.5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2.5 text-white font-bold rounded-xl text-[10px] clay-btn clay-btn-indigo"
                >
                  Add to Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperBuilder;
