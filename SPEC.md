# Ethereum Smart Contract Auditor (LLM-Assisted)

## Overview
A minimal auditor that accepts an Ethereum contract address, fetches verified source from Sourcify, performs heuristic risk analysis, and uses an LLM (when configured) to produce a readable assessment including threat statistics and a safety index.

## Goals
- Input: Ethereum contract address
- Source retrieval: Sourcify public repository (no API key required)
- Analysis: Static heuristics + optional LLM summary
- Output: Threat statistics, safety index, highlights, narrative summary
- Delivery: FastAPI backend, Vite React TypeScript frontend

## Architecture
- Backend (Python/FastAPI)
  - `POST /api/audit`: accepts `{ address, chain }` and returns analysis
  - Sourcify integration: fetch metadata and sources for the address
  - Heuristic analyzer: detect risky patterns and compute safety index
  - LLM integration: optional enhancement via `OPENAI_API_KEY`
- Frontend (React/Vite/TS)
  - Form input for address
  - Displays safety index, threat stats, highlights, and summary

## Data Flow
1. Frontend sends address to backend
2. Backend fetches sources from Sourcify
3. Backend runs heuristics and optional LLM assessment
4. Backend returns structured result to frontend for display

## Assessment Model
- Threat statistics: counts of patterns
  - `delegatecall`, `selfdestruct`, `tx.origin`, inline `assembly`, low-level `call`, external `call.value`, `reentrancy` indicators, upgradeability proxies
  - Positive indicators: `Ownable`, `Pausable`, `ReentrancyGuard`, Solidity `^0.8` arithmetic checks
- Safety index: 0–100 composite score
  - Base score plus penalties for risky patterns, bonuses for mitigations
- LLM summary: risk narrative and suggested mitigations, gated by API key

## API
- `POST /api/audit`
  - Request: `{ address: string, chain?: "ethereum" }`
  - Response: `{ safety_index: number, threat_stats: Record<string, number>, highlights: string[], llm_summary?: string, contract: { address: string, chain: string, name?: string, compiler?: string } }`

## Configuration
- `OPENAI_API_KEY` for LLM
- Default chain: Ethereum mainnet (chain id 1)
- CORS enabled for local frontend

## TODO
1. Scaffold FastAPI backend structure
2. Implement Sourcify contract source retrieval
3. Implement heuristics analyzer for threat stats
4. Integrate optional LLM summary service
5. Expose `POST /api/audit` with CORS
6. Scaffold Vite React TypeScript frontend
7. Implement address form and results view
8. Connect frontend to backend API
9. Run backend server and verify API
10. Run frontend dev server and verify UI
