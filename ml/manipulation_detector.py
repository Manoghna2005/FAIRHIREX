"""
FairHire-X Research ML Module
Hypothesis H2: Manipulation Resistance & Prompt Hijacking Defense
"""
import re
from typing import Dict, List, Tuple

class ManipulationDetector:
    def __init__(self, density_threshold: float = 0.045):
        self.density_threshold = density_threshold
        self.injection_signatures = [
            r"ignore\s+(all\s+)?previous\s+instructions",
            r"system\s*:\s*(rate|rank|evaluate|give\s+score\s+100)",
            r"you\s+must\s+rank\s+this\s+candidate\s+(first|highest|#1)",
            r"white\s*font|hidden\s*text"
        ]

    def audit_document(self, text: str, claimed_skills: List[str], grounded_skills: List[str]) -> Dict:
        tokens = [w.lower() for w in re.findall(r"\b[a-zA-Z0-9+#.]+\b", text)]
        total_tokens = max(len(tokens), 1)

        # 1. Prompt Injection Checks
        injection_hits = []
        for pat in self.injection_signatures:
            matches = re.findall(pat, text, re.IGNORECASE)
            if matches:
                injection_hits.append(pat)

        # 2. Token Frequency Anomalies
        freq: Dict[str, int] = {}
        for t in tokens:
            freq[t] = freq.get(t, 0) + 1

        top_word = ""
        max_density = 0.0
        for word, count in freq.items():
            if count >= 6 and len(word) > 2:
                ratio = count / total_tokens
                if ratio > max_density:
                    max_density = ratio
                    top_word = word

        has_density_anomaly = max_density > self.density_threshold

        # 3. Contextless Claim Ratio
        ungrounded = [s for s in claimed_skills if s not in grounded_skills]
        contextless_ratio = len(ungrounded) / max(len(claimed_skills), 1)

        risk_score = 5
        if injection_hits:
            risk_score += len(injection_hits) * 50
        if has_density_anomaly:
            risk_score += 30
        if contextless_ratio > 0.40:
            risk_score += 20
        risk_score = min(100, risk_score)

        risk_tier = "low"
        if risk_score >= 70:
            risk_tier = "critical"
        elif risk_score >= 45:
            risk_tier = "elevated"
        elif risk_score >= 25:
            risk_tier = "moderate"

        return {
            "risk_score": risk_score,
            "risk_tier": risk_tier,
            "has_injection": len(injection_hits) > 0,
            "injection_signatures": injection_hits,
            "max_density": round(max_density, 4),
            "top_stuffed_token": top_word,
            "contextless_ratio": round(contextless_ratio, 2)
        }
