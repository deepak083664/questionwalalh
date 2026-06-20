import React from 'react';

/**
 * Animated Mascot Component representing the Cute AI Teacher
 * @param {string} state - 'idle' | 'working' | 'inspecting' | 'happy'
 * @param {string} className - Optional tailwind classes
 * @param {string} message - Optional bubble message text to display next to the mascot
 */
const Mascot = ({ state = 'idle', className = '', message = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center relative select-none ${className}`}>
      {/* Speech Bubble */}
      {message && (
        <div className="absolute -top-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-slate-800 dark:text-slate-200 animate-bounce z-10 clay-badge">
          {message}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 rotate-45"></div>
        </div>
      )}

      {/* Mascot SVG Body wrapper */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Ambient Glow Aura */}
        <div className={`absolute w-32 h-32 rounded-full filter blur-3xl opacity-30 transition-all duration-500 ${
          state === 'inspecting' ? 'bg-cyan-400 scale-110' :
          state === 'working' ? 'bg-indigo-400' :
          state === 'happy' ? 'bg-emerald-400 scale-105' : 'bg-purple-400'
        }`}></div>

        {/* Floating Particles/Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute text-cyan-400 text-xs font-extrabold top-4 left-6 animate-ping">✨</span>
          <span className="absolute text-indigo-400 text-xs font-extrabold bottom-6 right-8 animate-pulse">📚</span>
          <span className="absolute text-purple-400 text-sm font-extrabold top-8 right-6 animate-bounce">?</span>
          {state === 'working' && (
            <>
              <span className="absolute text-indigo-500 text-xs font-mono top-12 left-10 animate-pulse">1</span>
              <span className="absolute text-purple-500 text-xs font-mono bottom-12 left-8 animate-ping">0</span>
              <span className="absolute text-pink-500 text-xs font-bold top-6 right-12 animate-pulse">+</span>
            </>
          )}
        </div>

        {/* Smart Glasses Scanning Beam */}
        {state === 'inspecting' && (
          <svg className="absolute top-1/2 left-0 w-full h-24 pointer-events-none z-0" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="scanBeamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Cone of scan light */}
            <polygon points="65,30 135,30 180,100 20,100" fill="url(#scanBeamGrad)" className="animate-pulse" />
            {/* Scanning line sweep */}
            <line x1="20" y1="50" x2="180" y2="50" stroke="#22d3ee" strokeWidth="2" className="mascot-scan-line" />
          </svg>
        )}

        {/* Main Mascot Robot/Teacher SVG */}
        <svg
          viewBox="0 0 200 200"
          className={`w-40 h-40 drop-shadow-xl transition-transform duration-300 ${
            state === 'happy' ? 'scale-105' : ''
          }`}
        >
          <defs>
            <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="notebookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>

          {/* Floating Notebook - Left/Right side depending on animation */}
          <g className={`mascot-notebook-anim ${state === 'working' ? 'mascot-working-notebook' : ''}`}>
            {/* Pad/Book Cover */}
            <rect x="25" y="110" width="30" height="40" rx="4" fill="url(#notebookGrad)" transform="rotate(-15 40 130)" />
            {/* Pages */}
            <rect x="28" y="112" width="24" height="36" rx="2" fill="#ffffff" transform="rotate(-15 40 130)" />
            {/* Page lines */}
            <line x1="32" y1="120" x2="48" y2="116" stroke="#e2e8f0" strokeWidth="1.5" transform="rotate(-15 40 130)" />
            <line x1="33" y1="125" x2="49" y2="121" stroke="#e2e8f0" strokeWidth="1.5" transform="rotate(-15 40 130)" />
            <line x1="34" y1="130" x2="50" y2="126" stroke="#e2e8f0" strokeWidth="1.5" transform="rotate(-15 40 130)" />
            {state === 'working' && (
              <path d="M 38,124 Q 44,118 42,130" fill="none" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" className="mascot-page-flip" />
            )}
          </g>

          {/* Main Floating Neck joint */}
          <rect x="92" y="125" width="16" height="15" rx="4" fill="#cbd5e1" className="mascot-body-float" />

          {/* Torso / Body */}
          <g className="mascot-body-float">
            {/* Outer Jacket/Base */}
            <path d="M 65,140 L 135,140 Q 145,185 135,185 L 65,185 Q 55,185 65,140 Z" fill="#312e81" />
            {/* Inner shirt */}
            <path d="M 85,140 L 115,140 L 108,160 L 92,160 Z" fill="#f8fafc" />
            {/* Cute tie */}
            <polygon points="96,145 104,145 106,165 100,172 94,165" fill="#f43f5e" />
            {/* Left Arm / Node */}
            <circle cx="55" cy="155" r="8" fill="#818cf8" />
            {/* Right Arm / Node (waving if happy) */}
            <g className={state === 'happy' ? 'mascot-wave-arm' : ''}>
              <circle cx="145" cy="155" r="8" fill="#818cf8" />
              {state === 'happy' && (
                <path d="M 148,152 Q 165,130 160,120" fill="none" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" />
              )}
            </g>
          </g>

          {/* Head & Face Group */}
          <g className={`mascot-head-float ${state === 'working' ? 'mascot-head-focus' : ''} ${state === 'inspecting' ? 'mascot-head-scan' : ''}`}>
            {/* Ears / Antennas */}
            <rect x="42" y="70" width="10" height="20" rx="3" fill="#cbd5e1" />
            <rect x="148" y="70" width="10" height="20" rx="3" fill="#cbd5e1" />
            <circle cx="47" cy="65" r="4" fill="#a5b4fc" />
            <circle cx="153" cy="65" r="4" fill="#a5b4fc" />

            {/* Smart Teacher Glasses Band (Back) */}
            <rect x="50" y="65" width="100" height="8" fill="#0f172a" />

            {/* Main Robot Face/Helmet */}
            <rect x="52" y="45" width="96" height="80" rx="36" fill="url(#headGrad)" stroke="#4f46e5" strokeWidth="2" />
            
            {/* Dark glass screen area */}
            <rect x="62" y="58" width="76" height="42" rx="14" fill="#0f172a" />

            {/* Blushy cheeks */}
            <ellipse cx="72" cy="94" rx="6" ry="3" fill="#f43f5e" fillOpacity="0.6" className="animate-pulse" />
            <ellipse cx="128" cy="94" rx="6" ry="3" fill="#f43f5e" fillOpacity="0.6" className="animate-pulse" />

            {/* Cute Smart Glasses (Front frames) */}
            <g className="mascot-glasses">
              {/* Left Lens */}
              <rect x="66" y="62" width="30" height="24" rx="8" fill="url(#glassGrad)" stroke="#22d3ee" strokeWidth="2.5" />
              {/* Right Lens */}
              <rect x="104" y="62" width="30" height="24" rx="8" fill="url(#glassGrad)" stroke="#22d3ee" strokeWidth="2.5" />
              {/* Bridge */}
              <line x1="96" y1="72" x2="104" y2="72" stroke="#22d3ee" strokeWidth="3" />
            </g>

            {/* Eyes (Inside Lenses) */}
            <g className="mascot-eyes">
              {state === 'happy' ? (
                // Happy arches
                <>
                  <path d="M 75,76 Q 81,70 87,76" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 113,76 Q 119,70 125,76" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                </>
              ) : state === 'working' ? (
                // Focused glowing lines
                <>
                  <line x1="75" y1="74" x2="87" y2="74" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" className="animate-pulse" />
                  <line x1="113" y1="74" x2="125" y2="74" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" className="animate-pulse" />
                </>
              ) : (
                // Idle cute blinking circles
                <>
                  <circle cx="81" cy="74" r="4.5" fill="#ffffff" className="mascot-eye-blink" />
                  <circle cx="119" cy="74" r="4.5" fill="#ffffff" className="mascot-eye-blink" />
                </>
              )}
            </g>

            {/* Cute digital mouth */}
            <path
              d={
                state === 'happy' ? "M 92,102 Q 100,112 108,102" :
                state === 'working' ? "M 95,104 L 105,104" :
                "M 94,103 Q 100,107 106,103"
              }
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Mascot;
