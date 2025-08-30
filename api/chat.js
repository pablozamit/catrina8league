export default async function handler(req, res) {
  const origin = "https://catrina8league.vercel.app";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const N8N_WEBHOOK = "https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78";
  try {
    const upstream = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });
    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (e) {
    res.status(502).json({ error: "proxy_error", details: String(e) });
  }
}
