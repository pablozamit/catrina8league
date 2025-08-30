// api/chat.js
export default async function handler(req, res) {
  // Production URL exacta (termina en /chat)
  const N8N_WEBHOOK =
    "https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78/chat";

  console.log("[API/CHAT] Nueva petición:", { method: req.method, body: req.body });

  // CORS solo para tu dominio
  res.setHeader("Access-Control-Allow-Origin", "https://catrina8league.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    console.log("[API/CHAT] Método no permitido:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Normalizamos a los nombres por defecto del Chat Trigger
    const b = req.body || {};
    const sessionId = b.sessionId || b.chatId || "anon";
    const chatInput = b.chatInput || b.message || "";
    const metadata = b.metadata || {};

    const upstreamUrl = `${N8N_WEBHOOK}?action=sendMessage`;

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, chatInput, metadata }),
    });

    let text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // si n8n mandase texto llano, lo envolvemos
      data = { output: text };
    }

    console.log("[API/CHAT] Respuesta n8n:", {
      status: upstream.status,
      preview: JSON.stringify(data).slice(0, 200),
    });

    // ✅ devolvemos SIEMPRE JSON
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(upstream.status).send(JSON.stringify(data));
  } catch (err) {
    console.error("[API/CHAT] Error contactando n8n:", err);
    res.status(502).json({ error: "proxy_error", details: String(err) });
  }
}
