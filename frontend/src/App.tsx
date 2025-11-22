import React, { useState } from 'react'
import { auditContract, AuditResult } from './api'

function App() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AuditResult | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const r = await auditContract({ address })
      setResult(r)
    } catch (err: any) {
      setError(err?.message ?? 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20, fontFamily: 'system-ui' }}>
      <h1>Ethereum Contract Auditor</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button disabled={loading} style={{ padding: '10px 16px' }}>{loading ? 'Auditing…' : 'Audit'}</button>
      </form>
      {error && <div style={{ marginTop: 16, color: '#b00020' }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Safety Index</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{result.safety_index}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Contract</div>
              <div>{result.contract.address}</div>
              <div>{result.contract.compiler ?? ''}</div>
            </div>
          </div>
          <h3 style={{ marginTop: 24 }}>Threat Statistics</h3>
          <ul>
            {Object.entries(result.threat_stats).map(([k, v]) => (
              <li key={k}>{k}: {v}</li>
            ))}
          </ul>
          <h3>Highlights</h3>
          <ul>
            {result.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          {result.llm_summary && (
            <div>
              <h3>LLM Summary</h3>
              <div>{result.llm_summary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
