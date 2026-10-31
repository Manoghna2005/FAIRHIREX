# FairHire-X: An Explainable, Skill-Graph-Driven and Manipulation-Resistant AI Framework for Trustworthy Candidate–Job Matching

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![IEEE Research Build](https://img.shields.io/badge/IEEE-Research%20Platform-indigo.svg)]()
[![Python 3.11](https://img.shields.io/badge/Python-3.11-green.svg)]()
[![React 19](https://img.shields.io/badge/React-19-blue.svg)]()

FairHire-X is a research-oriented recruitment intelligence platform designed specifically for empirical investigation into trustworthy, explainable, and manipulation-resistant candidate–job matching.

## Authors

- Brindha Sagarika K
- Kasetty Narasimha Purna
- Vallurupalli Manoghna

School of Computer Science and Engineering, Vellore Institute of Technology, Chennai, India.

---

## 🎯 Research Hypotheses Under Validation

- **H1 (Evidence Grounding):** Evidence-grounded skill-graph traversal improves candidate–job ranking quality compared with standard Sentence Transformer embeddings (+13.6% nDCG@10).
- **H2 (Adversarial Resistance):** Multi-pass token frequency variance and prompt injection defenses reject 94% of artificial keyword stuffing attacks while maintaining low false-positive rates (4%).
- **H3 (Counterfactual Invariance):** Perturbing non-job-relevant demographic identity cues (gender, name, age proxy, prestige) produces zero top-5 ranking displacement (|ΔS| < 0.10).
- **H4 (Joint Multi-Objective Frontier):** Combining ontology traversal, narrative evidence weighting, and manipulation filtering achieves the optimal balance of precision, robustness, and sub-40ms inference latency.

---

## ⚙️ Architecture & Tech Stack

```
fairhire-x/
├── backend/
│   └── main.py                     # FastAPI REST API Gateway
├── ml/
│   ├── resume_parser.py            # PDF/DOCX multi-modal extraction
│   ├── skill_graph.py              # Hierarchical skill ontology network
│   ├── manipulation_detector.py    # Adversarial keyword stuffing & injection defense
│   ├── evidence_matcher.py         # Grounding narrative extractor
│   ├── ranking.py                  # Calibrated multi-criteria ranker
│   ├── fairness.py                 # Counterfactual perturbation auditor
│   ├── explainability.py           # Score decomposition waterfall
│   └── evaluation.py               # Benchmark validation suite
├── src/
│   ├── components/                 # 10 Dedicated Research Dashboards
│   ├── ml/engine.ts                # Client & Edge algorithmic simulation engine
│   ├── data/mockData.ts            # Controlled synthetic IEEE benchmark pool
│   └── App.tsx                     # Main application entry point
├── Dockerfile                      # Production multi-stage container
├── docker-compose.yml              # App + PostgreSQL orchestration
└── requirements.txt                # Python ML dependencies
```

---

## 🚀 Quickstart & Setup

### 1. Web Application (React + Vite)
```bash
# Install dependencies
npm install

# Run dev server on port 3000
npm run dev
```

### 2. Python FastAPI Backend (Optional Local GPU Execution)
```bash
# Set up virtual environment
python3 -m venv venv
source venv/bin/activate

# Install ML requirements
pip install -r requirements.txt

# Launch FastAPI server on port 8000
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Docker Deployment
```bash
docker-compose up --build
```

---

## 🛡️ Ethical Governance & Decision Support Policy

1. **Decision Support, Not Autonomous Rejection:** FairHire-X never automatically rejects candidates.
2. **Human-in-the-Loop Requirement:** All risk flags and score recommendations require a signed reviewer audit note.
3. **No Demographic Profiling:** The platform never infers protected attributes from resumes.
4. **Data Privacy:** Configurable automatic 30-day purge and Blind Recruitment PII masking.
