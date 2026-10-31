import React, { useState } from 'react';
import { Candidate, JobSession, ReviewStatus } from '../types';
import {
  X,
  ShieldAlert,
  Sparkles,
  FileText,
  HelpCircle,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Send,
  Eye,
  ExternalLink,
  Award,
  BookOpen
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  job: JobSession;
  onClose: () => void;
  onUpdateReviewStatus: (candidateId: string, status: ReviewStatus, note?: string) => void;
  onUpdateFlagStatus: (candidateId: string, flagId: string, status: 'confirmed' | 'dismissed', note: string) => void;
  blindReviewMode: boolean;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  job,
  onClose,
  onUpdateReviewStatus,
  onUpdateFlagStatus,
  blindReviewMode
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'explainability' | 'manipulation' | 'fairness' | 'interviews' | 'resume'>('evidence');
  const [newNote, setNewNote] = useState('');
  const [actionChoice, setActionChoice] = useState<ReviewStatus>('reviewed');
  const [flagNoteText, setFlagNoteText] = useState<Record<string, string>>({});

  if (!candidate) return null;

  const displayName = blindReviewMode ? candidate.candidateCode : candidate.name;
  const displayEmail = blindReviewMode ? 'blind-audit@anonymized.org' : candidate.email;
  const displayLocation = blindReviewMode ? 'Redacted Location' : candidate.location;

  const handleSaveReview = () => {
    if (newNote.trim()) {
      onUpdateReviewStatus(candidate.id, actionChoice, newNote.trim());
      setNewNote('');
    } else {
      onUpdateReviewStatus(candidate.id, actionChoice);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                {displayName}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                {candidate.candidateCode}
              </span>
              {candidate.isSyntheticDemo && (
                <span className="text-[11px] text-indigo-700 font-medium">
                  · Synthetic Demo Profile
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>{candidate.appliedJobTitle}</span>
              <span>·</span>
              <span>{candidate.totalYearsExperience} Years Experience</span>
              <span>·</span>
              <span>{displayLocation}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Score Pill */}
            <div className="text-right">
              <div className="text-xs text-slate-500">FairHire-X Score</div>
              <div className="text-xl font-black text-indigo-700 tabular-nums">
                {candidate.scores.overallMatchScore}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 text-xs font-medium text-slate-600 bg-white shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Skill Evidence ({candidate.skillEvidenceList.length})
          </button>
          <button
            onClick={() => setActiveTab('explainability')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'explainability'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Explainability Waterfall
          </button>
          <button
            onClick={() => setActiveTab('manipulation')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'manipulation'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <span>Manipulation Risk</span>
            {candidate.manipulationAssessment.flags.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {candidate.manipulationAssessment.flags.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fairness')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'fairness'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Robustness & Bias
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'interviews'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Interview Questions ({candidate.generatedInterviewQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'resume'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Full Resume & Audit Notes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Evidence Grounding */}
          {activeTab === 'evidence' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Grounding Rule:</span> Skills are only recognized as direct matches if corroborated by project actions or work experience bullets. Isolated list mentions receive an "Insufficient Evidence" status.
              </div>

              <div className="space-y-3">
                {candidate.skillEvidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {ev.skillName}
                        </span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          ({ev.category})
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div>
                        {ev.status === 'direct_match' && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                            Direct Verified Match
                          </span>
                        )}
                        {ev.status === 'transferable' && (
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
                            Transferable Skill Match
                          </span>
                        )}
                        {ev.status === 'insufficient_evidence' && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                            Insufficient Evidence (List Only)
                          </span>
                        )}
                        {ev.status === 'missing' && (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded">
                            Missing From Resume
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Excerpt or Reason */}
                    {ev.evidenceSnippet ? (
                      <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200/60 font-mono leading-relaxed">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                          Source: {ev.sourceSection} · Confidence: {Math.round(ev.confidence * 100)}%
                        </span>
                        "{ev.evidenceSnippet}"
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-slate-400 italic">
                        No supporting text or project bullet was detected for this requirement.
                      </div>
                    )}

                    {ev.ontologyRelatedTo && (
                      <div className="mt-1.5 text-[11px] text-indigo-700 font-medium">
                        Ontology Mapping: {ev.ontologyRelatedTo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Explainability */}
          {activeTab === 'explainability' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Feature Contribution Waterfall
                </h3>
                <p className="text-xs text-slate-500">
                  Exact mathematical breakdown of how the overall score ({candidate.scores.overallMatchScore}/100) was synthesized.
                </p>
              </div>

              <div className="space-y-3">
                {candidate.explainability.featureContributions.map((fc, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 max-w-lg">
                      <div className="font-semibold text-slate-900">
                        {fc.featureName} (Weight: {Math.round(fc.weight * 100)}%)
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        {fc.explanation}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono tabular-nums">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Score Value</div>
                        <div className="font-semibold text-slate-800">{fc.scoreValue}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">Contribution</div>
                        <div className={`font-bold ${fc.direction === 'penalty' ? 'text-rose-600' : 'text-indigo-700'}`}>
                          {fc.weightedContribution > 0 ? `+${fc.weightedContribution}` : fc.weightedContribution}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Counterfactual Gaps / Recommendations */}
              {candidate.explainability.counterfactualGaps.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Counterfactual Gap Analysis & Score Potential
                  </h4>
                  <div className="space-y-2">
                    {candidate.explainability.counterfactualGaps.map((gap, idx) => (
                      <div key={idx} className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-indigo-950">{gap.requirement}</span>
                          <span className="font-mono text-indigo-700 font-bold">+{gap.potentialScoreGain} pts</span>
                        </div>
                        <p className="text-slate-600">{gap.currentStatus}</p>
                        <p className="text-slate-800 font-medium">{gap.actionableGuidance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Manipulation Risk */}
          {activeTab === 'manipulation' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Manipulation Risk Score</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {candidate.manipulationAssessment.riskScore}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Assessed Risk Tier</div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      candidate.manipulationAssessment.riskLevel === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : candidate.manipulationAssessment.riskLevel === 'elevated'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {candidate.manipulationAssessment.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Flags List */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Transparent Integrity Audit Flags ({candidate.manipulationAssessment.flags.length})
                </h4>

                {candidate.manipulationAssessment.flags.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
                    No suspicious keyword density, prompt injections, or ungrounded skill stuffing anomalies detected.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {candidate.manipulationAssessment.flags.map(flag => (
                      <div
                        key={flag.id}
                        className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{flag.title}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            {flag.severity}
                          </span>
                        </div>
                        <p className="text-slate-600">{flag.description}</p>
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800 font-mono text-[11px]">
                          Excerpt: {flag.evidenceExcerpt}
                        </div>

                        {/* Auditor Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                          <div className="text-[11px] text-slate-500">
                            Status: <span className="font-semibold capitalize">{flag.status}</span>
                            {flag.reviewerNote && ` · Note: ${flag.reviewerNote}`}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Auditor reason..."
                              value={flagNoteText[flag.id] || ''}
                              onChange={(e) => setFlagNoteText({ ...flagNoteText, [flag.id]: e.target.value })}
                              className="px-2 py-1 text-xs border border-slate-200 rounded text-slate-700 w-44"
                            />
                            <button
                              onClick={() => onUpdateFlagStatus(candidate.id, flag.id, 'confirmed', flagNoteText[flag.id] || 'Confirmed by auditor')}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded font-medium border border-rose-200 text-xs"
                            >
                              Confirm Risk
                            </button>
                            <button
                              onClick={() => onUpdateFlagStatus(candidate.id, flag.id, 'dismissed', flagNoteText[flag.id] || 'False positive dismissed')}
                              className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium text-xs"
                            >
                              Dismiss Flag
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Fairness & Robustness */}
          {activeTab === 'fairness' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-slate-800">
                  Counterfactual Robustness Audit (Hypothesis H3)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  The candidate's resume was tested through controlled counterfactual perturbations where qualifications were held constant while non-job-relevant demographic cues were perturbed.
                </p>
              </div>

              {candidate.counterfactualVariants.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
                  No counterfactual test runs recorded for this profile yet. You can run automated perturbation in the Fairness & Robustness Lab.
                </div>
              ) : (
                <div className="space-y-3">
                  {candidate.counterfactualVariants.map(v => (
                    <div
                      key={v.variantId}
                      className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{v.attributeChanged}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {v.originalValue} <span className="text-indigo-600 font-bold">→</span> {v.perturbedValue}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 font-mono tabular-nums text-right">
                        <div>
                          <div className="text-[10px] text-slate-400">Score Delta</div>
                          <div className="font-semibold text-slate-800">
                            {v.scoreDelta === 0 ? '±0 pts' : `${v.scoreDelta > 0 ? '+' : ''}${v.scoreDelta} pts`}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">Rank Shift</div>
                          <div className="font-semibold text-emerald-600">
                            {v.rankDisplacement === 0 ? '0 ranks' : `${v.rankDisplacement} ranks`}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Stable
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Interview Questions */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                Grounded questions generated specifically from verified projects and identified skill gaps.
              </div>

              {candidate.generatedInterviewQuestions.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
                  No questions currently generated for this candidate. Use the Interview Questions generator tab to synthesize or customize questions.
                </div>
              ) : (
                <div className="space-y-3">
                  {candidate.generatedInterviewQuestions.map(q => (
                    <div key={q.id} className="p-4 rounded-lg border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                          {q.type} Question · {q.targetSkillOrRequirement}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium text-sm leading-snug">
                        "{q.question}"
                      </p>
                      {q.groundedResumeExcerpt && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200/60 font-mono">
                          Triggered by: "{q.groundedResumeExcerpt}"
                        </div>
                      )}
                      <p className="text-[11px] text-slate-500 italic">
                        Rationale: {q.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Resume & Audit Notes */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              {/* Existing Recruiter Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Auditor & Recruiter Decision Log
                </h4>
                {candidate.reviewerNotes.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 italic">No logged notes yet.</div>
                ) : (
                  <div className="space-y-2">
                    {candidate.reviewerNotes.map(n => (
                      <div key={n.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span className="font-semibold text-slate-700">{n.author}</span>
                          <span className="font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-800">{n.note}</p>
                        {n.action && (
                          <div className="text-[11px] text-indigo-700 font-medium font-mono">
                            Action: {n.action}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Text View */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Original Parsed Resume Text
                </h4>
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {candidate.rawResumeText}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer: Human in the loop review decision */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Review Decision:
            </label>
            <select
              value={actionChoice}
              onChange={(e) => setActionChoice(e.target.value as ReviewStatus)}
              className="text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="reviewed">Mark as Reviewed</option>
              <option value="shortlisted">Shortlist for Interview</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="further_evidence_needed">Flag: Further Evidence Needed</option>
              <option value="pending">Keep in Pending Queue</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input
              type="text"
              placeholder="Add review audit rationale..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded bg-white w-64 text-slate-800"
            />
            <button
              onClick={handleSaveReview}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors whitespace-nowrap shadow-xs"
            >
              Save Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
