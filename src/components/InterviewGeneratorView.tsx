import React, { useState } from 'react';
import { JobSession, Candidate, InterviewQuestion } from '../types';
import {
  HelpCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  Info,
  CheckCircle2
} from 'lucide-react';

interface InterviewGeneratorViewProps {
  job: JobSession;
  candidates: Candidate[];
  selectedCandidateId: string;
  onSelectCandidateId: (id: string) => void;
  onSaveCandidateQuestions: (candidateId: string, questions: InterviewQuestion[]) => void;
  blindReviewMode: boolean;
}

export const InterviewGeneratorView: React.FC<InterviewGeneratorViewProps> = ({
  job,
  candidates,
  selectedCandidateId,
  onSelectCandidateId,
  onSaveCandidateQuestions,
  blindReviewMode
}) => {
  const currentCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];
  const displayName = blindReviewMode ? currentCandidate.candidateCode : currentCandidate.name;

  const [questions, setQuestions] = useState<InterviewQuestion[]>(
    currentCandidate.generatedInterviewQuestions.length > 0
      ? currentCandidate.generatedInterviewQuestions
      : [
          {
            id: 'q-auto-01',
            type: 'technical',
            question: `In your PyTorch implementations, how did you handle gradient clipping and memory optimization for large batch sizes?`,
            targetSkillOrRequirement: 'PyTorch & Deep Learning',
            groundedResumeExcerpt: 'Architected deep learning training pipelines for text robustness.',
            rationale: 'Validates that the candidate possesses direct hands-on PyTorch engineering competence beyond calling standard APIs.',
            difficulty: 'Advanced'
          },
          {
            id: 'q-auto-02',
            type: 'project-based',
            question: `Could you walk us through the architectural trade-offs you made when containerizing services with Docker and deploying to Kubernetes?`,
            targetSkillOrRequirement: 'Docker & Containers',
            groundedResumeExcerpt: 'Containerized distributed evaluation suites using Docker and deployed automated inference benchmarks.',
            rationale: 'Assesses production readiness and distributed deployment decisions.',
            difficulty: 'Intermediate'
          },
          {
            id: 'q-auto-03',
            type: 'problem-solving',
            question: `If an NLP model exhibits unexpected bias across demographic dialect subgroups, how would you construct a counterfactual test harness to isolate whether the disparity stems from tokenization or embedding representation?`,
            targetSkillOrRequirement: 'AI Fairness & Robustness',
            rationale: 'Directly examines candidate methodology for algorithmic auditing and mitigation.',
            difficulty: 'Advanced'
          },
          {
            id: 'q-auto-04',
            type: 'behavioral',
            question: `Describe a scenario where product stakeholders wanted to deploy an ML model rapidly, but your robustness or fairness evaluation revealed borderline vulnerabilities. How did you advocate for engineering integrity?`,
            targetSkillOrRequirement: 'Ethics & Communication',
            rationale: 'Evaluates candidate communication and ethical decision-making in cross-functional organizations.',
            difficulty: 'Intermediate'
          }
        ]
  );

  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestionText, setEditQuestionText] = useState('');

  // Handle candidate change
  const handleCandidateChange = (id: string) => {
    onSelectCandidateId(id);
    const cand = candidates.find(c => c.id === id);
    if (cand && cand.generatedInterviewQuestions.length > 0) {
      setQuestions(cand.generatedInterviewQuestions);
    }
  };

  const startEdit = (q: InterviewQuestion) => {
    setEditingId(q.id);
    setEditQuestionText(q.question);
  };

  const saveEdit = (id: string) => {
    const updated = questions.map(q => q.id === id ? { ...q, question: editQuestionText } : q);
    setQuestions(updated);
    setEditingId(null);
    onSaveCandidateQuestions(currentCandidate.id, updated);
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    onSaveCandidateQuestions(currentCandidate.id, updated);
  };

  const addCustomQuestion = () => {
    const newQ: InterviewQuestion = {
      id: `q-cust-${Date.now()}`,
      type: 'technical',
      question: 'Provide a concrete example of how you verified model robustness under edge-case data distributions.',
      targetSkillOrRequirement: 'Model Robustness Verification',
      rationale: 'Custom verification probe added by interviewer.',
      difficulty: 'Intermediate'
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    onSaveCandidateQuestions(currentCandidate.id, updated);
  };

  // Export questions to Markdown
  const exportQuestionsMarkdown = () => {
    let md = `# FairHire-X Interview Guide: ${job.title}\n`;
    md += `**Candidate:** ${displayName} (${currentCandidate.candidateCode})\n`;
    md += `**Overall Fit Score:** ${currentCandidate.scores.overallMatchScore}/100\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## Role-Specific Grounded Questions\n\n`;

    questions.forEach((q, idx) => {
      md += `### ${idx + 1}. [${q.type.toUpperCase()}] ${q.targetSkillOrRequirement} (${q.difficulty})\n`;
      md += `**Question:** "${q.question}"\n\n`;
      if (q.groundedResumeExcerpt) {
        md += `> **Trigger Excerpt:** "${q.groundedResumeExcerpt}"\n\n`;
      }
      md += `*Rationale:* ${q.rationale}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Structured Human-in-the-Loop Inquiry · Research Feature</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Evidence-Grounded Interview Question Generator
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Generates role-specific behavioral, technical, and project inquiries grounded directly in resume evidence. Free from demographic inference.
          </p>
        </div>

        {/* Candidate Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Candidate:</span>
            <select
              value={currentCandidate.id}
              onChange={(e) => handleCandidateChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {blindReviewMode ? c.candidateCode : c.name} (Score: {c.scores.overallMatchScore}%)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={exportQuestionsMarkdown}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied Guide!' : 'Copy Interview Guide'}</span>
          </button>

          <button
            onClick={addCustomQuestion}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Question</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                <span className={`font-semibold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded ${
                  q.type === 'technical' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  q.type === 'project-based' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  q.type === 'problem-solving' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {q.type}
                </span>
                <span className="font-semibold text-slate-800">{q.targetSkillOrRequirement}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {q.difficulty}
                </span>
                <button
                  onClick={() => startEdit(q)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                  title="Edit question text"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Remove question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Question Content */}
            {editingId === q.id ? (
              <div className="space-y-2">
                <textarea
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 text-xs border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(q.id)}
                    className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-900 leading-snug">
                "{q.question}"
              </p>
            )}

            {/* Trigger Excerpt */}
            {q.groundedResumeExcerpt && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/60 font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Triggered by Resume Excerpt:
                </span>
                "{q.groundedResumeExcerpt}"
              </div>
            )}

            {/* Rationale */}
            <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
              <strong>Evaluation Purpose:</strong> {q.rationale}
            </div>
          </div>
        ))}
      </div>

      {/* Ethical Guardrail Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          Compliance Check: Questions are strictly restricted to verifiable technical milestones and problem-solving methodologies. Questions never evaluate personal background or demographic inferences.
        </span>
      </div>
    </div>
  );
};
