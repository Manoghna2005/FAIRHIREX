import React, { useState } from 'react';
import { JobSession } from '../types';
import { X, Plus, Sparkles, Briefcase } from 'lucide-react';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (session: JobSession) => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  onCreateSession
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Applied AI Research');
  const [seniority, setSeniority] = useState<'Junior' | 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Lead'>('Senior');
  const [description, setDescription] = useState('');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('PyTorch, Deep Learning, AI Fairness & Robustness, Python, Docker & Containers');
  const [preferredSkillsInput, setPreferredSkillsInput] = useState('FastAPI, Kubernetes, Transformers & LLMs, PostgreSQL & SQL');
  const [minExperienceYears, setMinExperienceYears] = useState(4);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const reqSkills = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const prefSkills = preferredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const newSession: JobSession = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      department,
      seniority,
      description: description.trim() || `Position seeking ${seniority} ${title} to contribute to high-integrity engineering.`,
      requiredSkills: reqSkills,
      preferredSkills: prefSkills,
      minExperienceYears,
      targetEducation: ["Master's or Ph.D. in quantitative discipline"],
      createdAt: new Date().toISOString().split('T')[0],
      totalCandidates: 0,
      reviewedCandidates: 0,
      activeStatus: 'active',
      scoringWeights: {
        semanticRelevance: 0.25,
        skillCoverage: 0.35,
        evidenceStrength: 0.25,
        experienceFit: 0.15
      }
    };

    onCreateSession(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Create New Screening Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Job Title:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lead Research Engineer (Adversarial AI)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Department:
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Seniority Level:
              </label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Staff / Principal">Staff / Principal</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Job Description:
            </label>
            <textarea
              rows={3}
              placeholder="Detailed responsibilities, expectations, and role scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Required Skills (comma-separated):
            </label>
            <input
              type="text"
              value={requiredSkillsInput}
              onChange={(e) => setRequiredSkillsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Directly mapped to FairHire-X Skill Ontology nodes.
            </span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Preferred Skills (comma-separated):
            </label>
            <input
              type="text"
              value={preferredSkillsInput}
              onChange={(e) => setPreferredSkillsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Minimum Required Experience (Years):
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={minExperienceYears}
              onChange={(e) => setMinExperienceYears(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-slate-300 rounded text-slate-800 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Initialize Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
