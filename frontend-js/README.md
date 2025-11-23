# BigBowl Frontend-JS

Lightweight vanilla JavaScript frontend for BigBowl's smart contract audit and AI agent platform.

## Overview

BigBowl Frontend-JS is a pre-built, production-ready JavaScript application that provides:
- Smart contract audit interface with real-time results
- AI agent minting and management UI
- MetaMask wallet integration for NFT ownership
- Real-time chat interface with AI agents
- Contract vulnerability visualization

## Why Frontend-JS?

- **Zero Build Step**: Pre-compiled, ready to serve
- **Lightweight**: Single JavaScript bundle (~300KB)
- **No Dependencies**: Vanilla JS, no npm install needed
- **Fast**: Direct server delivery, minimal overhead
- **Compatible**: Works in all modern browsers

## Prerequisites

### Browser Requirements
- Modern browser with ES6+ support:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+

### Browser Extensions
- **MetaMask**: https://metamask.io/
  - Required for NFT minting and wallet interaction
  - Install and set up wallet before using the app

### Backend Service
- BigBowl backend running on `http://localhost:8000`
- API accessible before starting frontend

## Installation

### Option 1: Python HTTP Server (Recommended)

```bash
cd frontend-js
python3 -m http.server 3000
```

Access at: http://localhost:3000

### Option 2: Node.js HTTP Server

```bash
cd frontend-js
npx http-server -p 3000
```

### Option 3: Using npx serve

```bash
cd frontend-js
npx serve -p 3000
```

### Option 4: Nginx/Apache Production Server

See deployment section below.

## Project Structure

```
frontend-js/
├── README.md                      # This file
├── index.html                     # Main HTML entry point
├── index.js                       # Compiled JavaScript bundle
├── index.css                      # Styling
├── index.svg                      # Logo/icon
└── package-lock.json             # Dependency lock (if rebuilt)
```

## Key Files

### index.html

Main HTML page that loads the JavaScript bundle.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="index.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BigBowl</title>
    <script type="module" crossorigin src="index.js"></script>
    <link rel="stylesheet" crossorigin href="index.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### index.js

Compiled JavaScript bundle containing the entire application.

- Minified and optimized
- All dependencies bundled
- Imports: web3.js, metamask connectors, chart libraries

### index.css

Responsive styling for all application pages.

- Mobile-first design
- Dark/Light theme support
- Responsive grid layouts

## Core Features

### 1. Contract Audit Interface

Users can analyze smart contracts:

```
┌─ Input ────────────────────┐
│ Contract Address: 0x...    │
│ Chain: [Ethereum ▼]        │
│ [Analyze] [Recent]         │
└────────────────────────────┘
         ↓
┌─ Results ──────────────────┐
│ Safety Index: 75/100 ███   │
│ Threats Found: 3           │
│ ├─ tx.origin (1)           │
│ ├─ Low-level call (2)      │
│ └─ Assembly (0)            │
│                            │
│ Summary: [AI Generated]    │
└────────────────────────────┘
```

**API Integration:**
```javascript
// Calls POST /api/audit
fetch('http://localhost:8000/api/audit', {
  method: 'POST',
  body: JSON.stringify({
    address: contractAddress,
    chain: selectedChain
  })
})
```

### 2. Agent Minting

Create and mint AI agents as NFTs:

```
┌─ Agent Creator ────────────┐
│ Name: [SecurityExpert]     │
│ Type: [Auditor ▼]          │
│ Description: [...]         │
│ Tools: ☑ Analyzer          │
│        ☑ Detector          │
│ [Create Agent]             │
└────────────────────────────┘
         ↓
┌─ MetaMask Popup ───────────┐
│ Connect Wallet?            │
│ [Approve] [Reject]         │
└────────────────────────────┘
         ↓
┌─ NFT Minted ───────────────┐
│ Agent NFT: #1              │
│ Chain: Ethereum            │
│ Tx: 0x...                  │
│ [View in Wallet]           │
└────────────────────────────┘
```

### 3. Real-time Agent Chat

Interactive chat with AI agents:

```
┌─ Agent: SecurityExpert ────┐
│ "What vulnerabilities...   │
│  do you see?"              │
│                            │
│ Agent: "Based on my        │
│ analysis, I found..."      │
│                            │
│ [Type message...]          │
│ [Send] [Cancel]            │
└────────────────────────────┘
```

**WebSocket Integration:**
```javascript
// Connects to ws://localhost:8000/ws/chat/{agentId}
const ws = new WebSocket(`ws://localhost:8000/ws/chat/${agentId}`);

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  updateChatUI(response);
};

ws.send(JSON.stringify({ message: userInput }));
```

### 4. MetaMask Wallet Integration

Connect wallet and manage NFTs:

```javascript
// Request wallet connection
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts'
});

// Sign transaction
const tx = await web3.eth.sendTransaction({
  from: accounts[0],
  to: contractAddress,
  data: encodedFunctionCall
});

// Display transaction hash
console.log('Transaction:', tx);
```

### 5. Vulnerability Dashboard

Visual representation of detected vulnerabilities:

```
Threat Statistics
─────────────────
delegatecall:      0 ██
selfdestruct:      0 ██
tx.origin:         1 ████
assembly:          0 ██
low_level_call:    2 ██████
reentrancy:        0 ██
unchecked:         0 ██

Security Score: 75/100 (Good)
Risk Level: Medium
```

## API Integration

### Backend Base URL

```javascript
// Configuration (in index.js)
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000';
```

### API Endpoints Used

**1. POST /api/audit**
```javascript
// Audit contract
const response = await fetch(`${API_BASE}/api/audit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: '0x...',
    chain: 'ethereum'
  })
});
const data = await response.json();
// Returns: { safety_index, threat_stats, llm_summary, ... }
```

**2. WebSocket /ws/chat/{agentId}**
```javascript
// Chat with agent
const ws = new WebSocket(`ws://localhost:8000/ws/chat/${agentId}`);
ws.send(JSON.stringify({ message: 'Your question' }));
ws.onmessage = (e) => handleResponse(e.data);
```

**3. POST /api/agents/mint**
```javascript
// Create agent
const response = await fetch(`${API_BASE}/api/agents/mint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'AgentName',
    description: '...',
    type: 'audit_agent',
    tools: ['contract_analyzer']
  })
});
```

**4. POST /api/nft/mint**
```javascript
// Mint NFT
const response = await fetch(`${API_BASE}/api/nft/mint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent_id: 'agent_123',
    metamask_address: accounts[0],
    chain: 'ethereum'
  })
});
```

## Running the Application

### Development

```bash
cd frontend-js
python3 -m http.server 3000
```

Then open: http://localhost:3000

### Production

#### Using Python

```bash
cd frontend-js
python3 -m http.server 3000
```

#### Using Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY frontend-js /app
EXPOSE 3000
CMD ["python3", "-m", "http.server", "3000"]
```

```bash
docker build -t bigbowl-frontend .
docker run -p 3000:3000 bigbowl-frontend
```

#### Using Nginx

```nginx
server {
    listen 3000;
    server_name localhost;
    
    root /var/www/frontend-js;
    index index.html;
    
    # Cache static assets
    location ~* \.(js|css|svg)$ {
        expires 1y;
        add_header Cache-Control "immutable";
    }
    
    # Always serve index.html for routes
    location / {
        try_files $uri /index.html;
    }
}
```

## User Workflow

### 1. Audit a Contract

```
1. User enters contract address
2. Frontend sends to backend API
3. Backend analyzes contract
4. Results displayed with visuals
5. Option to mint agent
```

### 2. Create and Mint Agent

```
1. User configures agent (name, type, tools)
2. Clicks "Create Agent"
3. Frontend requests agent creation via API
4. Backend creates agent using spoon_ai
5. Frontend prompts MetaMask connection
6. User approves transaction
7. NFT minted to wallet
8. Transaction hash displayed
```

### 3. Chat with Agent

```
1. User selects agent from list
2. Opens chat interface
3. Sends message via WebSocket
4. Backend agent processes request
5. Real-time response streamed
6. Chat history maintained
```

## MetaMask Integration Guide

### First Time Setup

1. **Install MetaMask**
   - Visit https://metamask.io/
   - Click "Install" for your browser
   - Complete setup wizard

2. **Create Wallet**
   - Click "Create a Wallet"
   - Set password
   - Save seed phrase (IMPORTANT!)

3. **Switch to Ethereum**
   - Top dropdown shows current network
   - Select "Ethereum Mainnet" (or testnet)

4. **Get Test ETH** (for testnet)
   - Use Sepolia faucet: https://sepoliafaucet.com/
   - Or Goerli: https://goerlifaucet.com/

### Using with BigBowl

1. **First Visit to App**
   - App prompts: "Connect MetaMask?"
   - Click "Connect" in MetaMask popup

2. **Creating Agent NFT**
   - Fill agent details
   - Click "Mint as NFT"
   - MetaMask popup appears
   - Review transaction details
   - Click "Approve"
   - Wait for confirmation

3. **View NFT**
   - MetaMask → Assets tab
   - Your new agent NFT appears
   - Can transfer to other wallets

## Styling & Customization

### CSS Customization

Edit `index.css` to customize:

```css
/* Colors */
--primary-color: #6366f1;
--secondary-color: #06b6d4;
--danger-color: #ef4444;

/* Fonts */
--font-family: 'Inter', sans-serif;
--font-size-base: 14px;

/* Spacing */
--spacing-unit: 8px;
```

### Dark Mode Toggle

Application auto-detects system preference:

```javascript
// Check dark mode
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for changes
window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
  applyTheme(e.matches);
});
```

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Opera | 76+ | ✅ Full Support |

## Performance

### Bundle Size
- Total: ~300KB (gzipped: ~80KB)
- No lazy loading needed
- Single-file deployment

### Load Time
- Initial load: <1s (on 4G)
- Subsequent loads: <500ms (cached)
- API responses: ~500ms average

### Optimization Tips

1. **Enable Caching**
   ```bash
   # In HTTP server or web server config
   Cache-Control: public, max-age=31536000
   ```

2. **Compress Assets**
   ```bash
   gzip -9 index.js index.css
   ```

3. **Use CDN**
   - Serve from geographically close server
   - Reduces latency

## Troubleshooting

### MetaMask Not Found
```
Error: window.ethereum is undefined
Solution: Install MetaMask extension from https://metamask.io/
```

### Backend Connection Failed
```
Error: Failed to fetch /api/audit
Solution: Ensure backend is running on http://localhost:8000
```

### Blank Page
```
Error: Page shows nothing
Solution: Check browser console (F12) for errors
         Verify backend is accessible
```

### Transaction Failed in MetaMask
```
Error: User denied transaction
Solution: Check account has enough ETH (or test ETH for testnet)
         Increase gas limit if needed
```

## Development

### Rebuilding (if source files change)

```bash
# Note: Frontend-JS is pre-built
# To rebuild, use the React frontend in ../frontend/

cd ../frontend
npm install
npm run build
# Copy dist to frontend-js if needed
```

## Deployment Checklist

- [ ] Backend running on production URL
- [ ] MetaMask configured for correct network
- [ ] API URLs updated in configuration
- [ ] SSL/HTTPS enabled for production
- [ ] CORS properly configured on backend
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Monitoring & logging enabled
- [ ] Backup strategy in place
- [ ] Load testing completed

## Support

- **API Documentation**: http://localhost:8000/docs
- **Browser Console**: Press F12 to view errors
- **Backend Logs**: Check terminal where backend is running
- **GitHub Issues**: Report bugs on repository

## License

See LICENSE file in root directory
