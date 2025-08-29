import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Widget n8n legacy (script externo) ---
declare global {
  interface Window {
    n8nChat?: {
      init: (options: { chatUrl: string }) => void;
    };
  }
}

const N8N_HOST = 'https://n8n.srv907628.hstgr.cloud';
const WEBHOOK_ID = '08edf318-16cd-4aa4-81a5-ea5e4013be78';

// --- LÍNEA CORREGIDA ---
// La URL correcta para la inicialización del chat ES la del webhook.
const CHAT_URL = `${N8N_HOST}/webhook/${WEBHOOK_ID}/chat`;

const Schedule: React.FC = () => {
  useEffect(() => {
    const LOG_PREFIX = '[N8N WIDGET]';
    console.log(`${LOG_PREFIX} Montando Schedule y cargando widget.`);

    if ((window as any).__n8nWidgetLoaded) {
      console.log(`${LOG_PREFIX} Ya estaba cargado, salgo.`);
      return;
    }

    const styleId = 'n8n-chat-widget-style';
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = `${N8N_HOST}/chat/widget.css`;
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';
      link.onerror = () => console.error(`${LOG_PREFIX} Error cargando widget.css`);
      document.head.appendChild(link);
    }

    const scriptId = 'n8n-chat-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `${N8N_HOST}/chat/widget.js`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';

      script.onload = () => {
        console.log(`${LOG_PREFIX} widget.js cargado. Inicializando…`);
        const init = () => {
          if (window.n8nChat && typeof window.n8nChat.init === 'function') {
            try {
              window.n8nChat.init({ chatUrl: CHAT_URL });
              (window as any).__n8nWidgetLoaded = true;
              console.log(`${LOG_PREFIX} init() OK con chatUrl=${CHAT_URL}`);
            } catch (e) {
              console.error(`${LOG_PREFIX} Error en init()`, e);
            }
          } else {
            console.warn(`${LOG_PREFIX} window.n8nChat aún no disponible; reintento en 300ms…`);
            setTimeout(init, 300);
          }
        };
        init();
      };

      script.onerror = () => {
        console.error(`${LOG_PREFIX} Error cargando widget.js desde ${script.src}`);
      };

      document.body.appendChild(script);
    }

    return () => {
      // Limpieza opcional
    };
  }, []);

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
        <div className="flex-1 lg:w-1/3">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Asistente de Partidos</h2>
          <div className="card bg-black/30 border-purple-500/30 p-6 h-full">
            <p className="text-gray-300">
              Usa el asistente de chat que aparece en la <strong>esquina inferior derecha</strong> para hablar con "El Marcador" y agendar tu partida.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;
