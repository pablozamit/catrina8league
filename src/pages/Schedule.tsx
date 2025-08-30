import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

type Message = { id: string; role: "user" | "bot"; text: string };

const WEBHOOK_URL =
  "https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78";

const Schedule: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "bot", text: "👋 Soy El Marcador, dime cuándo quieres jugar." },
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
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message: text }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      const reply =
        (data && (data.output || data.answer || data.text || data.response)) ||
        (typeof data === "string" ? data : "No entendí nada 🤔");

      setMessages((m) => [...m, { id: Math.random().toString(), role: "bot", text: reply }]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { id: Math.random().toString(), role: "bot", text: "❌ Error al conectar con el asistente." },
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
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-700">
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
            <p className="text-gray-300">
              Usa el botón de chat abajo a la derecha para hablar con "El Marcador".
            </p>
          </div>
        </div>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-500 rounded-full shadow-xl text-white text-2xl flex items-center justify-center z-50"
      >
        💬
      </button>

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[480px] bg-gray-900 text-white rounded-2xl shadow-2xl border border-purple-500/40 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-purple-600 px-4 py-3 flex items-center justify-between">
            <span className="font-semibold">El Marcador</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-gray-200 text-gray-900"
                    : "mr-auto bg-purple-600 text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={sending}
              placeholder={sending ? "Enviando..." : "Escribe tu mensaje"}
              className="flex-1 rounded-lg px-3 py-2 text-gray-900"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-3 py-2"
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
