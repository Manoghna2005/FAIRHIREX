import { SkillEvidence, ManipulationAssessment, ManipulationFlag, ExplainabilityContribution, CounterfactualVariant, RiskLevel } from '../types';

// Tech and Research Skill Ontology
export interface SkillNode {
  name: string;
  category: string;
  aliases: string[];
  parents: string[];
  children: string[];
  transferableTo: string[];
}

export const SKILL_ONTOLOGY: Record<string, SkillNode> = {
  'PyTorch': {
    name: 'PyTorch',
    category: 'Machine Learning Frameworks',
    aliases: ['pytorch', 'torch', 'torchvision'],
    parents: ['Deep Learning', 'Python'],
    children: ['TorchScript', 'PyTorch Lightning'],
    transferableTo: ['TensorFlow', 'JAX']
  },
  'TensorFlow': {
    name: 'TensorFlow',
    category: 'Machine Learning Frameworks',
    aliases: ['tensorflow', 'tf', 'keras'],
    parents: ['Deep Learning', 'Python'],
    children: ['Keras', 'TF-Lite'],
    transferableTo: ['PyTorch', 'JAX']
  },
  'Deep Learning': {
    name: 'Deep Learning',
    category: 'Artificial Intelligence',
    aliases: ['deep learning', 'neural networks', 'ann', 'dnn', 'cnn', 'rnn'],
    parents: ['Machine Learning'],
    children: ['PyTorch', 'TensorFlow', 'Computer Vision', 'Natural Language Processing', 'Transformers'],
    transferableTo: ['Statistical Modeling', 'Pattern Recognition']
  },
  'Natural Language Processing': {
    name: 'Natural Language Processing',
    category: 'Artificial Intelligence',
    aliases: ['nlp', 'natural language processing', 'computational linguistics', 'nlu', 'nlg'],
    parents: ['Artificial Intelligence', 'Data Science'],
    children: ['Transformers', 'BERT', 'LLMs', 'Tokenization', 'Information Retrieval'],
    transferableTo: ['Information Retrieval', 'Speech Recognition']
  },
  'Transformers & LLMs': {
    name: 'Transformers & LLMs',
    category: 'Artificial Intelligence',
    aliases: ['transformers', 'transformer models', 'llm', 'llms', 'gpt', 'bert', 'huggingface'],
    parents: ['Natural Language Processing', 'Deep Learning'],
    children: ['LoRA', 'PEFT', 'RAG', 'Prompt Engineering', 'LangChain'],
    transferableTo: ['Foundation Models', 'Information Extraction']
  },
  'Python': {
    name: 'Python',
    category: 'Programming Languages',
    aliases: ['python', 'python3', 'py'],
    parents: ['Software Engineering'],
    children: ['FastAPI', 'Django', 'Flask', 'NumPy', 'Pandas', 'PyTorch'],
    transferableTo: ['R', 'Julia']
  },
  'FastAPI': {
    name: 'FastAPI',
    category: 'Backend Frameworks',
    aliases: ['fastapi', 'fast-api', 'uvicorn', 'pydantic api'],
    parents: ['Python', 'REST APIs', 'Backend Development'],
    children: ['Pydantic', 'AsyncIO'],
    transferableTo: ['Flask', 'Express.js', 'Django REST Framework']
  },
  'Docker & Containers': {
    name: 'Docker & Containers',
    category: 'DevOps & Infrastructure',
    aliases: ['docker', 'containerization', 'docker-compose', 'containers'],
    parents: ['DevOps', 'Cloud Infrastructure'],
    children: ['Kubernetes', 'Container Registry', 'Podman'],
    transferableTo: ['Podman', 'Containerd']
  },
  'Kubernetes': {
    name: 'Kubernetes',
    category: 'DevOps & Infrastructure',
    aliases: ['kubernetes', 'k8s', 'helm', 'kubectl'],
    parents: ['Docker & Containers', 'Cloud Infrastructure'],
    children: ['EKS', 'GKE', 'Istio'],
    transferableTo: ['Docker Swarm', 'Nomad']
  },
  'MLOps & CI/CD': {
    name: 'MLOps & CI/CD',
    category: 'DevOps & Infrastructure',
    aliases: ['mlops', 'ci/cd', 'github actions', 'kubeflow', 'mlflow', 'wandb', 'dvc'],
    parents: ['Machine Learning', 'DevOps'],
    children: ['Model Registry', 'Feature Store', 'Continuous Training'],
    transferableTo: ['DevOps Automation', 'DataOps']
  },
  'PostgreSQL & SQL': {
    name: 'PostgreSQL & SQL',
    category: 'Databases & Storage',
    aliases: ['postgres', 'postgresql', 'sql', 'relational database', 'psql'],
    parents: ['Data Engineering', 'Backend Development'],
    children: ['pgvector', 'Database Indexing', 'Query Optimization'],
    transferableTo: ['MySQL', 'SQLite']
  },
  'TypeScript & React': {
    name: 'TypeScript & React',
    category: 'Frontend Engineering',
    aliases: ['react', 'reactjs', 'typescript', 'ts', 'nextjs', 'next.js', 'tailwind'],
    parents: ['Frontend Development', 'Web Development'],
    children: ['Next.js', 'State Management', 'Tailwind CSS'],
    transferableTo: ['Vue.js', 'Svelte']
  },
  'AI Fairness & Robustness': {
    name: 'AI Fairness & Robustness',
    category: 'Trustworthy AI & Research',
    aliases: ['fairness', 'robustness', 'trustworthy ai', 'bias audit', 'adversarial robustness', 'explainable ai', 'xai', 'counterfactuals'],
    parents: ['Machine Learning', 'Responsible AI'],
    children: ['SHAP', 'LIME', 'Adversarial Defenses', 'Disparate Impact Analysis'],
    transferableTo: ['AI Ethics', 'Algorithmic Auditing']
  }
};

// Word Tokenizer and TF-IDF implementation
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export function computeCosineSimilarity(vecA: Record<string, number>, vecB: Record<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [key, val] of Object.entries(vecA)) {
    normA += val * val;
    if (vecB[key]) {
      dotProduct += val * vecB[key];
    }
  }

  for (const val of Object.values(vecB)) {
    normB += val * val;
  }

  if (normA === 0 || normB === 0) return 0;
  return Math.min(1, Math.max(0, dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))));
}

export function computeTermFrequency(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {};
  if (tokens.length === 0) return tf;
  for (const t of tokens) {
    tf[t] = (tf[t] || 0) + 1;
  }
  for (const t of Object.keys(tf)) {
    tf[t] = tf[t] / tokens.length;
  }
  return tf;
}

export function computeSemanticRelevanceScore(jobText: string, resumeText: string): number {
  const jobTokens = tokenize(jobText);
  const resumeTokens = tokenize(resumeText);
  const tfJob = computeTermFrequency(jobTokens);
  const tfResume = computeTermFrequency(resumeTokens);
  const similarity = computeCosineSimilarity(tfJob, tfResume);
  // Scale non-linearly to 0-100 to reflect standard dense embedding distributions
  return Math.round(Math.min(98, Math.max(15, (similarity * 1.6 + 0.18) * 100)));
}

// Extract skill evidence and verify grounding in experience/projects
export function evaluateSkillEvidence(
  resumeText: string,
  requiredSkills: string[],
  preferredSkills: string[]
): SkillEvidence[] {
  const lowerText = resumeText.toLowerCase();
  const sentences = resumeText.split(/(?<=[.?!;])\s+|\n+/).map(s => s.trim()).filter(s => s.length > 5);

  const results: SkillEvidence[] = [];

  const checkSkill = (skillName: string, category: 'required' | 'preferred') => {
    const node = SKILL_ONTOLOGY[skillName];
    const aliases = node ? node.aliases : [skillName.toLowerCase()];
    
    // Check direct occurrence
    let foundDirect = false;
    let matchingSnippet = '';
    let mentionCount = 0;
    let hasProjectContext = false;
    let section: 'Experience' | 'Projects' | 'Education' | 'Skills List' = 'Skills List';

    for (const alias of aliases) {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = resumeText.match(regex);
      if (matches) {
        mentionCount += matches.length;
        foundDirect = true;
      }
    }

    if (foundDirect) {
      // Find supporting sentence
      for (const sent of sentences) {
        for (const alias of aliases) {
          if (sent.toLowerCase().includes(alias)) {
            matchingSnippet = sent;
            const sentLower = sent.toLowerCase();
            // Check if sentence describes action, metric or project accomplishment
            const hasActionVerb = /\b(built|designed|engineered|deployed|implemented|developed|scaled|led|created|optimized|published|evaluated)\b/i.test(sentLower);
            const hasMetric = /\b(\d+%|\d+x|\d+ms|\bdataset\b|\bproduction\b|\bmodel\b|\baccuracy\b|\bauc\b|\bcluster\b)\b/i.test(sentLower);
            
            if (hasActionVerb || hasMetric) {
              hasProjectContext = true;
              section = 'Experience';
              break;
            } else if (sent.length > 30) {
              hasProjectContext = true;
              section = 'Projects';
            }
          }
        }
        if (hasProjectContext) break;
      }

      if (!matchingSnippet) {
        matchingSnippet = `Explicitly listed under technical qualifications: "${skillName}".`;
        section = 'Skills List';
      }

      const status = hasProjectContext ? 'direct_match' : 'insufficient_evidence';
      const confidence = hasProjectContext ? (mentionCount > 2 ? 0.95 : 0.82) : 0.45;

      results.push({
        id: `ev-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
        skillName,
        category,
        status,
        confidence,
        sourceSection: section,
        evidenceSnippet: matchingSnippet,
        mentionCount,
        hasProjectContext
      });
      return;
    }

    // If not directly found, check transferable skills via ontology
    if (node && node.transferableTo.length > 0) {
      for (const transferable of node.transferableTo) {
        const transNode = SKILL_ONTOLOGY[transferable];
        const transAliases = transNode ? transNode.aliases : [transferable.toLowerCase()];

        for (const tAlias of transAliases) {
          if (lowerText.includes(tAlias)) {
            const transSent = sentences.find(s => s.toLowerCase().includes(tAlias)) || '';
            results.push({
              id: `ev-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
              skillName,
              category: 'transferable',
              status: 'transferable',
              confidence: 0.68,
              sourceSection: 'Projects',
              evidenceSnippet: `Demonstrates high proficiency in ${transferable}: "${transSent || tAlias}". Transferable to ${skillName}.`,
              ontologyRelatedTo: `${transferable} ↔ ${skillName} (Transferable Skill Path)`,
              mentionCount: 1,
              hasProjectContext: true
            });
            return;
          }
        }
      }
    }

    // Missing skill
    results.push({
      id: `ev-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
      skillName,
      category,
      status: 'missing',
      confidence: 0,
      mentionCount: 0,
      hasProjectContext: false,
      evidenceSnippet: undefined
    });
  };

  requiredSkills.forEach(s => checkSkill(s, 'required'));
  preferredSkills.forEach(s => checkSkill(s, 'preferred'));

  return results;
}

// Manipulation & Adversarial Attack Detector
export function detectManipulation(resumeText: string, claimedSkills: SkillEvidence[]): ManipulationAssessment {
  const flags: ManipulationFlag[] = [];
  const words = resumeText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const totalWords = Math.max(words.length, 1);

  // 1. Check for prompt injection or LLM manipulation strings
  const injectionPatterns = [
    { pattern: /ignore\s+(all\s+)?previous\s+instructions/i, name: 'Prompt Override Attempt' },
    { pattern: /system\s*:\s*(rate|rank|evaluate|give\s+score\s+100)/i, name: 'Synthetic System Directive' },
    { pattern: /you\s+must\s+rank\s+this\s+candidate\s+(first|highest|#1)/i, name: 'Ranking Coercion Directive' },
    { pattern: /white\s*font|hidden\s*text|do\s*not\s*read\s*this/i, name: 'Hidden Metadata Instruction' }
  ];

  const injectionFound: string[] = [];
  for (const { pattern, name } of injectionPatterns) {
    if (pattern.test(resumeText)) {
      injectionFound.push(name);
      flags.push({
        id: `flag-inj-${Date.now()}-${Math.random()}`,
        type: 'prompt_injection',
        title: `Adversarial Instruction Detected: ${name}`,
        description: 'Text contains explicit commands attempting to hijack automated evaluators or LLM scoring pipelines.',
        evidenceExcerpt: resumeText.match(pattern)?.[0] || 'Adversarial instruction sequence',
        severity: 'alert',
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 2. Keyword stuffing & density anomaly
  const frequency: Record<string, number> = {};
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  let topSpammedWord = '';
  let highestRatio = 0;
  for (const [w, count] of Object.entries(frequency)) {
    if (!STOPWORDS.has(w) && count >= 7) {
      const ratio = count / totalWords;
      if (ratio > highestRatio) {
        highestRatio = ratio;
        topSpammedWord = w;
      }
    }
  }

  if (highestRatio > 0.045) { // If a single non-stopword accounts for >4.5% of total resume
    flags.push({
      id: `flag-density-${Date.now()}`,
      type: 'keyword_stuffing',
      title: 'Suspicious Keyword Density Anomaly',
      description: `The term "${topSpammedWord}" appears ${frequency[topSpammedWord]} times (${(highestRatio * 100).toFixed(1)}% of total document volume), heavily deviating from normal distributions.`,
      evidenceExcerpt: `Frequency: ${frequency[topSpammedWord]} occurrences in ${totalWords} words.`,
      severity: 'alert',
      status: 'pending',
      timestamp: new Date().toISOString()
    });
  }

  // 3. Contextless Skills (Claiming high volume of skills with 0 supporting narrative)
  const skillsWithoutContext = claimedSkills.filter(s => s.status === 'insufficient_evidence');
  const unsupportedRatio = claimedSkills.length > 0 ? skillsWithoutContext.length / claimedSkills.length : 0;

  if (unsupportedRatio > 0.4 && claimedSkills.length >= 4) {
    flags.push({
      id: `flag-contextless-${Date.now()}`,
      type: 'contextless_skills',
      title: 'High Ratio of Contextless Skill Claims',
      description: `${skillsWithoutContext.length} out of ${claimedSkills.length} identified skills (${(unsupportedRatio * 100).toFixed(0)}%) appear solely in skill blocks without project or employment grounding.`,
      evidenceExcerpt: skillsWithoutContext.map(s => s.skillName).join(', '),
      severity: 'warning',
      status: 'pending',
      timestamp: new Date().toISOString()
    });
  }

  // 4. Repeated verbatim text blocks
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 25);
  const seenLines = new Set<string>();
  let duplicateCount = 0;
  let duplicatedSample = '';
  for (const line of lines) {
    if (seenLines.has(line)) {
      duplicateCount++;
      if (!duplicatedSample) duplicatedSample = line;
    } else {
      seenLines.add(line);
    }
  }

  if (duplicateCount >= 2) {
    flags.push({
      id: `flag-dup-${Date.now()}`,
      type: 'repeated_blocks',
      title: 'Repeated Text Blocks Detected',
      description: 'Multiple identical sentences or paragraphs were detected across different sections of the resume.',
      evidenceExcerpt: `Duplicated passage: "${duplicatedSample.slice(0, 80)}..."`,
      severity: 'warning',
      status: 'pending',
      timestamp: new Date().toISOString()
    });
  }

  // Compute Risk Score
  let riskScore = 8; // Baseline clean
  if (injectionFound.length > 0) riskScore += 55 * injectionFound.length;
  if (highestRatio > 0.045) riskScore += 30;
  if (unsupportedRatio > 0.4) riskScore += 18;
  if (duplicateCount >= 2) riskScore += 15;
  riskScore = Math.min(100, riskScore);

  let riskLevel: RiskLevel = 'low';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 45) riskLevel = 'elevated';
  else if (riskScore >= 25) riskLevel = 'moderate';

  const groundedSkillsCount = claimedSkills.filter(s => s.status === 'direct_match').length;
  const coveragePercent = claimedSkills.length > 0 ? Math.round((groundedSkillsCount / claimedSkills.length) * 100) : 0;

  return {
    riskLevel,
    riskScore,
    flags,
    keywordDensityRatio: highestRatio,
    unsupportedSkillRatio: unsupportedRatio,
    injectionPatternsFound: injectionFound,
    evidenceCoveragePercent: coveragePercent
  };
}

// Multi-Criteria Grounded Ranking Formula
export function calculateFairHireScores(
  semanticRelevance: number,
  skillEvidenceList: SkillEvidence[],
  yearsExperience: number,
  targetExperience: number,
  manipulation: ManipulationAssessment,
  weights = {
    semanticRelevance: 0.25,
    skillCoverage: 0.35,
    evidenceStrength: 0.25,
    experienceFit: 0.15
  }
) {
  // Required skill coverage
  const required = skillEvidenceList.filter(s => s.category === 'required');
  const matchedRequired = required.filter(s => s.status === 'direct_match');
  const transferableRequired = required.filter(s => s.status === 'transferable');
  
  // Direct matches get 1.0, transferable get 0.65, ungrounded get 0.35
  const requiredSkillCoverage = required.length > 0
    ? Math.round(((matchedRequired.length + (transferableRequired.length * 0.65)) / required.length) * 100)
    : 80;

  // Evidence strength: grounded narrative ratio across all non-missing skills
  const presentSkills = skillEvidenceList.filter(s => s.status !== 'missing');
  const wellGrounded = presentSkills.filter(s => s.hasProjectContext && s.confidence >= 0.8);
  const evidenceStrength = presentSkills.length > 0
    ? Math.round((wellGrounded.length / presentSkills.length) * 100)
    : 40;

  // Experience fit
  const expRatio = Math.min(1.5, yearsExperience / Math.max(targetExperience, 1));
  const experienceFit = Math.round(Math.min(100, expRatio >= 1.0 ? 88 + (expRatio - 1) * 12 : expRatio * 85));

  // Raw weighted score
  let weightedRaw = 
    semanticRelevance * weights.semanticRelevance +
    requiredSkillCoverage * weights.skillCoverage +
    evidenceStrength * weights.evidenceStrength +
    experienceFit * weights.experienceFit;

  // Research constraint: Manipulation penalty is transparently applied to ranking score
  // If critical risk, penalize ranking score so stuffed resumes cannot hijack top positions
  let penalty = 0;
  if (manipulation.riskLevel === 'critical') penalty = 28;
  else if (manipulation.riskLevel === 'elevated') penalty = 14;
  else if (manipulation.riskLevel === 'moderate') penalty = 5;

  const overallMatchScore = Math.max(10, Math.round(weightedRaw - penalty));

  // Compute confidence intervals (+- 4 to 8 points based on evidence ambiguity)
  const uncertainty = Math.round((1 - (evidenceStrength / 100)) * 6) + 3;
  const confidenceInterval: [number, number] = [
    Math.max(0, overallMatchScore - uncertainty),
    Math.min(100, overallMatchScore + uncertainty)
  ];

  return {
    overallMatchScore,
    semanticRelevance,
    requiredSkillCoverage,
    evidenceStrength,
    experienceFit,
    confidenceInterval,
    penaltyApplied: penalty
  };
}

// Generate Explainability Feature Breakdown
export function generateExplainabilityContributions(
  semanticRelevance: number,
  requiredSkillCoverage: number,
  evidenceStrength: number,
  experienceFit: number,
  penaltyApplied: number,
  weights = {
    semanticRelevance: 0.25,
    skillCoverage: 0.35,
    evidenceStrength: 0.25,
    experienceFit: 0.15
  }
): ExplainabilityContribution[] {
  const contributions: ExplainabilityContribution[] = [
    {
      featureName: 'Required Skill Coverage',
      weight: weights.skillCoverage,
      scoreValue: requiredSkillCoverage,
      weightedContribution: Math.round(requiredSkillCoverage * weights.skillCoverage * 10) / 10,
      direction: requiredSkillCoverage >= 70 ? 'positive' : 'neutral',
      explanation: `Direct and ontology-transferable coverage across ${requiredSkillCoverage}% of mandatory competencies.`
    },
    {
      featureName: 'Evidence Grounding Strength',
      weight: weights.evidenceStrength,
      scoreValue: evidenceStrength,
      weightedContribution: Math.round(evidenceStrength * weights.evidenceStrength * 10) / 10,
      direction: evidenceStrength >= 65 ? 'positive' : 'neutral',
      explanation: 'Proportion of skills corroborated by concrete project bullets or measurable production outcomes.'
    },
    {
      featureName: 'Semantic Domain Relevance',
      weight: weights.semanticRelevance,
      scoreValue: semanticRelevance,
      weightedContribution: Math.round(semanticRelevance * weights.semanticRelevance * 10) / 10,
      direction: semanticRelevance >= 70 ? 'positive' : 'neutral',
      explanation: 'Dense semantic alignment between candidate experience narrative and target role scope.'
    },
    {
      featureName: 'Years of Experience Fit',
      weight: weights.experienceFit,
      scoreValue: experienceFit,
      weightedContribution: Math.round(experienceFit * weights.experienceFit * 10) / 10,
      direction: experienceFit >= 75 ? 'positive' : 'neutral',
      explanation: 'Candidate career progression compared to minimum required seniority threshold.'
    }
  ];

  if (penaltyApplied > 0) {
    contributions.push({
      featureName: 'Manipulation Risk Adjustment',
      weight: 1.0,
      scoreValue: -penaltyApplied,
      weightedContribution: -penaltyApplied,
      direction: 'penalty',
      explanation: `Deduction applied due to detected keyword density anomalies or ungrounded skill claims.`
    });
  }

  return contributions;
}
