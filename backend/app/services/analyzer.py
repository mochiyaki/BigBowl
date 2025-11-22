from typing import Dict, List
import re

def analyze_sources(sources: Dict[str, str]):
    code = "\n".join(sources.values())
    patterns = {
        "delegatecall": r"\.delegatecall\(",
        "selfdestruct": r"selfdestruct\(",
        "tx_origin": r"tx\.origin",
        "assembly": r"assembly\s*\{",
        "low_level_call": r"\.call\(",
        "call_value": r"call\.value",
        "revert": r"revert\(",
        "unchecked": r"unchecked\s*\{"
    }
    positives = {
        "ownable": r"contract\s+.*\s+is\s+.*Ownable",
        "pausable": r"contract\s+.*\s+is\s+.*Pausable",
        "reentrancy_guard": r"ReentrancyGuard",
        "solidity_0_8": r"pragma\s+solidity\s+\^?0\.8"
    }
    stats = {}
    for k, p in patterns.items():
        stats[k] = len(re.findall(p, code, flags=re.IGNORECASE))
    pos = {}
    for k, p in positives.items():
        pos[k] = len(re.findall(p, code, flags=re.IGNORECASE))
    score = 70.0
    penalties = {
        "delegatecall": 10,
        "selfdestruct": 8,
        "tx_origin": 7,
        "assembly": 5,
        "low_level_call": 4,
        "call_value": 4,
        "unchecked": 3
    }
    bonuses = {
        "ownable": 3,
        "pausable": 2,
        "reentrancy_guard": 6,
        "solidity_0_8": 5
    }
    for k, c in stats.items():
        score -= penalties.get(k, 0) * min(c, 3)
    for k, c in pos.items():
        score += bonuses.get(k, 0) * min(c, 2)
    if score < 0:
        score = 0.0
    if score > 100:
        score = 100.0
    highlights: List[str] = []
    for k, c in stats.items():
        if c > 0:
            highlights.append(f"found {k}: {c}")
    for k, c in pos.items():
        if c > 0:
            highlights.append(f"found {k}: {c}")
    return {"safety_index": round(score, 2), "threat_stats": stats, "highlights": highlights}
