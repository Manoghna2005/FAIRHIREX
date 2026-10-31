import React from 'react';
import { ShieldCheck, UserCheck, Eye, EyeOff, Sparkles, Database, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  userRole: 'Recruiter' | 'Lead Researcher' | 'Ethics Auditor';
  setUserRole: (role: 'Recruiter' | 'Lead Researcher' | 'Ethics Auditor') => void;
  blindReviewMode: boolean;
  setBlindReviewMode: (val: boolean) => void;
  onNewSessionClick: () => void;
  interfaceMode: 'simple' | 'research';
  setInterfaceMode: (mode: 'simple' | 'research') => void;
  onOpenDemoGuide: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  overview: 'Recruitment Intelligence Overview',
  screening: 'Candidate Screening & Verification',
  skill_graph: 'Evidence-Grounded Skill Graph',
  manipulation: 'Manipulation & Adversarial Detection',
  fairness_lab: 'Fairness & Robustness Lab',
  explainability: 'Explainability & Attribution Engine',
  interviews: 'Grounded Interview Generator',
  benchmarks: 'Experiments & Benchmark Evaluations',
  comparison: 'Multi-Candidate Comparison Matrix',
  settings: 'Settings, Governance & Python Architecture'
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  userRole,
  setUserRole,
  blindReviewMode,
  setBlindReviewMode,
  onNewSessionClick,
  interfaceMode,
  setInterfaceMode,
  onOpenDemoGuide
}) => {
  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-6 shrink-0 z-10">
      {/* Zone 1: Wordmark & Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
          FairHire-X
        </span>
        <span className="text-slate-300 select-none">/</span>
        <h1 className="text-sm font-semibold text-slate-700 truncate">
          {VIEW_TITLES[currentView] || 'Workspace'}
        </h1>
      </div>

      {/* Zone 2: Navigation Utilities, Mode Switcher & Demo Guide */}
      <div className="flex items-center gap-3 text-xs">
        {/* Simple vs Research Mode Switcher */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setInterfaceMode('simple')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              interfaceMode === 'simple'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👤 Simple View</span>
          </button>
          <button
            onClick={() => setInterfaceMode('research')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              interfaceMode === 'research'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🔬 Research Lab</span>
          </button>
        </div>

        {/* Presentation Cheat Sheet Button */}
        <button
          onClick={onOpenDemoGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors font-bold shadow-2xs"
          title="Open step-by-step 3-minute presentation script for your evaluator"
        >
          <span>🎓 How to Demo to Mam</span>
        </button>

        {/* Blind Review Mode Toggle */}
        <button
          onClick={() => setBlindReviewMode(!blindReviewMode)}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-colors ${
            blindReviewMode
              ? 'bg-amber-50 text-amber-900 border-amber-300 font-medium'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Masks candidate personal names during review to prevent cognitive bias."
        >
          {blindReviewMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-amber-700" />
              <span>Blind Audit</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Names Visible</span>
            </>
          )}
        </button>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onNewSessionClick}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
};
