# BigBowl - AI Agent Minting & Smart Contract Audit Platform

**Open your browser, connect MetaMask, analyze a smart contract, and mint an AI agent as an NFT that you own.**

BigBowl is a revolutionary platform that democratizes smart contract auditing and AI agent creation. Users can instantly create AI-powered security agents and mint them as NFTs through a simple browser interface.

## Vision

Imagine the future of smart contract security and AI agents:
- 📱 **Browser-Based**: No downloads, no installation
- 🔐 **Wallet Integration**: Connect MetaMask to manage your assets
 - 🤖 **AI Agents on Blockchain**: Custom AI agents are deployed as smart contracts and live on-chain
 - 🎫 **Agent Ownership**: Own and control your AI agents as blockchain-native assets (transferable)
 - 🔗 **Fully Decentralized**: Agents are smart contracts (on-chain execution possible), not just off-chain data

## Key Features

- **🔍 Smart Contract Analysis**: Analyzes Ethereum contracts for security vulnerabilities
- **📊 Safety Scoring**: Generates comprehensive safety index (0-100)
- **⚠️ Threat Detection**: Identifies delegatecall, selfdestruct, reentrancy risks, and more
- **🤖 AI-Powered Summaries**: LLM-generated human-readable audit reports
- **💬 Agent Chat Interface**: Real-time interactive chat with your AI agents
- **🎯 Custom Agents**: Create specialized agents for different audit tasks
 - **🤖 Blockchain Agents**: Deploy AI agents as smart contracts on Ethereum
 - **💬 Agent Chat Interface**: Real-time interactive chat with your on-chain agents
 - **🎯 Custom Agent Types**: Create and configure specialized agents for audit, security, trading (tools, models, parameters)
 - **🪙 Agent Ownership & Transfer**: Agents are owned on-chain and transferable between wallets
 - **⚡ On-Chain & Off-Chain Execution**: Agents can run on-chain for trustless execution or call out to off-chain LLMs when necessary

## Project Structure
```
BigBowl/
├── README.md
├── requirements.txt               # Main project dependencies (Python 3.11+)
├── backend/                       # FastAPI backend service
│   ├── requirements.txt           # Backend-specific dependencies
│   └── app/
│       ├── main.py               # FastAPI application & endpoints
│       ├── models.py             # Request/Response data models
│       └── services/
│           ├── analyzer.py       # Smart contract code analysis
│           ├── llm.py            # LLM integration for summaries
│           └── sourcify.py       # Sourcify API integration
├── frontend-js/                   # Pre-built vanilla JavaScript frontend
│   ├── index.html                # Main HTML
│   ├── index.js                  # Compiled JavaScript bundle
│   ├── index.css                 # Styling
│   └── package-lock.json
├── frontend/                      # React frontend (alternative)
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
└── smart-contract/               # Smart contract files
    ├── BigBowl.sol
    └── BigBank.sol
│   └── requirements.txt
│
├── frontend/                      # Frontend app (Vite + React + TS)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── smart-contract/                 # Solidity contracts
│   ├── BigBank.sol
│   └── BigBowl.sol
│
├── doc/                            # Project documentation
│   ├── installation.md
│   ├── configuration.md
│   ├── agent.md
│   ├── graph_agent.md
│   ├── cli.md
│   └── builtin_tools.md
│
├── examples/                       # Usage examples and demos
│   ├── agent/
│   │   ├── graph_agent_demo.py
│   │   └── my_agent_demo.py
│   ├── mcp/
│   │   ├── deepwiki_demo.py
│   │   ├── mcp_thirdweb_collection.py
│   │   └── spoon_search_agent.py
│   ├── turnkey/
│   │   ├── env.example
│   │   ├── multi_account_use_case.py
│   │   └── turnkey_trading_use_case.py
│   ├── chatbot_streaming_demo.py
│   ├── graph_crypto_analysis.py
│   ├── intent_graph_demo.py
│   ├── llm_architecture_example.py
│   ├── llm_infrastructure_example.py
│   ├── llm_integrated_graph_demo.py
│   ├── llm_manager_example.py
│   ├── neo_toolkit_agent_demo.py
│   ├── neofs-agent-demo.py
│   ├── solana_toolkit_demo.py
│   ├── turnkey-agent-demo.py
│   └── x402_agent_demo.py
│
├── spoon_ai/                       # Core framework modules
│   ├── agents/                     # Agent implementations and mixins
│   ├── callbacks/                  # Callback system and streaming
│   ├── graph/                      # StateGraph engine and utilities
│   ├── llm/                        # LLM providers, manager, and config
│   ├── memory/                     # Short-term memory utilities
│   ├── monitoring/                 # Monitoring service and clients
│   ├── neofs/                      # NeoFS client and utils
│   ├── payments/                   # x402 payment service integration
│   ├── prompts/                    # Built-in prompt templates
│   ├── retrieval/                  # Vector DB integrations
│   ├── runnables/                  # Runnable abstractions and events
│   ├── social_media/               # Social channel integrations
│   ├── tools/                      # Tooling and integrations
│   ├── turnkey/                    # Turnkey client
│   ├── utils/                      # Config, streaming, helpers
│   ├── chat.py                     # Chat interface
│   ├── graph.py                    # Graph facade
│   └── schema.py                   # Shared data structures
│
└── tests/                          # Test suite
    ├── pytest.ini
    ├── asserts.py
    ├── github_client.py
    ├── test_graph.py
    ├── test_prompt_caching.py
    ├── test_updated_examples.py
    ├── test_example_tools.py
    ├── test_agent_llm_integration.py
    ├── test_llm_manager_integration.py
    ├── test_llm_refactor_integration.py
    ├── test_neofs_client.py
    └── test_neofs_utils.py
```

## Prerequisites

- **Python 3.11+** (required for all dependencies)
- **Node.js 18+** (optional, only needed if using React frontend)
- **MetaMask Browser Extension** (required for NFT minting)
- **conda or venv** for Python environment management

## Application Architecture & Workflow

### Complete System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    USER BROWSER                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌──────────────────────────────┐         ┌──────────────────────────────┐           │
│  │  Frontend-JS / React App     │         │   MetaMask Wallet Ext.       │           │
│  │  ├─ Audit Interface          │◄────────│   ├─ Wallet Management      │           │
│  │  ├─ Agent Minter             │         │   ├─ Transaction Signing    │           │
│  │  ├─ Chat Interface           │────────►│   ├─ NFT Display            │           │
│  │  └─ Wallet Integration       │         │   └─ ETH Management         │           │
│  └──────────────────────────────┘         └──────────────────────────────┘           │
│           ▲                                                ▲                          │
│           │ HTTP/WebSocket                                │ Web3.js                  │
│           │ API Calls                                     │ Transactions             │
└───────────┼────────────────────────────────────────────────┼──────────────────────────┘
            │                                                │
            │                                                │
            ├────────────────────────┬───────────────────────┤
            │                        │                       │
            ▼                        ▼                       ▼
    ┌──────────────────┐   ┌──────────────────┐  ┌──────────────────┐
    │ Backend Service  │   │ Blockchain Net.  │  │ Sourcify Repo    │
    │ (FastAPI)        │   │ (Ethereum)       │  │ (Contract Code)  │
    │ :8000            │   │                  │  │                  │
    └──────────────────┘   └──────────────────┘  └──────────────────┘
            │
            ├─ Contract Analysis
            ├─ AI Agent Creation
            └─ LLM Integration
```

### User Journey Flow

```
START (User opens app in browser)
│
├─ [1] CONNECT METAMASK
│  └─► Approve wallet connection
│      │
│      └─► Wallet connected ✓
│
├─ [2] AUDIT CONTRACT
│  ├─ Enter contract address
│  ├─ Select blockchain (Ethereum, Polygon, etc.)
│  └─► Backend receives request
│      │
│      ├─ [A] Fetch contract from Sourcify
│      ├─ [B] Static analysis (patterns detection)
│      ├─ [C] LLM generates summary
│      └─► Results displayed
│          │
│          ├─ Safety Index: 75/100
│          ├─ Threat Stats: {...}
│          ├─ AI Summary: "..."
│          └─ Highlights: [...]
│
├─ [3] DEPLOY AGENT (Optional)
│  ├─ Click "Create & Deploy Agent"
│  ├─ Configure agent
│  │  ├─ Name & description
│  │  ├─ Type (Auditor, Security, Trading)
│  │  ├─ Tools & capabilities
│  │  └─ Model parameters & limits
│  └─► Frontend sends deployment package to backend
│      │
│      ├─ Backend compiles agent configuration into on-chain contract bytecode
│      ├─ Prepares deployment transaction (gas, constructor args)
│      └─ Returns unsigned tx or initiates MetaMask flow for signing
│
├─ [4] APPROVE IN METAMASK
│  └─► User reviews & signs deployment transaction
│      │
│      ├─ Transaction broadcast to blockchain
│      ├─ Agent smart contract deployed and assigned a contract address
│      └─ Deployment tx hash & contract address returned
│
├─ [5] INTERACT WITH AGENT
│  ├─ Select agent from your portfolio (on-chain list)
│  ├─ Open interaction UI (on-chain calls or off-chain via WebSocket)
│  ├─ Send requests to agent (transaction or RPC call)
│  └─► Agent executes (on-chain logic and/or off-chain helper) and returns results
│
├─ [6] TRANSFER AGENT OWNERSHIP
│  ├─ Initiate transfer transaction to another wallet
│  ├─ New owner receives control over agent contract (per ACL rules)
│  └─► Agent remains on-chain and callable by the current owner
│
└─ END (Agent lives on blockchain; configurable and owned by user)
```

### Component Roles & Responsibilities

#### 1. **Frontend-JS (User Interface)**
- **Role**: Present data to users, handle interactions
- **Responsibilities**:
  - Render UI components
  - Collect user input (contract address, agent config)
  - Call backend APIs
  - Display results with visualizations
  - Manage WebSocket connections for chat
  - Trigger MetaMask wallet interactions
- **Technology**: Vanilla JavaScript, Web3.js

#### 2. **MetaMask Wallet**
- **Role**: Secure wallet & transaction management
- **Responsibilities**:
  - Manage user's private keys securely
  - Request user approval for transactions
  - Sign NFT mint transactions
  - Display minted NFTs in wallet
  - Manage ETH balance
- **Technology**: Browser extension, Ethereum protocol

#### 3. **FastAPI Backend Service** (Port 8000)
- **Role**: Core business logic & orchestration
- **Responsibilities**:
  - Receive audit requests
  - Coordinate analysis pipeline
  - Manage AI agent lifecycle
  - Provide WebSocket endpoints for chat
  - Handle NFT minting requests
  - Validate all inputs
- **Technology**: FastAPI, Python 3.11+

#### 4. **Static Analyzer Service**
- **Role**: Detect security patterns in contracts
- **Responsibilities**:
  - Parse contract source code
  - Identify vulnerability patterns (regex-based)
  - Calculate safety score
  - Generate threat statistics
  - Provide highlights
- **Technology**: Python, regex patterns

#### 5. **LLM Service**
- **Role**: Generate human-readable summaries
- **Responsibilities**:
  - Process analysis results
  - Generate security insights
  - Provide recommendations
  - Support multi-provider (OpenAI, Google, Anthropic)
- **Technology**: OpenAI API, Google GenAI, Anthropic

#### 6. **Spoon AI Agent Framework**
- **Role**: Create and manage intelligent agents
- **Responsibilities**:
  - Instantiate CustomAgent instances
  - Register tools with agents
  - Execute multi-step workflows
  - Manage agent state & memory
  - Handle tool orchestration
- **Technology**: spoon_ai (custom framework)

#### 7. **Sourcify Repository**
- **Role**: Provide verified contract source code
- **Responsibilities**:
  - Store verified contracts
  - Return contract metadata
  - Serve contract source files
  - Support multiple blockchains
- **Technology**: Sourcify API, JSON metadata

#### 8. **Ethereum Blockchain**
- **Role**: Immutable transaction ledger & NFT registry
- **Responsibilities**:
  - Execute NFT mint transactions
  - Record ownership in smart contract
  - Generate transaction hash
  - Ensure immutability
- **Technology**: Ethereum mainnet/testnet

### Data Flow Diagram

```
User Input
   │
   ▼
┌─────────────────────────────────┐
│  Frontend Validation & Format   │
└─────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────┐
│  HTTP/WebSocket API Request     │ ──► Backend (Port 8000)
└─────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────┐
│  Backend Input Validation       │
└─────────────────────────────────┘
   │
   ▼
   ├──► Sourcify API ──► Get contract source
   │
   ▼
   ├──► Static Analyzer ──► Detect patterns
   │
   ▼
   ├──► LLM Service ──► Generate summary
   │
   ▼
┌─────────────────────────────────┐
│  Format Response (JSON)         │
└─────────────────────────────────┘
   │
   ▼
   ├──► HTTP Response ──► Frontend displays results
   │
   └──► WebSocket ──► Real-time chat responses
   
   (If NFT minting)
   │
   ▼
   ├──► Create agent metadata
   ├──► Encode contract call
   ├──► Send to MetaMask
   ├──► User signs in wallet
   ├──► Transaction broadcast to blockchain
   ├──► NFT minted
   └──► Tx hash returned to user
```

### API Endpoints Overview

```
Contract Analysis
  POST /api/audit
    Input:  { address: "0x...", chain: "ethereum" }
    Output: { safety_index, threat_stats, llm_summary, ... }

Agent Management
  POST /api/agents/mint
    Input:  { name, description, type, tools }
    Output: { agent_id, metadata, created_at }
  
  GET /api/agents/{agent_id}
    Output: { agent_id, name, type, status, ... }

Real-time Chat
  WebSocket /ws/chat/{agent_id}
    Bidirectional message exchange
    Streaming responses from agent

NFT Operations
  POST /api/nft/mint
    Input:  { agent_id, metamask_address, chain }
    Output: { tx_hash, nft_contract, nft_id }
```

## Objective

**"Enable anyone to analyze smart contracts and create AI agents that they own as NFTs, directly from their browser."**

### What We're Building
- 🔓 **Democratized Auditing**: No gatekeeping, anyone can audit contracts
- 🤖 **AI-as-NFT**: Agents become tradeable, ownable assets
- 🌐 **Web3 Native**: Built for blockchain, integrated with Web3 ecosystem
- 💡 **User Empowerment**: Users control their agents and audit results
- 🔐 **Security First**: Comprehensive vulnerability detection
- 🚀 **Accessible**: No CLI, no complex setup - just open browser

### Success Metrics
- ✅ Users can audit any verified contract in <10 seconds
- ✅ Agents are minted as NFTs in MetaMask wallet
- ✅ Users can own and trade their AI agents
- ✅ Real-time interaction with agents via chat
- ✅ Security findings are accurate and actionable

---

## Prerequisites

## Installation

### Step 1: Clone and Navigate to Project

```bash
cd /Users/manjeshprasad/Desktop/Scoop_AI_Hackathon/BigBowl
```

### Step 2: Set Up Python Environment

**Option A: Using conda (Recommended)**

```bash
# Activate an existing Python 3.11+ environment
conda activate pythonBackend
# or create a new one
conda create -n bigbowl python=3.11
conda activate bigbowl
```

**Option B: Using venv**

```bash
python3.11 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or: venv\Scripts\activate  (On Windows)
```

### Step 3: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Backend Requirements (from `backend/requirements.txt`)

```
fastapi>=0.95.0          # Web framework
uvicorn>=0.20.0          # ASGI server
httpx>=0.24.0            # Async HTTP client
pydantic>=1.10.0         # Data validation
```

### Step 4: Install Main Project Dependencies

```bash
cd ..
pip install -r requirements.txt
```

This installs additional dependencies including:
- `aiohttp` - Async HTTP client
- `openai` - LLM integration
- `web3` - Ethereum interaction
- `google-genai` - Google AI models
- `anthropic` - Anthropic Claude integration
- And many more AI/ML and blockchain tools

## Running the Application

### Option 1: Run Backend + frontend-js (Recommended for Quick Start)

**Terminal 1 - Start Backend:**

```bash
cd /Users/manjeshprasad/Desktop/Scoop_AI_Hackathon/BigBowl/backend
conda run -n pythonBackend uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

**Terminal 2 - Start frontend-js:**

```bash
cd /Users/manjeshprasad/Desktop/Scoop_AI_Hackathon/BigBowl/frontend-js
python3 -m http.server 3000
```

Frontend will be available at: `http://localhost:3000`

### Option 2: Run Backend + React Frontend

**Terminal 1 - Start Backend:**

```bash
cd /Users/manjeshprasad/Desktop/Scoop_AI_Hackathon/BigBowl/backend
conda run -n pythonBackend uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Start React Frontend:**

```bash
cd /Users/manjeshprasad/Desktop/Scoop_AI_Hackathon/BigBowl/frontend
npm install  # First time only
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Option 3: One-Line Command (All Together)

```bash
cd /Users/manjeshprasad/Desktop/Scoop_AI_Hackathon/BigBowl && \
(cd backend && conda run -n pythonBackend uvicorn app.main:app --reload --port 8000 &) && \
(cd frontend-js && python3 -m http.server 3000)
```

---

## MetaMask Setup (Required for NFT Minting)

### Installation

1. **Visit MetaMask**: https://metamask.io/
2. **Select Your Browser**: Chrome, Firefox, Safari, Edge
3. **Click "Install"** and follow the setup wizard
4. **Create Wallet** or **Import Existing**
   - If new: Write down seed phrase (keep it safe!)
   - If importing: Enter seed phrase

### Configure for BigBowl

1. **Open MetaMask** (top-right corner of browser)
2. **Select Network**
   - Top dropdown shows current network
   - Select "Ethereum Mainnet" (production) or testnet
3. **Get Testnet ETH** (for testing, if using testnet)
   - Sepolia: https://sepoliafaucet.com/
   - Goerli: https://goerlifaucet.com/
4. **Copy Your Address**
   - Click on account name at top
   - Copy address (starts with 0x)

### First Time Using BigBowl

```
1. Open BigBowl app in browser (http://localhost:3000)
2. App prompts: "Connect MetaMask?"
3. Click "Connect" in MetaMask popup
4. Approve permissions
5. Your wallet address appears in app
6. Ready to mint agents!
```

### NFT Minting Workflow

```
1. Complete contract audit
2. Click "Mint as NFT"
3. Configure agent details
4. Click "Approve"
5. MetaMask popup appears:
   ├─ Reviews transaction details
   ├─ Shows gas fees
   ├─ Displays recipient (your wallet)
   └─ [Confirm] or [Reject]
6. Click "Confirm" to sign
7. Transaction sent to blockchain
8. NFT minted to your wallet
9. View in MetaMask → Assets tab
```

### Troubleshooting MetaMask

| Issue | Solution |
|-------|----------|
| MetaMask not found | Install from https://metamask.io/ |
| "Insufficient balance" | Add testnet ETH from faucet or deposit ETH |
| Transaction failed | Check gas limit, increase if needed |
| NFT not showing | Refresh wallet, add custom token if needed |
| Wrong network | Check top dropdown in MetaMask, switch network |

---

## Spoon AI Agents - Core Technology

### What are Spoon AI Agents?

**Spoon AI** is our custom AI agent framework that powers intelligent contract analysis and multi-step workflows.

```
CustomAgent (from spoon_ai)
├── Tools (ToolManager)
│   ├─ Contract Analyzer Tool
│   ├─ Threat Detector Tool
│   ├─ LLM Summarizer Tool
│   └─ Web3 Interaction Tool
├── LLM (Multi-Provider)
│   ├─ OpenAI GPT-4
│   ├─ Google Gemini
│   └─ Anthropic Claude
├── Execution Engine
│   ├─ Workflow orchestration
│   ├─ Tool chaining
│   └─ Error handling
└── Memory & State
    ├─ Conversation history
    ├─ Agent state persistence
    └─ Learning capabilities
```

### Agent Roles in BigBowl

**1. Audit Agent**
- **Purpose**: Analyze smart contract code for vulnerabilities
- **Tools**: ContractAnalyzer, ThreatDetector, LLMSummarizer
- **Workflow**:
  1. Receive contract source code
  2. Run static analysis
  3. Detect security patterns
  4. Generate AI summary
  5. Return comprehensive report

**2. Security Agent**
- **Purpose**: Provide detailed security recommendations
- **Tools**: VulnerabilityDB, BestPracticesValidator, FixSuggester
- **Workflow**:
  1. Receive audit results
  2. Check against known vulnerabilities
  3. Compare with security standards
  4. Suggest fixes
  5. Provide risk mitigation strategies

**3. Trading Agent**
- **Purpose**: Analyze contracts for trading safety
- **Tools**: FloorPriceAnalyzer, VolumeAnalyzer, RiskAssessor
- **Workflow**:
  1. Analyze contract mechanics
  2. Check for exploit vectors
  3. Assess trading risks
  4. Provide safe trading recommendations

### Agent Workflow in Code

```python
from spoon_ai.agents import CustomAgent
from spoon_ai.tools import BaseTool

# Create agent
agent = CustomAgent(
    name="ContractAuditor",
    description="Specialized contract security analyzer"
)

# Add tools
agent.add_tool(ContractAnalyzerTool())
agent.add_tool(ThreatDetectorTool())
agent.add_tool(LLMSummarizerTool())

# Execute analysis
result = await agent.run(
    "Analyze this contract for vulnerabilities: 0x..."
)
# Output: Comprehensive audit report
```

### Agent Deployment on Blockchain

Agents in BigBowl are deployed on-chain as smart contracts (not just off-chain objects). When you deploy an agent the platform compiles the agent configuration to on-chain bytecode so the agent can live, execute, and be owned on the blockchain.

```
1. Agent instance created (spoon_ai.CustomAgent) and configured by user
2. Agent configuration compiled for on-chain deployment:
  ├─ Agent name & description
  ├─ Tools & capabilities (list of allowed tools)
  ├─ Model parameters and operational limits
  ├─ Initial state and access-control rules
  └─ Storage pointers for off-chain assets (if needed)
3. Smart contract generated & deployed:
  ├─ Bytecode created and uploaded to chain
  ├─ Deployment transaction is signed (MetaMask) and broadcast
  ├─ Contract created and assigned an address
  └─ Deployment tx hash & contract address returned to user
4. You receive:
  ├─ Contract address (0x...) as proof of agent ownership
  ├─ On-chain agent that can be called by its owner
  └─ Ability to transfer or delegate ownership according to ACL rules
```

### On-Chain Agent Customization

End users can customize deployed agents to match their requirements before (and in some cases after) deployment. Customizable aspects include:

- Tools & Capabilities: Select which tool modules the agent exposes (e.g., contract analyzer, threat detector, data fetchers).
- Model Parameters: Choose model type (on-chain logic or off-chain LLM provider), temperature, max tokens, and runtime limits.
- Access Control: Configure who can call the agent (owner-only, whitelisted addresses, or public) and set delegation rules.
- Persistence & Storage: Define which data is kept on-chain vs off-chain (IPFS/NeoFS pointers for large datasets or model snapshots).
- Upgradeability: Optionally enable an upgrade path (proxy pattern) so authorized owners can update agent logic.
- Gas & Resource Constraints: Set per-call gas limits, rate limits, and quotas to control costs.

Notes:
- Some heavy LLM calls are expensive or impossible purely on-chain. BigBowl supports hybrid on-chain/off-chain patterns where sensitive logic lives on-chain and heavy LLM processing runs off-chain with authenticated attestations recorded on-chain.
- Customization UI surfaces these options when creating/deploying an agent; the backend prepares deployment artifacts and MetaMask handles signing and broadcasting.

---

## API Endpoints

### POST `/api/audit`

Analyzes a smart contract and returns security audit results.

**Request:**
```json
{
  "address": "0x...",  // Ethereum contract address (42 chars with 0x prefix)
  "chain": "ethereum"  // Blockchain network (default: ethereum)
}
```

**Response:**
```json
{
  "safety_index": 75.5,
  "threat_stats": {
    "delegatecall": 0,
    "selfdestruct": 0,
    "tx_origin": 1,
    "assembly": 0,
    "low_level_call": 2,
    "call_value": 0,
    "revert": 5,
    "unchecked": 0
  },
  "highlights": [
    "Contains tx.origin usage",
    "Uses low-level call patterns"
  ],
  "llm_summary": "Contract has moderate risk...",
  "contract": {
    "address": "0x...",
    "chain": "ethereum",
    "name": "ContractName",
    "compiler": "0.8.19"
  }
}
```

## Backend Architecture

### Main Components

**1. `app/main.py` - FastAPI Application**
- Defines the audit endpoint
- Handles request validation
- Orchestrates the analysis pipeline
- CORS enabled for `http://localhost:5173` and `http://localhost:3000`

**2. `app/models.py` - Data Models**
- `AuditRequest`: Input validation
- `AuditResult`: Output response structure

**3. `app/services/sourcify.py` - Contract Fetching**
- Fetches contract source code from Sourcify repository
- Supports multiple chain IDs
- Retrieves metadata and compilation information

**4. `app/services/analyzer.py` - Static Analysis**
- Regex-based pattern detection
- Identifies security-related patterns:
  - Delegatecall usage
  - Selfdestruct patterns
  - tx.origin references
  - Assembly blocks
  - Low-level calls
- Calculates safety score based on pattern counts

**5. `app/services/llm.py` - LLM Integration**
- Generates human-readable summaries
- Uses configured LLM provider (OpenAI, Google, Anthropic, etc.)

## Frontend Architecture

### frontend-js (Vanilla JavaScript)
- Pre-built, production-ready JavaScript bundle
- No build step required
- Simple HTTP server delivery
- Lightweight and fast

### frontend (React + Vite)
- Modern React application
- TypeScript support
- Development with hot reload
- Optimized build process

Both frontends communicate with the backend at:
- Production: `http://localhost:8000`
- Development: `http://localhost:8000` (configurable)

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Backend configuration
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Frontend configuration
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Python Version Issues
- Ensure Python 3.11+ is used
- Check with: `python --version`
- Use conda to switch environments: `conda activate pythonBackend`

### Port Already in Use
- Backend (8000): `lsof -i :8000` to find process
- Frontend-js (3000): `lsof -i :3000`
- React (5173): `lsof -i :5173`

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Backend allows `http://localhost:3000` and `http://localhost:5173`

### Dependencies Won't Install
- Clear pip cache: `pip cache purge`
- Try: `pip install --upgrade pip`
- Reinstall: `pip install -r requirements.txt --force-reinstall`

## Development Workflow

1. **Edit backend code** → Auto-reload with `--reload` flag
2. **Edit frontend** → React: auto-reload with Vite, frontend-js: refresh browser
3. **Test API** → Use Swagger UI at `http://localhost:8000/docs`

## Testing

```bash
# Run tests
pytest tests/

# Run specific test file
pytest tests/test_graph.py

# With coverage
pytest --cov=spoon_ai tests/
```

## License

See LICENSE file for details

## Support

For issues or questions, refer to:
- `SPEC.md` - Technical specification
- `doc/` - Documentation folder
- `/examples` - Example implementations
  - Windows PowerShell: `python -m venv .venv; .\.venv\Scripts\Activate.ps1`
  - Unix/macOS: `python -m venv .venv && source .venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`
- Configure environment:
  - Copy `.env.example` to `.env` and fill in required keys (e.g., LLM API keys)
- Run a demo:
  - Chatbot streaming: `python examples\chatbot_streaming_demo.py`
  - LLM manager sample: `python examples\llm_manager_example.py`
  - Graph agent demo: `python examples\agent\graph_agent_demo.py`
- Run tests: `pytest -q`

## Notes
- `.env` is intentionally excluded via `.gitignore`. Use `.env.example` as a template.
- Backend dependencies live under `backend/requirements.txt`; frontend uses `npm`/`pnpm` in `frontend/`.
- Solidity contracts live in `smart-contract/` and reference OpenZeppelin. Compile/deploy with your preferred EVM toolchain (e.g., Hardhat or Foundry).
- LLM providers are modular under `spoon_ai/llm/providers` (OpenAI, Anthropic, Gemini, etc.).
- The graph engine (`spoon_ai/graph`) provides `StateGraph`, `CompiledGraph`, and routing/interrupt APIs.
