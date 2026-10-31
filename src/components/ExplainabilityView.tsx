import React, { useState } from 'react';
import { JobSession, Candidate } from '../types';
import {
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface ExplainabilityViewProps {
  job: JobSession;
  candidates: Candidate[];
  selectedCandidateId: string;
  onSelectCandidateId: (id: string) => void;
  blindReviewMode: boolean;
}

export const ExplainabilityView: React.FC<ExplainabilityViewProps> = ({
  job,
  candidates,
  selectedCandidateId,
  onSelectCandidateId,
  blindReviewMode
}) => {
  const currentCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  const displayName = blindReviewMode ? currentCandidate.candidateCode : currentCandidate.name;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Candidate Selector */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explainable AI (XAI) Attribution · Research Feature</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Transparent Score Decomposition & Evidence Attribution
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Mathematical, un-hallucinated score derivation explaining exact feature contributions and counterfactual improvement recommendations.
          </p>
        </div>

        {/* Candidate Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Candidate:</span>
          <select
            value={currentCandidate.id}
            onChange={(e) => onSelectCandidateId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            {candidates.map(c => (
              <option key={c.id} value={c.id}>
                {blindReviewMode ? c.candidateCode : c.name} (Score: {c.scores.overallMatchScore}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formula & Uncertainty Card */}
      <div className="bg-slate-900 text-slate-100 rounded-lg p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
              Scoring Function Specification
            </div>
            <div className="text-xs font-mono text-slate-200 mt-1">
              MatchScore = (0.25 × SemanticRel) + (0.35 × SkillCov) + (0.25 × EvidenceStr) + (0.15 × ExpFit) - Penalty
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums shrink-0">
            <div>
              <span className="text-slate-400 block text-[10px]">Computed Score</span>
              <span className="text-xl font-extrabold text-white">
                {currentCandidate.scores.overallMatchScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Confidence Range</span>
              <span className="text-xl font-extrabold text-indigo-300">
                [{currentCandidate.scores.confidenceInterval[0]}–{currentCandidate.scores.confidenceInterval[1]}]
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          The confidence bounds reflect evidence ambiguity. Candidates with isolated skill lists without narrative context have wider confidence bounds to communicate uncertainty to hiring committees.
        </p>
      </div>

      {/* Feature Contributions Waterfall Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Feature Attribution Decomposition for {displayName}
          </h3>
          <p className="text-xs text-slate-500">
            Deterministic contributions from validated ranking components.
          </p>
        </div>

        <div className="space-y-3">
          {currentCandidate.explainability.featureContributions.map((fc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{fc.featureName}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    (Formula Weight: {(fc.weight * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{fc.explanation}</p>
              </div>

              <div className="flex items-center gap-6 shrink-0 font-mono tabular-nums text-right">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sub-Score</span>
                  <span className="text-sm font-semibold text-slate-800">{fc.scoreValue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Contribution</span>
                  <span className={`text-base font-extrabold ${fc.direction === 'penalty' ? 'text-rose-600' : 'text-indigo-700'}`}>
                    {fc.weightedContribution > 0 ? `+${fc.weightedContribution}` : fc.weightedContribution} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Grounded Excerpts & Counterfactual Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grounded Evidence Quotes */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Corroborating Evidence Snippets
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              {currentCandidate.explainability.groundedEvidenceSnippets.length} Grounded Excerpts
            </span>
          </div>

          {currentCandidate.explainability.groundedEvidenceSnippets.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded">
              No corroborating project narratives were found for this profile.
            </div>
          ) : (
            <div className="space-y-3">
              {currentCandidate.explainability.groundedEvidenceSnippets.map((snip, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{snip.relatesToRequirement}</span>
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {snip.strength} Evidence
                    </span>
                  </div>
                  <p className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200/80 leading-relaxed text-[11px]">
                    "{snip.text}"
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Source: {snip.source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Counterfactual Improvement Recommendations */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Actionable Gap Guidance & Potential Gains
              </h3>
              <span className="text-[11px] text-indigo-700 font-semibold font-mono">
                Counterfactual Analysis
              </span>
            </div>

            {currentCandidate.explainability.counterfactualGaps.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded">
                Profile exhibits complete coverage across all mandatory and preferred requirements.
              </div>
            ) : (
              <div className="space-y-3">
                {currentCandidate.explainability.counterfactualGaps.map((gap, idx) => (
                  <div key={idx} className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{gap.requirement}</span>
                      <span className="font-mono text-indigo-700 font-extrabold text-sm">
                        +{gap.potentialScoreGain} pts
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs">{gap.currentStatus}</p>
                    <div className="p-2 bg-white rounded border border-indigo-100 text-slate-800 text-[11px]">
                      <strong>Recruiter Guidance:</strong> {gap.actionableGuidance}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Explanations are strictly derived from deterministic scoring and syntax evidence matching.
          </div>
        </div>
      </div>
    </div>
  );
};
