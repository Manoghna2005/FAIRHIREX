import React from 'react';
import {
  LayoutDashboard,
  Users,
  Network,
  ShieldAlert,
  Scale,
  Sparkles,
  HelpCircle,
  FlaskConical,
  GitCompare,
  Settings,
  Briefcase,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { JobSession } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  jobSessions: JobSession[];
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  totalCandidatesCount: number;
  pendingFlagsCount: number;
  interfaceMode: 'simple' | 'research';
  setInterfaceMode: (mode: 'simple' | 'research') => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'default' | 'alert';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  jobSessions,
  selectedJobId,
  setSelectedJobId,
  totalCandidatesCount,
  pendingFlagsCount,
  interfaceMode,
  setInterfaceMode
}) => {
  // Simple view navigation (Super friendly, only 4 clear items)
  const simpleNavItems: NavItem[] = [
    { id: 'screening', label: '1. Candidates & Scores', icon: Users, badge: totalCandidatesCount },
    { id: 'manipulation', label: '2. Anti-Cheat & Risk Check', icon: ShieldAlert, badge: pendingFlagsCount > 0 ? pendingFlagsCount : undefined, badgeVariant: 'alert' },
    { id: 'comparison', label: '3. Compare Candidates', icon: GitCompare },
    { id: 'interviews', label: '4. Interview Questions', icon: HelpCircle }
  ];

  // Full research view navigation (All 10 modules)
  const researchNavItems: NavItem[] = [
    { id: 'overview', label: '1. Overview Dashboard', icon: LayoutDashboard },
    { id: 'screening', label: '2. Candidate Screening', icon: Users, badge: totalCandidatesCount },
    { id: 'skill_graph', label: '3. Skill Graph (Ontology)', icon: Network },
    { id: 'manipulation', label: '4. Manipulation Detection', icon: ShieldAlert, badge: pendingFlagsCount > 0 ? pendingFlagsCount : undefined, badgeVariant: 'alert' },
    { id: 'fairness_lab', label: '5. Fairness & Robustness', icon: Scale },
    { id: 'explainability', label: '6. Explainability Math', icon: Sparkles },
    { id: 'interviews', label: '7. Interview Generator', icon: HelpCircle },
    { id: 'benchmarks', label: '8. Experiments & Benchmarks', icon: FlaskConical },
    { id: 'comparison', label: '9. Candidate Comparison', icon: GitCompare },
    { id: 'settings', label: '10. Settings & Python Core', icon: Settings }
  ];

  const activeNavItems = interfaceMode === 'simple' ? simpleNavItems : researchNavItems;

  const selectedJob = jobSessions.find(j => j.id === selectedJobId) || jobSessions[0];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand & Project Identity */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm">
            FX
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>FairHire-X</span>
              <span className="text-[10px] px-1 py-0.2 bg-indigo-950 text-indigo-300 border border-indigo-700/60 rounded font-mono">IEEE</span>
            </div>
            <div className="text-[11px] text-slate-400">Explainable AI Matching</div>
          </div>
        </div>

        {/* Active Job Selector */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/60">
          <label className="text-[10px] font-semibold text-slate-400 block mb-1">
            Active Job Session
          </label>
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-slate-800/90 text-xs text-slate-200 rounded-md py-1.5 pl-2.5 pr-7 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none truncate cursor-pointer font-medium"
            >
              {jobSessions.map(j => (
                <option key={j.id} value={j.id} className="bg-slate-900 text-slate-200">
                  {j.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <span>{interfaceMode === 'simple' ? 'Quick Workspace' : 'All 10 Research Modules'}</span>
          <span className="text-[9px] text-slate-400 capitalize">{interfaceMode} Mode</span>
        </div>
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums font-semibold shrink-0 ${
                    item.badgeVariant === 'alert'
                      ? 'bg-rose-500 text-white'
                      : isActive
                      ? 'bg-indigo-800 text-indigo-100'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Mode Toggle Link */}
        <div className="pt-3 mt-2 border-t border-slate-800/80 px-1">
          <button
            onClick={() => setInterfaceMode(interfaceMode === 'simple' ? 'research' : 'simple')}
            className="w-full py-1.5 px-2 text-[11px] rounded bg-slate-800/80 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 transition-colors text-center font-medium border border-slate-700/60"
          >
            {interfaceMode === 'simple'
              ? '🔬 Need Research Depth? Click for Lab Mode'
              : '👤 Back to Simple View'}
          </button>
        </div>
      </nav>

      {/* Ethics & AI Governance Disclaimer */}
      <div className="p-3 m-2 rounded-lg bg-slate-850 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Decision-Support System</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Not an autonomous hiring agent. Never automatically rejects candidates. All risk flags require human validation.
        </p>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-300 font-mono text-[10px]">Local Engine Ready</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">v1.2-IEEE</span>
      </div>
    </aside>
  );
};
