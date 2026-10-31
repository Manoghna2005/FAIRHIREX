import React, { useState } from 'react';
import { JobSession, Candidate } from '../types';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Scale
} from 'lucide-react';

interface CandidateComparisonViewProps {
  job: JobSession;
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  blindReviewMode: boolean;
}

export const CandidateComparisonView: React.FC<CandidateComparisonViewProps> = ({
  job,
  candidates,
  onSelectCandidate,
  blindReviewMode
}) => {
  // Allow selecting 2 to 4 candidates
  const [selectedIds, setSelectedIds] = useState<string[]>([
    candidates[0]?.id || '',
    candidates[1]?.id || '',
    candidates[2]?.id || ''
  ].filter(Boolean));

  const toggleCandidateSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedCandidates = selectedIds.map(id => candidates.find(c => c.id === id)!).filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Candidate Synthesis · Research Feature</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Side-by-Side Candidate Comparison Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Compare grounded requirements, evidence snippets, manipulation resilience, and uncertainties across 2 to 4 candidates.
          </p>
        </div>

        {/* Candidate Selector Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {candidates.map(c => {
            const isSelected = selectedIds.includes(c.id);
            const displayName = blindReviewMode ? c.candidateCode : c.name;
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidateSelection(c.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {displayName} (#{c.scores.rankingPosition})
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] gap-4 pb-4">
          {selectedCandidates.map(c => {
            const displayName = blindReviewMode ? c.candidateCode : c.name;
            const isCritical = c.manipulationAssessment.riskLevel === 'critical';

            return (
              <div
                key={c.id}
                className={`bg-white border rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-5 ${
                  isCritical ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                {/* Header Card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      Rank #{c.scores.rankingPosition}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {c.candidateCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {displayName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.totalYearsExperience} Years Experience
                  </div>

                  {/* Big Score Card */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        FairHire-X Score
                      </div>
                      <div className="text-2xl font-extrabold text-indigo-700 font-mono tabular-nums">
                        {c.scores.overallMatchScore}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Uncertainty CI
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-700">
                        [{c.scores.confidenceInterval[0]}–{c.scores.confidenceInterval[1]}]
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Criteria Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Semantic Relevance:</span>
                    <span className="font-mono font-bold text-slate-900">{c.scores.semanticRelevance}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Skill Coverage:</span>
                    <span className="font-mono font-bold text-slate-900">{c.scores.requiredSkillCoverage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Evidence Strength:</span>
                    <span className="font-mono font-bold text-slate-900">{c.scores.evidenceStrength}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Experience Fit:</span>
                    <span className="font-mono font-bold text-slate-900">{c.scores.experienceFit}%</span>
                  </div>
                </div>

                {/* Mandatory Skills Matrix */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                    Required Competencies:
                  </span>
                  <div className="space-y-1.5">
                    {job.requiredSkills.map(skill => {
                      const ev = c.skillEvidenceList.find(e => e.skillName === skill);
                      return (
                        <div key={skill} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                          <span className="text-slate-700 truncate max-w-[150px]">{skill}</span>
                          <div>
                            {ev?.status === 'direct_match' && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Direct Match
                              </span>
                            )}
                            {ev?.status === 'transferable' && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                Transferable
                              </span>
                            )}
                            {ev?.status === 'insufficient_evidence' && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                List Only
                              </span>
                            )}
                            {(!ev || ev?.status === 'missing') && (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                Missing
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Manipulation Risk */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Integrity Risk Tier:</span>
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                      c.manipulationAssessment.riskLevel === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : c.manipulationAssessment.riskLevel === 'elevated'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {c.manipulationAssessment.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Inspect Detail Button */}
                <button
                  onClick={() => onSelectCandidate(c)}
                  className="w-full py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors text-center"
                >
                  Inspect Full File & Audit Log
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Human-in-the-Loop Governing Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2">
        <Scale className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          Ethical Decision Policy: Avoid presenting a single numerical score as an objective measure of an applicant's worth. Talent committees must review project evidence, work trajectory, and uncertainty bounds before scheduling interview stages.
        </span>
      </div>
    </div>
  );
};
