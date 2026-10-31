import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import {
  Settings,
  Shield,
  Lock,
  Trash2,
  Download,
  FileCode,
  Terminal,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface SettingsViewProps {
  userRole: 'Recruiter' | 'Lead Researcher' | 'Ethics Auditor';
  setUserRole: (role: 'Recruiter' | 'Lead Researcher' | 'Ethics Auditor') => void;
  blindReviewMode: boolean;
  setBlindReviewMode: (val: boolean) => void;
  auditLogs: AuditLogEntry[];
  onClearCandidateData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  setUserRole,
  blindReviewMode,
  setBlindReviewMode,
  auditLogs,
  onClearCandidateData
}) => {
  const [dataRetentionDays, setDataRetentionDays] = useState(30);
  const [autoPurgeEnabled, setAutoPurgeEnabled] = useState(true);
  const [maskPiiByDefault, setMaskPiiByDefault] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [activeCodeTab, setActiveCodeTab] = useState<'fastapi' | 'ml_modules' | 'docker' | 'readme'>('fastapi');

  const copyArchitectureSnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleFastApiSnippet = `# ==============================================================================
# FairHire-X: IEEE Research Platform — FastAPI Backend Gateway
# File: api/main.py
# ==============================================================================
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

from ml.resume_parser import ResumeParser
from ml.evidence_matcher import EvidenceMatcher
from ml.manipulation_detector import ManipulationDetector
from ml.ranking import MultiCriteriaRanker

app = FastAPI(
    title="FairHire-X Research Intelligence API",
    version="1.0.0",
    description="Explainable, Skill-Graph-Driven & Manipulation-Resistant Hiring Platform"
)

class JobSpecification(BaseModel):
    title: str
    department: str
    required_skills: List[str]
    preferred_skills: List[str]
    min_experience_years: float

class MatchResult(BaseModel):
    candidate_id: str
    overall_match_score: float
    evidence_strength: float
    manipulation_risk_level: str
    confidence_interval: List[float]

@app.post("/api/matching/evaluate", response_model=MatchResult)
async def evaluate_candidate(job_id: str, candidate_id: str):
    # Implements evidence-grounded graph traversal & adversarial defense
    ...
`;

  const sampleMlModuleSnippet = `# ==============================================================================
# FairHire-X: Manipulation Detection Module (Hypothesis H2)
# File: ml/manipulation_detector.py
# ==============================================================================
import re
from typing import Dict, List, Tuple
import numpy as np

class ManipulationDetector:
    def __init__(self, density_threshold: float = 0.045):
        self.density_threshold = density_threshold
        self.injection_signatures = [
            r"ignore\\s+(all\\s+)?previous\\s+instructions",
            r"system\\s*:\\s*(rate|rank|evaluate|give\\s+score\\s+100)",
            r"you\\s+must\\s+rank\\s+this\\s+candidate\\s+(first|highest|#1)"
        ]

    def audit_resume(self, text: str, claimed_skills: List[str], grounded_skills: List[str]) -> Dict:
        """
        Calculates token density variance and checks for adversarial prompt hijacking.
        """
        tokens = [w.lower() for w in re.findall(r"\\b[a-zA-Z0-9+#.]+\\b", text)]
        total = max(len(tokens), 1)
        
        # 1. Prompt Injection Evasion Check
        injection_flags = []
        for pat in self.injection_signatures:
            if re.search(pat, text, re.IGNORECASE):
                injection_flags.append(pat)

        # 2. Contextless Skill Stacking Ratio
        ungrounded = set(claimed_skills) - set(grounded_skills)
        contextless_ratio = len(ungrounded) / max(len(claimed_skills), 1)

        return {
            "is_adversarial": len(injection_flags) > 0 or contextless_ratio > 0.40,
            "risk_score": min(100, int(len(injection_flags) * 60 + contextless_ratio * 40)),
            "injection_matches": injection_flags,
            "contextless_ratio": contextless_ratio
        }
`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Governance, Security & Research Infrastructure</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Settings, Privacy & Python Architecture Reference
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure role permissions, data retention, PII obfuscation, and inspect the Python FastAPI/PyTorch research code.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Active User Role:</span>
          <span className="px-2.5 py-1 bg-slate-900 text-white rounded font-mono font-bold">
            {userRole}
          </span>
        </div>
      </div>

      {/* Role-Based Access & Privacy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Permissions Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60 cursor-pointer">
              <input
                type="radio"
                name="roleOption"
                checked={userRole === 'Lead Researcher'}
                onChange={() => setUserRole('Lead Researcher')}
                className="mt-0.5 text-indigo-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">Lead Researcher</span>
                <span className="text-slate-500">
                  Full permissions: Configure ontology graphs, execute batch benchmark suites, modify scoring weights, export experiments.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60 cursor-pointer">
              <input
                type="radio"
                name="roleOption"
                checked={userRole === 'Recruiter'}
                onChange={() => setUserRole('Recruiter')}
                className="mt-0.5 text-indigo-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">Talent Recruiter</span>
                <span className="text-slate-500">
                  Screening & interviews: Upload resumes, inspect candidate match evidence, schedule interviews, add review signatures.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60 cursor-pointer">
              <input
                type="radio"
                name="roleOption"
                checked={userRole === 'Ethics Auditor'}
                onChange={() => setUserRole('Ethics Auditor')}
                className="mt-0.5 text-indigo-600"
              />
              <div>
                <span className="font-bold text-slate-900 block">Ethics & Integrity Auditor</span>
                <span className="text-slate-500">
                  Oversight & robustness: Confirm/dismiss manipulation risk flags, run counterfactual fairness tests, inspect audit logs.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Data Retention & Privacy Notice */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Data Retention & Privacy Safeguards</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900 block">Blind Recruitment Masking</span>
                <span className="text-slate-500">Hide personal names, photos, and location during initial screening.</span>
              </div>
              <button
                onClick={() => setBlindReviewMode(!blindReviewMode)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  blindReviewMode ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {blindReviewMode ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <span className="font-semibold text-slate-900 block">Automated Temporary Storage Purge</span>
                <span className="text-slate-500">Deletes processed resume texts after 30 days.</span>
              </div>
              <span className="font-mono text-emerald-700 font-bold">30 Days</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">
                Purge all temporary uploaded candidate files immediately:
              </span>
              <button
                onClick={onClearCandidateData}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Demo Pool</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter & Auditor Activity Audit Log */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Immutable Recruiter & Auditor Action Ledger
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {auditLogs.length} Logged Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Candidate Target</th>
                <th className="py-2.5 px-3">Details & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 text-slate-800 font-semibold">{log.userRole}</td>
                  <td className="py-2.5 px-3 text-indigo-700 font-semibold">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-700">{log.candidateCode || '—'}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Python ML Modules & Docker Reference for IEEE Project */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Python FastAPI & PyTorch Research Reference Architecture</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Source code architecture for deployment on server GPU clusters or IEEE peer review verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyArchitectureSnippet(activeCodeTab === 'fastapi' ? sampleFastApiSnippet : sampleMlModuleSnippet)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedCode ? 'Copied' : 'Copy Source'}</span>
            </button>
          </div>
        </div>

        {/* Code Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveCodeTab('fastapi')}
            className={`pb-2 font-medium border-b-2 transition-colors ${
              activeCodeTab === 'fastapi' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500'
            }`}
          >
            FastAPI Server (api/main.py)
          </button>
          <button
            onClick={() => setActiveCodeTab('ml_modules')}
            className={`pb-2 font-medium border-b-2 transition-colors ${
              activeCodeTab === 'ml_modules' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500'
            }`}
          >
            Adversarial Detector (ml/manipulation_detector.py)
          </button>
        </div>

        <pre className="p-4 rounded-lg bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto max-h-72">
          {activeCodeTab === 'fastapi' ? sampleFastApiSnippet : sampleMlModuleSnippet}
        </pre>
      </div>
    </div>
  );
};
