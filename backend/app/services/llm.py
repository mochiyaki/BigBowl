import os
import httpx

async def generate_summary(contract, analysis):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        s = analysis["highlights"]
        base = "; ".join(s) if s else "no notable patterns detected"
        return f"Safety index {analysis['safety_index']}. {base}."
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")
    prompt = (
        "You are auditing an Ethereum smart contract. "
        + "Summarize threats and mitigations based on these indicators: "
        + f"{analysis['threat_stats']} and highlights {analysis['highlights']}. "
        + "Respond concisely with a risk rating and suggested actions."
    )
    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a security auditor."},
            {"role": "user", "content": prompt}
        ]
    }
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post("https://api.openai.com/v1/chat/completions", json=body, headers=headers)
        if r.status_code != 200:
            return None
        data = r.json()
        choices = data.get("choices", [])
        if not choices:
            return None
        return choices[0].get("message", {}).get("content")
