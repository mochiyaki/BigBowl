from pydantic import BaseModel
from typing import Dict, List, Optional

class AuditRequest(BaseModel):
    address: str
    chain: str = "ethereum"

class AuditResult(BaseModel):
    safety_index: float
    threat_stats: Dict[str, int]
    highlights: List[str]
    llm_summary: Optional[str] = None
    contract: Dict[str, Optional[str]]
