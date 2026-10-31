"""
FairHire-X Research ML Module
Hypothesis H1: Evidence-Grounded Skill Graph Traversal
"""
from typing import Dict, List, Optional, Set

class SkillGraph:
    def __init__(self):
        self.ontology: Dict[str, Dict] = {
            "PyTorch": {
                "parents": ["Deep Learning", "Python"],
                "transferable": ["TensorFlow", "JAX"],
                "children": ["TorchScript"]
            },
            "TensorFlow": {
                "parents": ["Deep Learning", "Python"],
                "transferable": ["PyTorch", "JAX"],
                "children": ["Keras"]
            },
            "Deep Learning": {
                "parents": ["Machine Learning"],
                "transferable": ["Statistical Modeling"],
                "children": ["PyTorch", "TensorFlow", "Transformers"]
            },
            "FastAPI": {
                "parents": ["Python", "REST APIs"],
                "transferable": ["Flask", "Express.js"],
                "children": ["Pydantic"]
            },
            "Docker": {
                "parents": ["DevOps", "Cloud"],
                "transferable": ["Podman"],
                "children": ["Kubernetes"]
            },
            "Kubernetes": {
                "parents": ["Docker", "Cloud"],
                "transferable": ["Nomad"],
                "children": ["EKS", "GKE"]
            },
            "AI Fairness & Robustness": {
                "parents": ["Responsible AI", "Machine Learning"],
                "transferable": ["Algorithmic Auditing"],
                "children": ["Adversarial Defenses", "Disparate Impact Analysis"]
            }
        }

    def resolve_transferable(self, target_skill: str, candidate_skills: Set[str]) -> Optional[str]:
        node = self.ontology.get(target_skill)
        if not node:
            return None
        for trans in node.get("transferable", []):
            if trans in candidate_skills:
                return trans
        return None
