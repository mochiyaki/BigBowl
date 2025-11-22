export type AuditRequest = { address: string; chain?: string }
export type AuditResult = {
  safety_index: number
  threat_stats: Record<string, number>
  highlights: string[]
  llm_summary?: string
  contract: { address: string; chain: string; name?: string | null; compiler?: string | null }
}

export async function auditContract(req: AuditRequest): Promise<AuditResult> {
  const r = await fetch('http://localhost:8000/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: req.address, chain: req.chain ?? 'ethereum' })
  })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
