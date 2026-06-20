import React, { useState, useEffect } from 'react';
import Mascot from './Mascot';

/**
 * Premium AI Loading component showing steps and progress
 * @param {string} mode - 'generate' (Syllabus/Question stages) or 'ocr' (Read/Extract/Analyze stages)
 * @param {string} title - Main header title
 */
const AILoader = ({ mode = 'generate', title = 'Processing AI Request...' }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const generateStages = [
    { label: 'Understanding syllabus', icon: '📚' },
    { label: 'Building paper structure', icon: '🧠' },
    { label: 'Generating intelligent questions', icon: '✨' },
    { label: 'Preparing final paper', icon: '📄' }
  ];

  const ocrStages = [
    { label: 'Reading uploaded image', icon: '🔍' },
    { label: 'Extracting raw contents', icon: '📄' },
    { label: 'Understanding text context', icon: '🧠' },
    { label: 'Finalizing parsed structures', icon: '✨' }
  ];

  const currentStages = mode === 'ocr' ? ocrStages : generateStages;

  // Increment progress smoothly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98; // Hold just before 100% until API responds
        }
        const next = prev + Math.floor(Math.random() * 8) + 2;
        return next > 98 ? 98 : next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  // Update active stage based on progress
  useEffect(() => {
    if (progress < 25) {
      setStage(0);
    } else if (progress < 50) {
      setStage(1);
    } else if (progress < 75) {
      setStage(2);
    } else {
      setStage(3);
    }
  }, [progress]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-3xl backdrop-blur-md clay-card text-center relative z-10 animate-pulse-slow">
      {/* Floating sheets in background */}
      <div className="absolute -top-6 -left-6 w-12 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md -rotate-12 animate-bounce opacity-40" style={{ animationDuration: '4s' }}>
        <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 m-2"></div>
        <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 mx-2"></div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-14 h-18 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md rotate-12 animate-bounce opacity-40" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 m-2"></div>
        <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 mx-2 mb-2"></div>
        <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 mx-2"></div>
      </div>

      {/* Mascot based on active loading state */}
      <Mascot state={mode === 'ocr' ? 'inspecting' : 'working'} />

      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
        {title}
      </h3>

      {/* Progress Timeline */}
      <div className="mt-8 space-y-3.5 text-left max-w-xs mx-auto">
        {currentStages.map((item, idx) => {
          const isCompleted = idx < stage;
          const isActive = idx === stage;
          
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isCompleted ? 'text-emerald-500 dark:text-emerald-400 opacity-100' :
                isActive ? 'text-indigo-650 dark:text-indigo-400 font-extrabold scale-102 opacity-100' :
                'text-slate-400 dark:text-slate-650 opacity-60'
              }`}
            >
              <div className={`h-6 w-6 rounded-full border flex items-center justify-center flex-shrink-0 text-xs shadow-inner transition-all duration-300 ${
                isCompleted ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200' :
                isActive ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 animate-pulse' :
                'bg-slate-50 dark:bg-slate-950/10 border-slate-200'
              }`}>
                {isCompleted ? '✓' : item.icon}
              </div>
              <span className="text-xs font-bold leading-none">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Container */}
      <div className="mt-8 space-y-2">
        <div className="w-full bg-slate-100 dark:bg-slate-950/50 h-3 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 h-full rounded-full transition-all duration-300 shadow-md"
            style={{ width: `${progress}%`, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.45)' }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          <span>AI Engine status</span>
          <span className="text-indigo-600 dark:text-indigo-400">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default AILoader;
