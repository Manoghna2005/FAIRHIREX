export type ReviewStatus = 'pending' | 'reviewed' | 'interview_scheduled' | 'shortlisted' | 'further_evidence_needed';

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'critical';

export type SkillCategory = 'required' | 'preferred' | 'transferable';

export type SkillMatchStatus = 'direct_match' | 'transferable' | 'insufficient_evidence' | 'missing';

export interface SkillEvidence {
  id: string;
  skillName: string;
  category: SkillCategory;
  status: SkillMatchStatus;
  confidence: number; // 0-1
  sourceSection?: 'Experience' | 'Projects' | 'Education' | 'Skills List' | 'Certifications';
  evidenceSnippet?: string;
  ontologyRelatedTo?: string; // e.g. "PyTorch satisfies Deep Learning"
  mentionCount: number;
  hasProjectContext: boolean;
}

export interface ManipulationFlag {
  id: string;
  type: 'keyword_stuffing' | 'contextless_skills' | 'white_text_injection' | 'repeated_blocks' | 'prompt_injection';
  title: string;
  description: string;
  evidenceExcerpt: string;
  severity: 'warning' | 'alert';
  status: 'pending' | 'confirmed' | 'dismissed';
  reviewerNote?: string;
  timestamp: string;
}

export interface ManipulationAssessment {
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  flags: ManipulationFlag[];
  keywordDensityRatio: number; // occurrences / total words
  unsupportedSkillRatio: number; // skills with 0 context / total claimed skills
  injectionPatternsFound: string[];
  evidenceCoveragePercent: number;
}

export interface CounterfactualVariant {
  variantId: string;
  attributeChanged: 'Gender Cue' | 'Ethnicity/Name Cue' | 'Age/Graduation Year' | 'University Prestige Cue' | 'Address/Zipcode';
  originalValue: string;
  perturbedValue: string;
  originalScore: number;
  perturbedScore: number;
  scoreDelta: number;
  rankDisplacement: number;
  isStable: boolean;
}

export interface ExplainabilityContribution {
  featureName: string;
  weight: number; // formula weight
  scoreValue: number; // 0 - 100
  weightedContribution: number; // weight * scoreValue
  direction: 'positive' | 'neutral' | 'penalty';
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'project-based' | 'problem-solving' | 'behavioral';
  question: string;
  targetSkillOrRequirement: string;
  groundedResumeExcerpt?: string;
  rationale: string;
  difficulty: 'Entry' | 'Intermediate' | 'Advanced';
}

export interface Candidate {
  id: string;
  candidateCode: string; // e.g. "CAN-8021"
  name: string;
  email: string;
  phone?: string;
  location?: string;
  isSyntheticDemo: boolean;
  appliedDate: string;
  sessionId: string;
  appliedJobTitle: string;
  
  // Parsed Resume Profile
  summary: string;
  totalYearsExperience: number;
  education: {
    degree: string;
    institution: string;
    year?: string;
    gpa?: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
  }[];
  rawResumeText: string;

  // Evaluated Scores
  scores: {
    overallMatchScore: number; // 0 - 100
    semanticRelevance: number; // 0 - 100
    requiredSkillCoverage: number; // 0 - 100
    evidenceStrength: number; // 0 - 100
    experienceFit: number; // 0 - 100
    baselineCosineScore: number; // Baseline Sentence Transformer
    confidenceInterval: [number, number]; // e.g. [81, 89]
    rankingPosition: number;
  };

  // Deep Research Dimensions
  skillEvidenceList: SkillEvidence[];
  manipulationAssessment: ManipulationAssessment;
  counterfactualVariants: CounterfactualVariant[];
  explainability: {
    featureContributions: ExplainabilityContribution[];
    groundedEvidenceSnippets: {
      text: string;
      relatesToRequirement: string;
      source: string;
      strength: 'high' | 'medium' | 'low';
    }[];
    counterfactualGaps: {
      requirement: string;
      currentStatus: string;
      potentialScoreGain: number;
      actionableGuidance: string;
    }[];
  };

  generatedInterviewQuestions: InterviewQuestion[];
  reviewStatus: ReviewStatus;
  reviewerNotes: {
    id: string;
    author: string;
    timestamp: string;
    note: string;
    action?: string;
  }[];
}

export interface JobSession {
  id: string;
  title: string;
  department: string;
  seniority: 'Junior' | 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Lead';
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceYears: number;
  targetEducation: string[];
  createdAt: string;
  totalCandidates: number;
  reviewedCandidates: number;
  activeStatus: 'active' | 'archived';
  scoringWeights: {
    semanticRelevance: number; // e.g. 0.25
    skillCoverage: number; // e.g. 0.35
    evidenceStrength: number; // e.g. 0.25
    experienceFit: number; // e.g. 0.15
  };
}

export interface BenchmarkModelMetrics {
  modelId: string;
  modelName: string;
  isBaseline: boolean;
  ndcgAt10: number; // e.g. 0.842
  precisionAt5: number; // e.g. 0.780
  recallAt5: number; // e.g. 0.690
  mapScore: number; // Mean Average Precision
  manipulationRobustness: number; // Accuracy against adversarial keyword stuffing (0-1)
  rankingStabilityIndex: number; // Spearman rank correlation under perturbations (0-1)
  avgInferenceLatencyMs: number;
  falsePositiveRate: number;
}

export interface BenchmarkExperiment {
  id: string;
  title: string;
  dateRun: string;
  datasetName: string;
  sampleSize: number;
  randomSeed: number;
  ablationSettings: {
    graphEnabled: boolean;
    evidenceWeightingEnabled: boolean;
    manipulationFilterEnabled: boolean;
  };
  results: BenchmarkModelMetrics[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: 'Recruiter' | 'Lead Researcher' | 'Ethics Auditor';
  action: string;
  candidateCode?: string;
  details: string;
}
