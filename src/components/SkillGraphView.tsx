import React, { useState } from 'react';
import { JobSession, Candidate, SkillEvidence } from '../types';
import { SKILL_ONTOLOGY } from '../ml/engine';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  GitBranch,
  ShieldCheck,
  Search
} from 'lucide-react';

interface SkillGraphViewProps {
  job: JobSession;
  candidates: Candidate[];
  selectedCandidateId: string;
  onSelectCandidateId: (id: string) => void;
  blindReviewMode: boolean;
}

export const SkillGraphView: React.FC<SkillGraphViewProps> = ({
  job,
  candidates,
  selectedCandidateId,
  onSelectCandidateId,
  blindReviewMode
}) => {
  const [matchMode, setMatchMode] = useState<'evidence_aware' | 'baseline_cosine'>('evidence_aware');
  const [selectedSkillNode, setSelectedSkillNode] = useState<string | null>(job.requiredSkills[0]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'required' | 'preferred'>('all');

  const currentCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  const displayName = blindReviewMode ? currentCandidate.candidateCode : currentCandidate.name;

  const currentEvidence = currentCandidate.skillEvidenceList;

  // Selected skill details
  const ontologyNode = selectedSkillNode ? SKILL_ONTOLOGY[selectedSkillNode] : null;
  const activeEv = currentEvidence.find(e => e.skillName === selectedSkillNode);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <Network className="w-3.5 h-3.5" />
            <span>Core Research Module · Hypothesis H1</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Evidence-Grounded Skill Ontology Graph
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Distinguishes authenticated project deliverables from isolated keyword mentions using hierarchical ontology traversal.
          </p>
        </div>

        {/* Candidate Selector & Baseline Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Candidate Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Candidate:</span>
            <select
              value={currentCandidate.id}
              onChange={(e) => onSelectCandidateId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-md py-1.5 px-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {blindReviewMode ? c.candidateCode : c.name} ({c.scores.overallMatchScore}%)
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setMatchMode('evidence_aware')}
              className={`px-3 py-1 rounded-md transition-colors ${
                matchMode === 'evidence_aware'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Proposed Evidence-Aware Mode
            </button>
            <button
              onClick={() => setMatchMode('baseline_cosine')}
              className={`px-3 py-1 rounded-md transition-colors ${
                matchMode === 'baseline_cosine'
                  ? 'bg-slate-800 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baseline S-BERT Mode
            </button>
          </div>
        </div>
      </div>

      {/* Mode Comparison Alert Banner */}
      <div className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
        matchMode === 'evidence_aware'
          ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950'
          : 'bg-amber-50/60 border-amber-200 text-amber-950'
      }`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {matchMode === 'evidence_aware' ? (
            <>
              <strong className="font-semibold">FairHire-X Graph Formulation:</strong> Every required competency must be backed by authenticated project sentences. Transferable competencies ({'<->'} paths) provide partial qualification credit (0.65x) rather than blind 100% assumption. Isolated resume keyword lists receive "Insufficient Evidence".
            </>
          ) : (
            <>
              <strong className="font-semibold">Baseline Sentence Transformer Behavior:</strong> Standard dense embeddings compress entire resumes into vectors without structural grounding, causing candidates who repeatedly mention keywords (even in white font or isolated lists) to obtain deceptively high similarity scores.
            </>
          )}
        </div>
      </div>

      {/* Main Interactive Grid: Interactive Graph + Node Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Interactive Knowledge & Evidence Topology
                </h3>
                <p className="text-xs text-slate-500">
                  Click any skill node to inspect resume evidence snippets and ontology relationships.
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Direct Match</span>
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                  <span>Transferable</span>
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span>List Only</span>
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
                  <span>Missing</span>
                </span>
              </div>
            </div>

            {/* SVG Interactive Ontology Network */}
            <div className="border border-slate-100 rounded-lg bg-slate-950 p-4 relative overflow-hidden min-h-[380px] flex items-center justify-center">
              <svg className="w-full h-[380px]" viewBox="0 0 680 360">
                <defs>
                  <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Central Job Node */}
                <g transform="translate(340, 180)">
                  <circle r="46" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                  <text textAnchor="middle" y="-6" fill="#ffffff" fontSize="10" fontWeight="bold">TARGET ROLE</text>
                  <text textAnchor="middle" y="10" fill="#a5b4fc" fontSize="8" fontWeight="medium">Senior ML Engineer</text>
                  <text textAnchor="middle" y="24" fill="#64748b" fontSize="7 font-mono">{job.requiredSkills.length} Requirements</text>
                </g>

                {/* Satellite Skill Nodes (Calculated in circle around center) */}
                {job.requiredSkills.concat(job.preferredSkills.slice(0, 3)).map((skill, index, arr) => {
                  const angle = (index / arr.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 135;
                  const x = 340 + radius * Math.cos(angle);
                  const y = 180 + radius * Math.sin(angle);

                  const ev = currentEvidence.find(e => e.skillName === skill);
                  const isSelected = selectedSkillNode === skill;

                  // Determine color based on mode and status
                  let nodeColor = '#64748b'; // missing
                  let strokeColor = '#334155';

                  if (matchMode === 'baseline_cosine') {
                    // Baseline marks everything that has text match as full green
                    nodeColor = ev && ev.status !== 'missing' ? '#10b981' : '#64748b';
                    strokeColor = nodeColor;
                  } else {
                    if (ev?.status === 'direct_match') {
                      nodeColor = '#10b981'; // Green
                      strokeColor = '#059669';
                    } else if (ev?.status === 'transferable') {
                      nodeColor = '#6366f1'; // Indigo
                      strokeColor = '#4f46e5';
                    } else if (ev?.status === 'insufficient_evidence') {
                      nodeColor = '#f59e0b'; // Amber
                      strokeColor = '#d97706';
                    } else {
                      nodeColor = '#475569'; // Gray
                      strokeColor = '#334155';
                    }
                  }

                  return (
                    <g key={skill} onClick={() => setSelectedSkillNode(skill)} className="cursor-pointer group">
                      {/* Connection Line */}
                      <line
                        x1="340"
                        y1="180"
                        x2={x}
                        y2={y}
                        stroke={isSelected ? '#818cf8' : strokeColor}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray={ev?.status === 'transferable' ? '3,3' : 'none'}
                        opacity={isSelected ? 0.9 : 0.45}
                      />

                      {/* Skill Circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 28 : 24}
                        fill="#0f172a"
                        stroke={isSelected ? '#ffffff' : nodeColor}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-200 group-hover:scale-105"
                      />

                      {/* Status indicator pip */}
                      <circle cx={x + 16} cy={y - 16} r="4" fill={nodeColor} />

                      {/* Skill Label */}
                      <text
                        x={x}
                        y={y + 1}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="600"
                        className="select-none"
                      >
                        {skill.length > 13 ? `${skill.slice(0, 11)}..` : skill}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* In-Graph Candidate Tag */}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[11px] text-slate-300 font-mono">
                Candidate: <span className="text-white font-bold">{displayName}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Graph Traversals verify parent, child, and transferable peer relationships.</span>
            <span className="font-mono text-indigo-700 font-semibold">13 Ontology Entries Synced</span>
          </div>
        </div>

        {/* Selected Skill Evidence Drawer (1 Column) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          {selectedSkillNode && ontologyNode ? (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ontology Inspector
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedSkillNode}
                </h3>
                <span className="inline-block mt-1 text-xs text-indigo-700 font-medium">
                  Category: {ontologyNode.category}
                </span>
              </div>

              {/* Evidence Status in Selected Candidate */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                  <span>Candidate Evidence State</span>
                  <span className="font-mono tabular-nums text-[11px]">
                    {activeEv ? `${Math.round(activeEv.confidence * 100)}% Confidence` : '0%'}
                  </span>
                </div>

                <div>
                  {activeEv?.status === 'direct_match' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Direct Verified Match
                    </span>
                  )}
                  {activeEv?.status === 'transferable' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-100 border border-indigo-300 px-2 py-0.5 rounded">
                      <GitBranch className="w-3.5 h-3.5" />
                      Transferable Skill
                    </span>
                  )}
                  {activeEv?.status === 'insufficient_evidence' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Insufficient Evidence (List Only)
                    </span>
                  )}
                  {(!activeEv || activeEv?.status === 'missing') && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded">
                      Missing from Profile
                    </span>
                  )}
                </div>

                {activeEv?.evidenceSnippet && (
                  <div className="mt-2 text-xs text-slate-700 font-mono bg-white p-2.5 rounded border border-slate-200/80 leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Corroborating Excerpt ({activeEv.sourceSection}):
                    </span>
                    "{activeEv.evidenceSnippet}"
                  </div>
                )}
              </div>

              {/* Ontology Relatives */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Ontology Parents:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ontologyNode.parents.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Sub-Skills & Children:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ontologyNode.children.map(c => (
                      <span key={c} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Transferable Skill Paths:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ontologyNode.transferableTo.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded font-mono text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select any node in the knowledge network to inspect evidence grounding.
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Extraction Method: Exact n-gram tokenization + syntax dependency tree parsing.
          </div>
        </div>
      </div>
    </div>
  );
};
