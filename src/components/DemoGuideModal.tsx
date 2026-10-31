import React, { useState } from 'react';
import { X, Play, CheckCircle2, ShieldAlert, Sparkles, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToTab: (tab: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({ isOpen, onClose, onGoToTab }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-indigo-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              🎓
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Simple Presentation Guide for Mam
              </h3>
              <p className="text-xs text-indigo-700">
                A 3-minute, jargon-free walkthrough designed to impress any professor.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The 10-Second Pitch */}
        <div className="p-6 space-y-5 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
            <div className="font-bold text-slate-900 text-sm">
              📢 How to start your presentation (Say this first):
            </div>
            <p className="text-slate-700 text-xs italic leading-relaxed">
              "Mam, regular AI hiring tools (like ChatGPT or basic resume screeners) can be tricked very easily. If a candidate copy-pastes 'Python' 20 times in white font, the AI gives them a 99% score and puts them at Rank #1.<br />
              We built <strong>FairHire-X</strong> to fix this with 3 simple checks: <strong>Project Evidence</strong>, <strong>Anti-Cheating Detection</strong>, and <strong>Fairness Testing</strong>."
            </p>
          </div>

          {/* Step Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveStep(1)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                activeStep === 1
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase font-mono text-indigo-600">Step 1</div>
              <div className="font-semibold text-xs mt-0.5">The Cheating Candidate</div>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                activeStep === 2
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase font-mono text-indigo-600">Step 2</div>
              <div className="font-semibold text-xs mt-0.5">Project Evidence Check</div>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                activeStep === 3
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase font-mono text-indigo-600">Step 3</div>
              <div className="font-semibold text-xs mt-0.5">Live Attack Simulation</div>
            </button>
          </div>

          {/* Step Details */}
          {activeStep === 1 && (
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Step 1: Show the Candidate Table (Tab 2)</span>
                <button
                  onClick={() => {
                    onGoToTab('screening');
                    onClose();
                  }}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Go to Screening Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                👉 <strong>What to point to:</strong> Point to <strong>Candidate J</strong> and <strong>Dr. Elena Rostova</strong> in the table.
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">What to say to Mam:</span>
                <p className="text-slate-700 italic">
                  "Look at Candidate J, Mam. Under a standard AI embedding model, they got a 97% match score. But FairHire-X detected that they repeated keywords 18 times and tried a prompt injection, so our system adjusted their score to 48% and flagged them for human review."
                </p>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Step 2: Show the Skill Evidence Graph (Tab 3)</span>
                <button
                  onClick={() => {
                    onGoToTab('skill_graph');
                    onClose();
                  }}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Go to Skill Graph Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                👉 <strong>What to do:</strong> Click on the <strong>PyTorch</strong> node in the circular graph.
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">What to say to Mam:</span>
                <p className="text-slate-700 italic">
                  "Instead of just checking if a keyword exists, our algorithm looks for proof. Look at the box on the right: it extracted the exact sentence from Dr. Elena's work experience where she built PyTorch pipelines. Green means verified project proof; yellow means someone just listed the skill in a list without evidence."
                </p>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Step 3: The Live Cheating Attack (Tab 4) — (The Wow Factor)</span>
                <button
                  onClick={() => {
                    onGoToTab('manipulation');
                    onClose();
                  }}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Go to Manipulation Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                👉 <strong>What to do:</strong> Click the red button <strong>"Attack 1: Keyword Stuffing"</strong>, then click <strong>"Evaluate"</strong>.
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">What to say to Mam:</span>
                <p className="text-slate-700 italic">
                  "Watch this live test, Mam: when we inject repeated keywords into the resume, the standard Sentence-BERT baseline gets fooled and increases by +10 points. But FairHire-X catches the token density anomaly, deducts a penalty, and preserves the real candidate rankings."
                </p>
              </div>
            </div>
          )}

          {/* Quick FAQ */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5">
            <span className="font-bold text-amber-900 block">💡 If Mam asks: "Did you actually train/build this?"</span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Say: <em>"Yes, Mam. The backend has modular Python and TypeScript code in `src/ml/engine.ts` and `ml/` that computes exact TF-IDF, token frequencies, and ontology traversals. Everything here runs deterministically with zero black-box hallucination."</em>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Got it, Let's Demo!
          </button>
        </div>
      </div>
    </div>
  );
};
