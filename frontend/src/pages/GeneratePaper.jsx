import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  ChevronRight,
  School,
  Settings,
  HelpCircle,
  Clock,
  Plus,
  Trash2,
  FileCheck,
  Check,
  Edit2
} from 'lucide-react';

import AILoader from '../components/AILoader';

const GeneratePaper = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Parameters, 2: Review & Metadata
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generation parameters
  const [params, setParams] = useState({
    classLevel: '10',
    subject: 'Science',
    chapter: '',
    topic: '',
    count: '10',
    difficulty: 'Medium',
    language: 'English',
    type: 'Mixed',
  });

  // Paper Assembly details
  const [paperDetails, setPaperDetails] = useState({
    title: '',
    schoolName: '',
    examName: '',
    duration: 180,
    instructions: [
      'All questions are compulsory.',
      'Section A carries 1 mark per question.',
      'Use of calculator is not allowed.'
    ]
  });

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  
  // Edit Question States
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    text: '',
    marks: 1,
    options: [],
    answer: ''
  });

  // Handles input fields changes
  const handleParamChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleDetailsChange = (e) => {
    setPaperDetails({ ...paperDetails, [e.target.name]: e.target.value });
  };

  // Instructions management helpers
  const handleInstructionChange = (index, value) => {
    const updated = [...paperDetails.instructions];
    updated[index] = value;
    setPaperDetails({ ...paperDetails, instructions: updated });
  };

  const addInstruction = () => {
    setPaperDetails({
      ...paperDetails,
      instructions: [...paperDetails.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    const updated = paperDetails.instructions.filter((_, i) => i !== index);
    setPaperDetails({ ...paperDetails, instructions: updated });
  };

  // Step 1: Trigger AI questions generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/questions/generate', params);
      if (res.data.success && res.data.questions) {
        setGeneratedQuestions(res.data.questions);
        
        // Select all questions by default
        const allIds = res.data.questions.map((q) => q._id);
        setSelectedQuestionIds(allIds);
        
        // Auto-generate title
        setPaperDetails((prev) => ({
          ...prev,
          title: `${params.subject} Class ${params.classLevel} Exam Paper`
        }));
        
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Checkbox toggle handler
  const toggleSelectQuestion = (qId) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== qId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  // Edit / Delete Question Handlers
  const handleStartEdit = (q) => {
    setEditingId(q._id);
    setEditFormData({
      text: q.text,
      marks: q.marks,
      options: q.options ? [...q.options] : [],
      answer: q.answer || ''
    });
  };

  const handleSaveEdit = (qId) => {
    setGeneratedQuestions(prev => prev.map(q => {
      if (q._id === qId) {
        return {
          ...q,
          text: editFormData.text,
          marks: Number(editFormData.marks),
          options: q.type === 'MCQ' ? editFormData.options : undefined,
          answer: editFormData.answer
        };
      }
      return q;
    }));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteQuestion = (qId) => {
    setGeneratedQuestions(prev => prev.filter(q => q._id !== qId));
    setSelectedQuestionIds(prev => prev.filter(id => id !== qId));
  };

  const handleOptionChange = (optIdx, val) => {
    const updatedOptions = [...editFormData.options];
    updatedOptions[optIdx] = val;
    setEditFormData({ ...editFormData, options: updatedOptions });
  };

  // Step 2: Finalize details and create QuestionPaper
  const handleAssemblePaper = async () => {
    if (!paperDetails.title.trim()) {
      return setError('Please provide a paper title.');
    }
    
    const questionsForPaper = generatedQuestions
      .filter((q) => selectedQuestionIds.includes(q._id))
      .map((q) => ({
        text: q.text,
        options: q.options,
        answer: q.answer,
        type: q.type,
        marks: q.marks,
        difficulty: q.difficulty,
      }));

    if (questionsForPaper.length === 0) {
      return setError('You must select at least one question to generate a paper.');
    }

    setLoading(true);
    setError('');

    // Compute total marks
    const totalMarks = questionsForPaper.reduce((sum, q) => sum + q.marks, 0);

    try {
      const payload = {
        ...paperDetails,
        classLevel: params.classLevel,
        subject: params.subject,
        totalMarks,
        questions: questionsForPaper,
      };

      const res = await api.post('/api/papers', payload);
      if (res.data.success) {
        navigate(`/builder/${res.data.paper._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assemble paper. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Step Tracker */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wide mb-2 uppercase">
        <span className={`${step === 1 ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-500 dark:text-slate-500 font-medium'}`}>1. Parameters</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-350" />
        <span className={`${step === 2 ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-500 dark:text-slate-500 font-medium'}`}>2. Paper Details</span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-650 dark:text-rose-450 text-xs font-semibold border border-rose-100 dark:border-rose-900/50">
          {error}
        </div>
      )}

      {loading && step === 1 && (
        <div className="py-8">
          <AILoader mode="generate" title="Question Wallah AI is compiling questions..." />
        </div>
      )}

      {/* STEP 1: PARAMETERS FORM */}
      {!loading && step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleGenerate} className="lg:col-span-2 premium-card p-8 space-y-6">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/40">
              <div className="h-9 w-9 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-indigo-650 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                <Settings className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Input Configuration</h2>
                <p className="text-[10px] text-slate-405 dark:text-slate-500 font-bold uppercase tracking-wider">Lesson parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Class / Grade</label>
                <select
                  name="classLevel"
                  value={params.classLevel}
                  onChange={handleParamChange}
                  className="w-full px-3 py-2 text-xs font-semibold select focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Subject</label>
                <select
                  name="subject"
                  value={params.subject}
                  onChange={handleParamChange}
                  className="w-full px-3 py-2 text-xs font-semibold select focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                >
                  {['Science', 'Mathematics', 'Social Science', 'English', 'Hindi', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Civics'].map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Chapter (Optional)</label>
                <input
                  type="text"
                  name="chapter"
                  value={params.chapter}
                  onChange={handleParamChange}
                  placeholder="e.g. Chemical Reactions"
                  className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600 placeholder-slate-400 focus:ring-1 focus:ring-indigo-600/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Topic (Optional)</label>
                <input
                  type="text"
                  name="topic"
                  value={params.topic}
                  onChange={handleParamChange}
                  placeholder="e.g. Redox Actions"
                  className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600 placeholder-slate-400 focus:ring-1 focus:ring-indigo-600/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Question Count</label>
                <input
                  type="number"
                  name="count"
                  value={params.count}
                  onChange={handleParamChange}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 text-xs font-bold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={params.difficulty}
                  onChange={handleParamChange}
                  className="w-full px-3 py-2 text-xs font-semibold select focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Language</label>
                <select
                  name="language"
                  value={params.language}
                  onChange={handleParamChange}
                  className="w-full px-3 py-2 text-xs font-semibold select focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (Devanagari)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Question Type</label>
                <select
                  name="type"
                  value={params.type}
                  onChange={handleParamChange}
                  className="w-full px-3 py-2 text-xs font-semibold select focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10"
                >
                  <option value="Mixed">Mixed (MCQs, Short & Long)</option>
                  <option value="MCQ">Multiple Choice Questions (MCQ)</option>
                  <option value="Short">Short Answer</option>
                  <option value="Long">Long Answer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 clay-btn clay-btn-indigo"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Generate Questions via Question Wallah AI
            </button>
          </form>

          {/* Guidelines info card */}
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 space-y-4 shadow-sm self-start clay-card">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
              AI Guidelines
            </h3>
            <ol className="space-y-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 list-decimal list-inside leading-relaxed">
              <li>Select your target class grade and academic subject.</li>
              <li>Input specific chapters or topics for lessons mapping.</li>
              <li>Toggle languages and question count weights.</li>
              <li>Review the generated items pool, add exam instructions, and assemble your final PDF sheet.</li>
            </ol>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW QUESTIONS & ASSEMBLE */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Questions list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="premium-card p-5 flex justify-between items-center bg-white/60 dark:bg-slate-900/60">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Review Questions</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">
                  Check items you want to keep in the final exam paper.
                </p>
              </div>
              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-indigo-100 dark:border-indigo-900/35">
                {selectedQuestionIds.length} / {generatedQuestions.length} Selected
              </span>
            </div>

            {generatedQuestions.map((q, idx) => {
              const active = selectedQuestionIds.includes(q._id);
              const isEditing = editingId === q._id;
              return (
                <div
                  key={q._id}
                  onClick={() => {
                    if (!isEditing) {
                      toggleSelectQuestion(q._id);
                    }
                  }}
                  className={`p-5 rounded-2xl border flex gap-4 transition-all duration-200 ${
                    isEditing
                      ? 'bg-slate-50 dark:bg-slate-950 border-indigo-500 shadow-lg cursor-default'
                      : active
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-400/50 dark:border-indigo-900/40 shadow-sm cursor-pointer'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800/50 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm cursor-pointer'
                  } clay-card`}
                >
                  {!isEditing && (
                    <div className={`mt-0.5 h-4.5 w-4.5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                      active ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                    }`} style={{ boxShadow: active ? 'inset 1px 1px 2px rgba(255,255,255,0.45)' : 'inset 1px 1px 2px rgba(0,0,0,0.05)' }}>
                      {active && <Check className="h-3.5 w-3.5" />}
                    </div>
                  )}

                  {isEditing ? (
                    <div className="flex-1 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        <span>Editing Question {idx + 1} • {q.type}</span>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Marks:</label>
                          <input
                            type="number"
                            value={editFormData.marks}
                            onChange={(e) => setEditFormData({ ...editFormData, marks: Number(e.target.value) })}
                            className="w-16 px-2 py-1 text-xs font-bold outline-none focus:border-indigo-600"
                            min="1"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Question Text</label>
                        <textarea
                          value={editFormData.text}
                          onChange={(e) => setEditFormData({ ...editFormData, text: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-650 min-h-[60px]"
                          placeholder="Enter question text..."
                        />
                      </div>

                      {q.type === 'MCQ' && editFormData.options && (
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Options</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {editFormData.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                                  className="flex-1 px-3 py-1 text-xs font-semibold outline-none focus:border-indigo-650"
                                  placeholder={`Option ${oIdx + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Answer / Marking Scheme</label>
                        <textarea
                          value={editFormData.answer}
                          onChange={(e) => setEditFormData({ ...editFormData, answer: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-650 min-h-[50px]"
                          placeholder="Enter answer..."
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(q._id)}
                          className="px-3 py-1.5 text-white font-bold rounded-xl text-[10px] clay-btn clay-btn-indigo"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
                        <span>Question {idx + 1} • {q.type}</span>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="bg-white/85 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 px-2.5 py-0.5 rounded-lg text-slate-650 dark:text-slate-350 font-bold clay-badge">{q.marks} Marks</span>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(q)}
                            className="p-1 text-slate-450 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit Question"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="p-1 text-slate-450 hover:text-red-500 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{q.text}</p>
                      
                      {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 p-2 text-[10px] rounded-lg text-slate-500 dark:text-slate-400 font-semibold truncate shadow-inner">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.answer && (
                        <div className="bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/40 text-indigo-750 dark:text-indigo-300 p-3 rounded-2xl text-[10px] font-semibold leading-relaxed mt-3 shadow-inner">
                          <span className="font-extrabold uppercase tracking-wider block text-indigo-500 dark:text-indigo-400 text-[8px] mb-1">Answer / Scheme:</span>
                          {q.answer}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right layout metadata */}
          <div className="space-y-6">
            <div className="premium-card p-6 space-y-5 bg-white/60 dark:bg-slate-900/60 sticky top-20 gpu-accelerated">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                <School className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-450" />
                Exam details
              </h3>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Exam Sheet Title</label>
                <input
                  type="text"
                  name="title"
                  value={paperDetails.title}
                  onChange={handleDetailsChange}
                  placeholder="e.g. Unit Test 1"
                  className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={paperDetails.schoolName}
                  onChange={handleDetailsChange}
                  placeholder="e.g. Cambridge School"
                  className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Exam Name Header</label>
                <input
                  type="text"
                  name="examName"
                  value={paperDetails.examName}
                  onChange={handleDetailsChange}
                  placeholder="e.g. Science Term 1"
                  className="w-full px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Duration (Mins)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="number"
                    name="duration"
                    value={paperDetails.duration}
                    onChange={handleDetailsChange}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Instructions list */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex justify-between items-center ml-1">
                  Instructions
                  <button
                    onClick={addInstruction}
                    className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 p-1 flex items-center gap-0.5 text-[9px] font-bold"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </label>
                
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {paperDetails.instructions.map((inst, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={inst}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Instruction ${index + 1}`}
                        className="flex-1 px-3 py-1.5 text-[10px] font-semibold outline-none focus:border-indigo-600"
                      />
                      <button
                        onClick={() => removeInstruction(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3.5">
                <button
                  onClick={handleAssemblePaper}
                  disabled={loading}
                  className="w-full py-3.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 clay-btn clay-btn-indigo"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <FileCheck className="h-4.5 w-4.5" />
                      Assemble & Go to Builder
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-2.5 text-slate-700 dark:text-slate-350 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
                >
                  Edit parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePaper;
