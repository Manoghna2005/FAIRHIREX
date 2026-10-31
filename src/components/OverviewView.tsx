import React from 'react';
import { JobSession, Candidate } from '../types';
import {
  FileText,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface OverviewViewProps {
  job: JobSession;
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onNavigateToView: (view: string) => void;
  blindReviewMode: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  job,
  candidates,
  onSelectCandidate,
  onNavigateToView,
  blindReviewMode
}) => {
  const totalProcessed = candidates.length;
  const pendingReview = candidates.filter(c => c.reviewStatus === 'pending' || c.reviewStatus === 'further_evidence_needed').length;
  const reviewedCount = candidates.filter(c => c.reviewStatus === 'reviewed' || c.reviewStatus === 'shortlisted').length;
  const criticalFlagsCount = candidates.filter(c => c.manipulationAssessment.riskLevel === 'critical' || c.manipulationAssessment.riskLevel === 'elevated').length;

  // Compute skill frequencies
  const skillCounts: Record<string, number> = {};
  job.requiredSkills.forEach(s => {
    skillCounts[s] = candidates.filter(c => {
      const ev = c.skillEvidenceList.find(e => e.skillName === s);
      return ev && (ev.status === 'direct_match' || ev.status === 'transferable');
    }).length;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / System Disclaimers */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>IEEE Research Project Active Session</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {job.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span>{job.department}</span>
            <span>·</span>
            <span>Target Experience: {job.minExperienceYears}+ Years</span>
            <span>·</span>
            <span className="text-amber-700 font-medium">Synthetic IEEE Demo Dataset Loaded</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onNavigateToView('screening')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <span>Candidate Screening</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Resumes Processed</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {totalProcessed}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Standardized parsing</span>
            <span>·</span>
            <span>100% parsed</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Awaiting Human Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingReview}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Human-in-the-loop validation
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Completed Evaluations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {reviewedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Shortlisted or verified with notes
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Manipulation Risk Flags</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 tabular-nums">
            {criticalFlagsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Adversarial stuffing or injections
          </div>
        </div>
      </div>

      {/* Two Column Layout: Score Distribution & Skill Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution Comparison */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Matching Score Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Proposed FairHire-X (Evidence-Grounded) vs Naive Cosine Baseline
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block"></span>
                <span>FairHire-X</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 inline-block"></span>
                <span>Cosine Baseline</span>
              </span>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3 pt-2">
            {candidates.slice(0, 5).map(c => {
              const displayName = blindReviewMode ? c.candidateCode : c.name;
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">
                      {displayName}
                    </span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-[11px]">
                      <span className="font-bold text-indigo-700">
                        {c.scores.overallMatchScore}%
                      </span>
                      <span className="text-slate-400">
                        (Baseline: {c.scores.baselineCosineScore}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    {/* Baseline indicator tick */}
                    <div
                      className="absolute top-0 bottom-0 bg-slate-300 w-1 z-1"
                      style={{ left: `${c.scores.baselineCosineScore}%` }}
                      title={`Baseline: ${c.scores.baselineCosineScore}%`}
                    ></div>
                    {/* FairHire-X bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.manipulationAssessment.riskLevel === 'critical'
                          ? 'bg-rose-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${c.scores.overallMatchScore}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Notice: Candidate J scored 97% on Cosine, but 48% on FairHire-X due to evidence verification.</span>
            <button
              onClick={() => onNavigateToView('manipulation')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Inspect Audit
            </button>
          </div>
        </div>

        {/* Required Skill Coverage Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Required Skill Coverage in Candidate Pool
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-verified candidate count for each core mandatory skill
              </p>
            </div>
            <button
              onClick={() => onNavigateToView('skill_graph')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <span>View Ontology</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {job.requiredSkills.map(skill => {
              const count = skillCounts[skill] || 0;
              const percentage = Math.round((count / Math.max(candidates.length, 1)) * 100);
              return (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{skill}</span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {count} / {candidates.length} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Ungrounded skill mentions without project narrative are excluded from this verified pool count.
          </div>
        </div>
      </div>

      {/* Candidate Review Queue & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Queue (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Candidate Review Queue
              </h3>
              <p className="text-xs text-slate-500">
                Prioritized by ranking position and flagged review needs
              </p>
            </div>
            <button
              onClick={() => onNavigateToView('screening')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Full Table ({candidates.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {candidates.slice(0, 4).map(c => {
              const displayName = blindReviewMode ? c.candidateCode : c.name;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCandidate(c)}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-md transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {displayName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {c.candidateCode}
                      </span>
                      {c.manipulationAssessment.riskLevel === 'critical' && (
                        <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Adversarial Flag</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{c.totalYearsExperience} yrs exp</span>
                      <span>·</span>
                      <span>Evidence Strength: {c.scores.evidenceStrength}%</span>
                      <span>·</span>
                      <span>Confidence: [{c.scores.confidenceInterval[0]}–{c.scores.confidenceInterval[1]}]</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        {c.scores.overallMatchScore}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Rank #{c.scores.rankingPosition}</div>
                    </div>
                    <button className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health Card & Dataset Status (1 Col) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                System & Model Status
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Skill Graph Engine</span>
                <span className="font-mono text-slate-900 font-medium">13 Active Nodes</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Manipulation Defense</span>
                <span className="font-mono text-slate-900 font-medium">Multi-pass Regex & Density</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Fairness Lab Evaluator</span>
                <span className="font-mono text-slate-900 font-medium">Counterfactual v2</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Active Test Dataset</span>
                <span className="font-mono text-slate-900 font-medium">IEEE-HireBench-v1</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-md bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>Synthetic Research Integrity</span>
              </div>
              <p className="leading-relaxed">
                All benchmark metrics and candidate profiles shown in demo mode are deterministic, reproducible synthetic samples designed to test hypotheses H1–H4.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateToView('benchmarks')}
              className="w-full py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors text-center"
            >
              Run Benchmark Evaluation Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
