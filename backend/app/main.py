from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import AuditRequest, AuditResult
from .services.sourcify import fetch_contract
from .services.analyzer import analyze_sources
from .services.llm import generate_summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"]
    ,
    allow_headers=["*"]
)

@app.post("/api/audit", response_model=AuditResult)
async def audit(req: AuditRequest):
    address = req.address
    if not isinstance(address, str) or not address.startswith("0x") or len(address) != 42:
        raise HTTPException(status_code=400, detail="invalid address")
    contract = await fetch_contract(address, req.chain)
    if contract is None:
        raise HTTPException(status_code=404, detail="contract sources not found")
    analysis = analyze_sources(contract["sources"]) 
    summary = await generate_summary(contract, analysis)
    return {
        "safety_index": analysis["safety_index"],
        "threat_stats": analysis["threat_stats"],
        "highlights": analysis["highlights"],
        "llm_summary": summary,
        "contract": {
            "address": address,
            "chain": req.chain,
            "name": contract.get("name"),
            "compiler": contract.get("compiler")
        }
    }
