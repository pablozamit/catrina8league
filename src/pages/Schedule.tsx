import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// --- No hay cambios aquí ---
declare global {
  interface Window {
    n8nChat: {
      init: (options: { chatUrl: string }) => void;
    };
  }
}

const Schedule: React.FC = () => {
  useEffect(() => {
    // --- CÓDIGO DE DIAGNÓSTICO ---
    console.log("PASO 1: El componente Schedule se ha montado. Empezando a cargar el widget de n8n.");

    if (document.getElementById('n8n-chat-widget-script')) {
      console.log("AVISO: El script del widget ya existía. No se volverá a cargar.");
      return;
    }

    const link = document.createElement('link');
    link.id = 'n8n-chat-widget-style';
    link.rel = 'stylesheet';
    link.href = 'https://n8n.srv907628.hstgr.cloud/chat/widget.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.id = 'n8n-chat-widget-script';
    script.src = 'https://n8n.srv907628.hstgr.cloud/chat/widget.js';
    script.async = true;

    script.onload = () => {
      console.log("PASO 2: El script 'widget.js' se ha cargado correctamente (evento onload ejecutado).");
      if (window.n8nChat && typeof window.n8nChat.init === 'function') {
        console.log("PASO 3: El objeto 'window.n8nChat' y su función 'init' existen. Procediendo a inicializar.");
        try {
          window.n8nChat.init({
            chatUrl: "https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78/chat",
          });
          console.log("PASO 4: La función 'n8nChat.init()' se ha llamado sin errores.");
        } catch (error) {
          console.error("ERROR EN EL PASO 4: Falló al llamar a 'n8nChat.init()'.", error);
        }
      } else {
        console.error("ERROR EN EL PASO 3: El objeto 'window.n8nChat' o la función 'init' NO existen después de cargar el script.");
      }
    };

    script.onerror = () => {
        console.error("ERROR EN EL PASO 2: Hubo un error al cargar el script 'widget.js'.");
    };
    
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById('n8n-chat-widget-script');
      const linkElement = document.getElementById('n8n-chat-widget-style');
      if (scriptElement) document.body.removeChild(scriptElement);
      if (linkElement) document.head.removeChild(linkElement);
      console.log("AVISO: El componente Schedule se ha desmontado y los scripts se han limpiado.");
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
              Usa el asistente de chat que aparece en la **esquina inferior derecha** para hablar con "El Marcador" y agendar tu partida.
            </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;
