// src/pages/Schedule.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

type Message = { id: string; role: "user" | "bot"; text: string };

const WEBHOOK_URL = "/api/chat";

const Schedule: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: "Programa tu partida aquí" },
  ]);

  const chatId = useMemo(() => {
    const key = "n8n_chat_id";
    let v = sessionStorage.getItem(key);
    if (!v) {
      v = "chat_" + Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(key, v);
    }
    return v;
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setMessages((m) => [...m, { id: Date.now().toString(), role: "user", text }]);
    setSending(true);

    try {
      console.info("Enviando a:", WEBHOOK_URL);
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: chatId, chatInput: text }),
      });

      // Leemos como texto y luego intentamos parsear (por si el header no es JSON)
      const raw = await res.text();
      let payload: any;
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = { output: raw };
      }

      if (!res.ok) {
        const errText = typeof payload === "string" ? payload : JSON.stringify(payload);
        setMessages((m) => [
          ...m,
          { id: Math.random().toString(), role: "bot", text: `❌ Error ${res.status}: ${errText}` },
        ]);
      } else {
        const reply =
          payload.output ||
          payload.answer ||
          payload.text ||
          payload.response ||
          payload.message ||
          (typeof payload === "string" ? payload : "");

        setMessages((m) => [...m, { id: Math.random().toString(), role: "bot", text: reply || "No entendí nada 🤔" }]);
      }
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { id: Math.random().toString(), role: "bot", text: `❌ Error de red: ${String(err?.message || err)}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-blue-400">
        Programar un Partido
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 lg:w-2/3">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Calendario de Referencia</h2>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FMadrid&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK&title=La%20Catrina%20Pool%20League&src=MjZiMmIxNGVmZGI4OGMwZjM4MGNhYjkzZjU5YjM0NjczOTcwMWRlZWEyNmEwMWM3YmUwZmE2ZDE0YjIwYTQ5MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237cb342"
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </div>

        <div className="flex-1 lg:w-1/3 relative">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Asistente de Partidos</h2>
          <div className="card bg-black/30 border-purple-500/30 p-6 h-full">
            <p className="text-gray-200">
              Usa el botón de chat abajo a la derecha para hablar con{" "}
              <span className="font-semibold">“No molestéis a Pablo”</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Botón flotante — bola 8 */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir chat"
        title="Abrir chat"
        className="fixed bottom-6 right-6 z-50 w-24 h-24 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-center hover:scale-105 transition-transform focus:outline-none"
        style={{ background: "radial-gradient(circle at 35% 35%, #444 0%, #111 60%, #000 100%)" }}
      >
        <svg width="68" height="68" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="45" fill="transparent" />
          <circle cx="50" cy="50" r="22" fill="#ffffff" />
          <text x="50" y="57" textAnchor="middle" fontSize="28" fontWeight="700" fill="#000">
            8
          </text>
        </svg>
      </button>

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-32 right-6 z-50 w-[360px] h-[520px] rounded-2xl shadow-2xl border border-purple-500/50 bg-gradient-to-b from-gray-900 to-black text-white flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.9), rgba(59,130,246,0.9))" }}
          >
            <span className="font-semibold">No molestéis a Pablo</span>
            <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white" aria-label="Cerrar chat">
              ✖
            </button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  "max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap break-words " +
                  (m.role === "user" ? "ml-auto bg-gray-100 text-gray-900" : "mr-auto bg-purple-600 text-white")
                }
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-purple-500/40 bg-gray-900 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={sending}
              placeholder={sending ? "Enviando..." : "Escribe tu mensaje"}
              className="flex-1 rounded-lg px-3 py-2 bg-gray-800 text-white placeholder-gray-400 caret-white outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="rounded-lg px-4 py-2 font-semibold text-white shadow disabled:opacity-60"
              style={{ background: "linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)" }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Schedule;
