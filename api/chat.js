export default async function handler(req, res) {
  const N8N_WEBHOOK =
    "https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78";

  console.log("[API/CHAT] Nueva petición:", {
    method: req.method,
    body: req.body,
  });

  // CORS para tu frontend
  res.setHeader("Access-Control-Allow-Origin", "https://catrina8league.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    console.log("[API/CHAT] Preflight OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    console.log("[API/CHAT] Método no permitido:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const upstream = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });

    const text = await upstream.text();

    console.log("[API/CHAT] Respuesta de n8n:", {
      status: upstream.status,
      length: text.length,
      preview: text.slice(0, 200),
    });

    res.status(upstream.status).send(text);
  } catch (err) {
    console.error("[API/CHAT] Error al contactar con n8n:", err);
    res.status(502).json({ error: "proxy_error", details: String(err) });
  }
}
