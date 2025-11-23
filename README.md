# BigBowl

## Project Structure
```
BigBowl/
├── README.md
├── .gitignore
├── .env.example
├── requirements.txt
├── LICENSE
├── SPEC.md                        # High-level specification/requirements
│
├── backend/                       # Backend service (Python)
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   └── services/
│   │       ├── analyzer.py
│   │       ├── llm.py
│   │       └── sourcify.py
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

## Getting Started
- Create a virtual environment:
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
