import httpx

BASES = [
    "https://repo.sourcify.dev/contracts/full_match/{chainId}/",
    "https://repo.sourcify.dev/contracts/partial_match/{chainId}/",
]

def _chain_id(chain: str) -> int:
    return 1

async def fetch_contract(address: str, chain: str = "ethereum"):
    chain_id = _chain_id(chain)
    addr = address
    async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
        for base in BASES:
            root = base.format(chainId=chain_id)
            meta_url = root + addr + "/metadata.json"
            r = await client.get(meta_url)
            if r.status_code != 200:
                continue
            meta = r.json()
            sources = {}
            for path in meta.get("sources", {}).keys():
                content_url = root + addr + "/" + path
                cr = await client.get(content_url)
                if cr.status_code == 200:
                    sources[path] = cr.text
            name = meta.get("settings", {}).get("compilationTarget", {})
            compiler = meta.get("compiler", {}).get("version")
            return {
                "name": next(iter(name.values())) if name else None,
                "compiler": compiler,
                "sources": sources,
            }
    return None
