# BigBowl Backend

The FastAPI backend service that powers BigBowl's smart contract audit and AI agent capabilities.

## Overview

The BigBowl backend is a FastAPI-based service that:
- Analyzes smart contracts for security vulnerabilities
- Integrates with LLM providers for intelligent summaries
- Mints and manages AI agents through the spoon_ai framework
- Provides WebSocket support for real-time agent interactions
- Manages NFT minting workflows with MetaMask integration

## Prerequisites

### System Requirements
- **Python 3.11+** (required)
- **macOS/Linux/Windows** with Python support
- **pip** or **conda** for package management

### External Dependencies
1. **MetaMask Browser Extension**
   - Download: https://metamask.io/
   - Install on your browser (Chrome, Firefox, Brave, Edge)
   - Create/import wallet
   - Add Ethereum network (if not present)

2. **Ethereum RPC Endpoint** (optional, for testnet)
   - Recommended: https://infura.io/ or https://alchemy.com/
   - Get free API key for testnet access

3. **LLM API Keys** (at least one):
   - OpenAI: https://platform.openai.com/api-keys
   - Google GenAI: https://makersuite.google.com/app/apikey
   - Anthropic Claude: https://console.anthropic.com/
   - Local LLM (optional): Ollama, LocalAI

## Installation

### Step 1: Set Up Python Environment

```bash
# Option A: Using conda
conda create -n bigbowl python=3.11
conda activate bigbowl

# Option B: Using venv
python3.11 -m venv venv
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  (Windows)
```

### Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Key Backend Dependencies

```
# Web Framework
fastapi>=0.95.0           # Modern async web framework
uvicorn>=0.20.0           # ASGI server
starlette>=0.45.3         # ASGI toolkit

# Data Validation
pydantic>=1.10.0          # Data validation and serialization
pydantic-settings>=2.0    # Configuration management

# HTTP Clients
httpx>=0.24.0             # Async HTTP client
aiohttp==3.10.5           # Async HTTP library
requests>=2.32.3          # Sync HTTP library

# Blockchain & Web3
web3==7.11.0              # Web3.py for Ethereum interaction
eth-account>=0.13.7       # Ethereum account management
eth-keys>=0.7.0           # Ethereum key operations

# AI & LLM Integration
openai>=1.70.0            # OpenAI API
google-genai>=1.52.0      # Google Generative AI
anthropic>=0.74.0         # Anthropic Claude
langsmith>=0.1.0          # LLM observability

# Agent Framework (spoon_ai)
# Installed from main project requirements.txt
```

### Step 3: Configure Environment Variables

Create `.env` file in the `backend/` directory:

```env
# LLM Configuration (choose at least one)
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...

# Ethereum Configuration
WEB3_PROVIDER_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
PRIVATE_KEY=your_private_key  # For contract interactions

# MetaMask Configuration
METAMASK_RPC_URL=http://localhost:8545  # Local test RPC (optional)

# Agent Configuration
AGENT_MODEL=gpt-4
AGENT_MAX_TOKENS=2000
AGENT_TEMPERATURE=0.7
```

## Project Structure

```
backend/
├── README.md                      # This file
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
│
├── app/
│   ├── main.py                   # FastAPI application & endpoints
│   ├── models.py                 # Pydantic data models
│   │
│   └── services/
│       ├── analyzer.py           # Smart contract analysis
│       ├── llm.py                # LLM integration & summaries
│       ├── sourcify.py           # Sourcify API integration
│       ├── agent_service.py      # Agent minting & management
│       ├── nft_service.py        # NFT minting (MetaMask)
│       └── websocket_manager.py  # Real-time chat & agents
│
├── agents/                       # Agent templates
│   ├── audit_agent.py           # Audit analysis agent
│   ├── security_agent.py        # Security advisory agent
│   └── trading_agent.py         # Trading decision agent
│
└── __pycache__/
```

## Core Components

### 1. **main.py - FastAPI Application**

Main entry point with all HTTP endpoints.

**Key Endpoints:**

```python
# Contract Auditing
POST /api/audit
  - Analyzes smart contract
  - Returns: safety_index, threat_stats, llm_summary

# Agent Management
POST /api/agents/mint
  - Creates new AI agent
  - Returns: agent_id, metadata

GET /api/agents/{agent_id}
  - Retrieves agent details
  - Returns: agent state, capabilities

# Real-time Chat
WebSocket /ws/chat/{agent_id}
  - Bi-directional agent communication
  - Returns: streaming responses

# NFT Minting
POST /api/nft/mint
  - Mints NFT of agent
  - Integrates with MetaMask
  - Returns: transaction_hash, NFT_metadata
```

### 2. **services/analyzer.py - Static Analysis**

Performs regex-based security pattern detection.

**Detects:**
- Delegatecall patterns
- Selfdestruct usage
- tx.origin references
- Assembly blocks
- Low-level calls
- Reentrancy risks

**Output:**
```python
{
    "safety_index": 75.5,        # 0-100 score
    "threat_stats": {...},       # Pattern counts
    "highlights": [...]          # Key findings
}
```

### 3. **services/llm.py - LLM Integration**

Generates human-readable audit summaries using configured LLM.

**Features:**
- Multi-provider support (OpenAI, Google, Anthropic)
- Streaming responses
- Token counting
- Caching for optimization

### 4. **services/sourcify.py - Contract Fetching**

Fetches verified contract source code from Sourcify repository.

**Supported Chains:**
- Ethereum (1)
- Polygon (137)
- Arbitrum (42161)
- Optimism (10)
- And many more

### 5. **services/agent_service.py - Agent Management**

Manages AI agent lifecycle using spoon_ai framework.

**Capabilities:**
- Create custom agents
- Configure tools & capabilities
- Persist agent state
- Execute multi-step workflows

**Agent Types:**
- `audit_agent`: Contract analysis
- `security_agent`: Security recommendations
- `trading_agent`: Market analysis

### 6. **services/nft_service.py - NFT Minting**

Handles NFT creation and MetaMask wallet integration.

**Workflow:**
1. Generate agent metadata
2. Create NFT contract call
3. Connect to MetaMask wallet
4. Execute transaction
5. Store transaction hash & NFT metadata

### 7. **services/websocket_manager.py - Real-time Communication**

Manages WebSocket connections for live agent chat.

**Features:**
- Connection pooling
- Message routing
- Broadcast capabilities
- Graceful disconnection

## Running the Backend

### Development Mode (with auto-reload)

```bash
cd backend
conda activate bigbowl
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Access API docs: http://localhost:8000/docs

### Production Mode

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### With Custom Configuration

```bash
uvicorn app.main:app \
  --port 8000 \
  --host 0.0.0.0 \
  --reload \
  --log-level debug
```

## API Usage Examples

### 1. Audit a Smart Contract

```bash
curl -X POST http://localhost:8000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "chain": "ethereum"
  }'
```

### 2. Mint an Agent

```bash
curl -X POST http://localhost:8000/api/agents/mint \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SecurityExpert",
    "description": "AI agent for security analysis",
    "type": "security_agent",
    "tools": ["contract_analyzer", "threat_detector"]
  }'
```

### 3. Interact with Agent via WebSocket

```python
import asyncio
import websockets
import json

async def chat_with_agent():
    uri = "ws://localhost:8000/ws/chat/agent_123"
    async with websockets.connect(uri) as websocket:
        # Send message
        await websocket.send(json.dumps({
            "message": "Analyze this contract for vulnerabilities"
        }))
        
        # Receive response
        response = await websocket.recv()
        print(f"Agent: {response}")

asyncio.run(chat_with_agent())
```

### 4. Mint NFT of Agent

```bash
curl -X POST http://localhost:8000/api/nft/mint \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agent_123",
    "metamask_address": "0x...",
    "chain": "ethereum"
  }'
```

## Spoon AI Agents Integration

BigBowl uses the **spoon_ai** framework for intelligent agent capabilities.

### Agent Architecture

```
CustomAgent (from spoon_ai)
├── Tools (ToolManager)
│   ├── ContractAnalyzerTool
│   ├── ThreatDetectorTool
│   ├── LLMSummarizerTool
│   └── Web3InteractionTool
├── LLM (ChatBot)
│   ├── Multi-provider support
│   ├── Streaming responses
│   └── Memory management
└── Execution Engine
    ├── Tool orchestration
    ├── Error handling
    └── Workflow management
```

### Creating Custom Agents

```python
from spoon_ai.agents import CustomAgent
from spoon_ai.tools import BaseTool

# Create agent
agent = CustomAgent(
    name="SecurityAnalyzer",
    description="Specialized security audit agent"
)

# Add tools
agent.add_tool(ContractAnalyzerTool())
agent.add_tool(ThreatDetectorTool())
agent.add_tool(LLMSummarizerTool())

# Run agent
result = await agent.run("Analyze this contract: 0x...")
```

### Agent Workflow

1. **Initialization**: Load tools and LLM
2. **Request Processing**: Parse user input
3. **Tool Selection**: Determine which tools to use
4. **Execution**: Execute selected tools in sequence
5. **Analysis**: Combine tool outputs
6. **Response**: Generate final response

## MetaMask Integration

### Prerequisites

1. **Install MetaMask Extension**
   - Visit https://metamask.io/
   - Install on your browser

2. **Create/Import Wallet**
   - Set up new wallet or import existing
   - Save seed phrase securely

3. **Configure Network**
   - Add custom RPC (if needed)
   - Select network for transactions

### Backend Configuration

```python
# In services/nft_service.py
from web3 import Web3

w3 = Web3(Web3.HTTPProvider(os.getenv('WEB3_PROVIDER_URL')))

# MetaMask connects via web3.js (frontend)
# Backend receives signed transactions
```

### Frontend Integration

```javascript
// frontend or frontend-js connects to MetaMask
const provider = window.ethereum;
const web3 = new Web3(provider);

// Request account connection
const accounts = await provider.request({ method: 'eth_requestAccounts' });

// Sign and mint NFT
const tx = await contract.methods.mintAgent(agentMetadata).send({
  from: accounts[0]
});
```

## Workflow: From Contract to NFT Agent

```
1. User submits contract address
   ↓
2. Backend fetches contract from Sourcify
   ↓
3. StaticAnalyzer detects patterns
   ↓
4. LLM generates summary
   ↓
5. Agent created from analysis
   ↓
6. Agent minted as NFT
   ↓
7. User receives NFT in MetaMask wallet
```

## Error Handling

### Common Issues

**Issue: LLM API Key Invalid**
```
Error: Invalid OpenAI API key
Solution: Check .env file, regenerate API key
```

**Issue: MetaMask Connection Failed**
```
Error: Web3 provider not found
Solution: Install MetaMask extension, refresh page
```

**Issue: Contract Not Found**
```
Error: Contract sources not found
Solution: Contract must be verified on Sourcify
```

## Debugging

Enable debug logging:

```bash
# Via environment
export LOG_LEVEL=DEBUG
uvicorn app.main:app --reload --log-level debug

# Or in code
import logging
logging.basicConfig(level=logging.DEBUG)
```

View logs:
```bash
# Tail live logs
tail -f /var/log/bigbowl/backend.log

# Or in development (console output)
```

## Testing

Run backend tests:

```bash
# All tests
pytest tests/

# Specific test file
pytest tests/test_analyzer.py -v

# With coverage
pytest tests/ --cov=app/
```

## Performance Optimization

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
async def fetch_contract(address: str, chain: str):
    # Cached contract fetches
    pass
```

### Async Operations

All I/O operations use async/await for non-blocking execution:
- HTTP requests (httpx)
- Database queries
- LLM calls
- WebSocket communication

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/audit")
@limiter.limit("5/minute")
async def audit(req: AuditRequest):
    pass
```

## Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
# Security
ALLOWED_ORIGINS=https://yourdomain.com
CORS_CREDENTIALS=true

# Performance
WORKERS=4
MAX_REQUEST_SIZE=10485760  # 10MB

# Monitoring
SENTRY_DSN=https://...
LOG_LEVEL=INFO
```

## Support & Documentation

- **API Docs**: http://localhost:8000/docs
- **spoon_ai Docs**: See `/doc` directory
- **Examples**: See `/examples` directory
- **Issues**: Check GitHub issues or contact support

## License

See LICENSE file in root directory
