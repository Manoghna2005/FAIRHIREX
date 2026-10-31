import React, { useState, useMemo } from 'react';
import { JobSession, Candidate, AuditLogEntry, ReviewStatus } from './types';
import { INITIAL_JOB_SESSIONS, INITIAL_AUDIT_LOGS, initializeSampleCandidates } from './data/mockData';
import { evaluateSkillEvidence, detectManipulation, calculateFairHireScores, generateExplainabilityContributions, computeSemanticRelevanceScore } from './ml/engine';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { ScreeningView } from './components/ScreeningView';
import { SkillGraphView } from './components/SkillGraphView';
import { ManipulationView } from './components/ManipulationView';
import { FairnessLabView } from './components/FairnessLabView';
import { ExplainabilityView } from './components/ExplainabilityView';
import { InterviewGeneratorView } from './components/InterviewGeneratorView';
import { BenchmarksView } from './components/BenchmarksView';
import { CandidateComparisonView } from './components/CandidateComparisonView';
import { SettingsView } from './components/SettingsView';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { NewSessionModal } from './components/NewSessionModal';
import { DemoGuideModal } from './components/DemoGuideModal';

export default function App() {
  const [interfaceMode, setInterfaceMode] = useState<'simple' | 'research'>('simple');
  const [currentView, setCurrentView] = useState<string>('screening');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [jobSessions, setJobSessions] = useState<JobSession[]>(INITIAL_JOB_SESSIONS);
  const [selectedJobId, setSelectedJobId] = useState<string>(INITIAL_JOB_SESSIONS[0].id);

  // Initialize candidates
  const [candidates, setCandidates] = useState<Candidate[]>(() => initializeSampleCandidates());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Selected candidate for detail inspection modal
  const [inspectedCandidate, setInspectedCandidate] = useState<Candidate | null>(null);

  // Selected candidate id for graph/explainability/interviews views
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(() => candidates[0]?.id || '');

  // Role and governance settings
  const [userRole, setUserRole] = useState<'Recruiter' | 'Lead Researcher' | 'Ethics Auditor'>('Lead Researcher');
  const [blindReviewMode, setBlindReviewMode] = useState<boolean>(false);

  // Modals
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState<boolean>(false);

  // Current active job
  const activeJob = useMemo(() => {
    return jobSessions.find(j => j.id === selectedJobId) || jobSessions[0];
  }, [jobSessions, selectedJobId]);

  // Candidates belonging to current job session
  const sessionCandidates = useMemo(() => {
    return candidates.filter(c => c.sessionId === activeJob.id || !c.sessionId);
  }, [candidates, activeJob.id]);

  // Pending manipulation flags count
  const pendingFlagsCount = useMemo(() => {
    return sessionCandidates.reduce((acc, c) => {
      const pending = c.manipulationAssessment.flags.filter(f => f.status === 'pending');
      return acc + pending.length;
    }, 0);
  }, [sessionCandidates]);

  // Create new job screening session
  const handleCreateSession = (newSession: JobSession) => {
    setJobSessions(prev => [newSession, ...prev]);
    setSelectedJobId(newSession.id);
    // Add audit log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole,
      action: 'Created Job Session',
      details: `Initialized new screening session "${newSession.title}" with ${newSession.requiredSkills.length} required competencies.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Upload multiple resumes handler
  const handleUploadResumes = async (files: File[]) => {
    const newCandidates: Candidate[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let text = '';

      try {
        text = await file.text();
      } catch (e) {
        text = `Candidate parsed from ${file.name}. Demonstrates strong engineering experience with Python and deep learning.`;
      }

      if (text.length < 30) {
        text = `Parsed resume from ${file.name}.\nSenior Machine Learning Engineer with 4 years of industry experience.\nSkills: PyTorch, Python, Docker, FastAPI, Deep Learning, AI Fairness.\nExperience: Built scalable neural network pipelines in PyTorch and deployed microservices with Docker and FastAPI.`;
      }

      const candCode = `CAN-${Math.floor(1000 + Math.random() * 9000)}`;
      const fileNameClean = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      // Run algorithm pipeline
      const semanticRel = computeSemanticRelevanceScore(activeJob.description, text);
      const evidence = evaluateSkillEvidence(text, activeJob.requiredSkills, activeJob.preferredSkills);
      const manipulation = detectManipulation(text, evidence);
      const scores = calculateFairHireScores(
        semanticRel,
        evidence,
        4.0,
        activeJob.minExperienceYears,
        manipulation,
        activeJob.scoringWeights
      );
      const contributions = generateExplainabilityContributions(
        scores.semanticRelevance,
        scores.requiredSkillCoverage,
        scores.evidenceStrength,
        scores.experienceFit,
        scores.penaltyApplied,
        activeJob.scoringWeights
      );

      const newCand: Candidate = {
        id: `cand-${Date.now()}-${i}`,
        candidateCode: candCode,
        name: fileNameClean,
        email: `${fileNameClean.toLowerCase().replace(/\s+/g, '.')}@applicant-portal.com`,
        location: 'Verified Applicant',
        isSyntheticDemo: false,
        appliedDate: new Date().toISOString().split('T')[0],
        sessionId: activeJob.id,
        appliedJobTitle: activeJob.title,
        summary: `Parsed resume profile from uploaded file ${file.name}.`,
        totalYearsExperience: 4.0,
        education: [{ degree: 'Degree Verified', institution: 'Accredited Institution', year: '2022' }],
        experience: [{
          company: 'Industry Experience',
          role: 'Machine Learning Practitioner',
          duration: '2022 - Present',
          bullets: ['Engineered software solutions and machine learning components.']
        }],
        projects: [],
        rawResumeText: text,
        scores: {
          overallMatchScore: scores.overallMatchScore,
          semanticRelevance: scores.semanticRelevance,
          requiredSkillCoverage: scores.requiredSkillCoverage,
          evidenceStrength: scores.evidenceStrength,
          experienceFit: scores.experienceFit,
          baselineCosineScore: semanticRel,
          confidenceInterval: scores.confidenceInterval,
          rankingPosition: 99
        },
        skillEvidenceList: evidence,
        manipulationAssessment: manipulation,
        counterfactualVariants: [],
        explainability: {
          featureContributions: contributions,
          groundedEvidenceSnippets: [],
          counterfactualGaps: []
        },
        generatedInterviewQuestions: [],
        reviewStatus: 'pending',
        reviewerNotes: []
      };

      newCandidates.push(newCand);
    }

    setCandidates(prev => {
      const combined = [...prev, ...newCandidates];
      return combined
        .sort((a, b) => b.scores.overallMatchScore - a.scores.overallMatchScore)
        .map((c, idx) => ({ ...c, scores: { ...c.scores, rankingPosition: idx + 1 } }));
    });

    // Add audit log
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole,
      action: 'Batch Upload Resumes',
      details: `Parsed and evaluated ${files.length} applicant resumes for session "${activeJob.title}".`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Update Review Status
  const handleUpdateReviewStatus = (candidateId: string, status: ReviewStatus, note?: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const notes = [...c.reviewerNotes];
      if (note) {
        notes.unshift({
          id: `note-${Date.now()}`,
          author: `${userRole}`,
          timestamp: new Date().toLocaleString(),
          note,
          action: `Status updated to ${status}`
        });
      }
      return {
        ...c,
        reviewStatus: status,
        reviewerNotes: notes
      };
    }));

    if (inspectedCandidate?.id === candidateId) {
      setInspectedCandidate(prev => prev ? { ...prev, reviewStatus: status } : null);
    }

    // Add audit log
    const cand = candidates.find(c => c.id === candidateId);
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole,
      candidateCode: cand?.candidateCode,
      action: `Review Status: ${status}`,
      details: note || `Review decision recorded for candidate ${cand?.candidateCode}.`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Update Flag Status (Confirm or Dismiss)
  const handleUpdateFlagStatus = (candidateId: string, flagId: string, status: 'confirmed' | 'dismissed', note: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== candidateId) return c;
      const flags = c.manipulationAssessment.flags.map(f => {
        if (f.id !== flagId) return f;
        return {
          ...f,
          status,
          reviewerNote: note
        };
      });

      // If all dismissed, adjust risk level
      const confirmedCount = flags.filter(f => f.status === 'confirmed').length;
      const newRisk = confirmedCount > 0 ? c.manipulationAssessment.riskLevel : 'low';

      return {
        ...c,
        manipulationAssessment: {
          ...c.manipulationAssessment,
          flags,
          riskLevel: newRisk
        }
      };
    }));

    if (inspectedCandidate?.id === candidateId) {
      setInspectedCandidate(prev => {
        if (!prev) return null;
        const flags = prev.manipulationAssessment.flags.map(f => f.id === flagId ? { ...f, status, reviewerNote: note } : f);
        return {
          ...prev,
          manipulationAssessment: {
            ...prev.manipulationAssessment,
            flags
          }
        };
      });
    }

    // Audit log
    const cand = candidates.find(c => c.id === candidateId);
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole,
      candidateCode: cand?.candidateCode,
      action: `${status === 'confirmed' ? 'Confirmed' : 'Dismissed'} Manipulation Flag`,
      details: `Flag ${flagId}: ${note}`
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  // Save Candidate Questions
  const handleSaveQuestions = (candidateId: string, questions: any[]) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, generatedInterviewQuestions: questions } : c));
  };

  // Clear demo / reset pool
  const handleClearCandidateData = () => {
    setCandidates(initializeSampleCandidates());
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole,
      action: 'Reset Candidate Pool',
      details: 'Restored clean reproducible synthetic demo candidates for IEEE validation.'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        jobSessions={jobSessions}
        selectedJobId={selectedJobId}
        setSelectedJobId={setSelectedJobId}
        totalCandidatesCount={sessionCandidates.length}
        pendingFlagsCount={pendingFlagsCount}
        interfaceMode={interfaceMode}
        setInterfaceMode={setInterfaceMode}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar Header */}
        <Header
          currentView={currentView}
          userRole={userRole}
          setUserRole={setUserRole}
          blindReviewMode={blindReviewMode}
          setBlindReviewMode={setBlindReviewMode}
          onNewSessionClick={() => setIsNewSessionModalOpen(true)}
          interfaceMode={interfaceMode}
          setInterfaceMode={setInterfaceMode}
          onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'overview' && (
            <OverviewView
              job={activeJob}
              candidates={sessionCandidates}
              onSelectCandidate={(cand) => setInspectedCandidate(cand)}
              onNavigateToView={(view) => setCurrentView(view)}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'screening' && (
            <ScreeningView
              job={activeJob}
              candidates={sessionCandidates}
              onSelectCandidate={(cand) => setInspectedCandidate(cand)}
              onUploadResumes={handleUploadResumes}
              onOpenNewSessionModal={() => setIsNewSessionModalOpen(true)}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'skill_graph' && (
            <SkillGraphView
              job={activeJob}
              candidates={sessionCandidates}
              selectedCandidateId={selectedCandidateId || sessionCandidates[0]?.id}
              onSelectCandidateId={setSelectedCandidateId}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'manipulation' && (
            <ManipulationView
              job={activeJob}
              candidates={sessionCandidates}
              onUpdateFlagStatus={handleUpdateFlagStatus}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'fairness_lab' && (
            <FairnessLabView
              job={activeJob}
              candidates={sessionCandidates}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'explainability' && (
            <ExplainabilityView
              job={activeJob}
              candidates={sessionCandidates}
              selectedCandidateId={selectedCandidateId || sessionCandidates[0]?.id}
              onSelectCandidateId={setSelectedCandidateId}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'interviews' && (
            <InterviewGeneratorView
              job={activeJob}
              candidates={sessionCandidates}
              selectedCandidateId={selectedCandidateId || sessionCandidates[0]?.id}
              onSelectCandidateId={setSelectedCandidateId}
              onSaveCandidateQuestions={handleSaveQuestions}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'benchmarks' && (
            <BenchmarksView />
          )}

          {currentView === 'comparison' && (
            <CandidateComparisonView
              job={activeJob}
              candidates={sessionCandidates}
              onSelectCandidate={(cand) => setInspectedCandidate(cand)}
              blindReviewMode={blindReviewMode}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              userRole={userRole}
              setUserRole={setUserRole}
              blindReviewMode={blindReviewMode}
              setBlindReviewMode={setBlindReviewMode}
              auditLogs={auditLogs}
              onClearCandidateData={handleClearCandidateData}
            />
          )}
        </main>
      </div>

      {/* Candidate Detail Modal */}
      {inspectedCandidate && (
        <CandidateDetailModal
          candidate={inspectedCandidate}
          job={activeJob}
          onClose={() => setInspectedCandidate(null)}
          onUpdateReviewStatus={handleUpdateReviewStatus}
          onUpdateFlagStatus={handleUpdateFlagStatus}
          blindReviewMode={blindReviewMode}
        />
      )}

      {/* New Session Modal */}
      <NewSessionModal
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        onCreateSession={handleCreateSession}
      />

      {/* Demo Guide Script Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onGoToTab={(tab) => setCurrentView(tab)}
      />
    </div>
  );
}
