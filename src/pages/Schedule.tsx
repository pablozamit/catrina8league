import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Hacemos que 'n8nChat' esté disponible globalmente para TypeScript
declare global {
  interface Window {
    n8nChat: {
      init: (options: { chatUrl: string }) => void;
    };
  }
}

const Schedule: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Revisa si los elementos del widget ya existen para no duplicarlos
    if (document.getElementById('n8n-chat-widget-script')) {
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

    // La inicialización debe ocurrir DESPUÉS de que el script se cargue
    script.onload = () => {
      if (window.n8nChat) {
        window.n8nChat.init({
          chatUrl: "https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78/chat",
        });
      }
    };
    
    document.body.appendChild(script);

    // Limpieza al salir de la página
    return () => {
      const scriptElement = document.getElementById('n8n-chat-widget-script');
      const linkElement = document.getElementById('n8n-chat-widget-style');
      if (scriptElement) document.body.removeChild(scriptElement);
      if (linkElement) document.head.removeChild(linkElement);
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
        
        {/* Columna del Calendario */}
        <div className="flex-1 lg:w-2/3">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Calendario de Referencia</h2>
          <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
            <iframe 
              src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FMadrid&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK&title=La%20Catrina%20Pool%20League&src=MjZiMmIxNGVmZGI4OGMwZjM4MGNhYjkzZjU5YjM0NjczOTcwMWRlZWEyNmEwMWM3YmUwZmE2ZDE0YjIwYTQ5MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237cb342" 
              style={{ border: 'solid 1px #777' }} 
              width="100%" 
              height="600" 
              frameBorder="0" 
              scrolling="no"
            ></iframe>
          </div>
        </div>

        {/* Columna de Instrucciones para el Chat */}
        <div className="flex-1 lg:w-1/3">
           <h2 className="text-2xl font-bold text-purple-400 mb-4">Asistente de Partidos</h2>
           <div className="card bg-black/30 border-purple-500/30 p-6 h-full">
            <p className="text-gray-300">
              Usa el asistente de chat que aparece en la **esquina inferior derecha** para hablar con "El Marcador" y agendar tu partida.
            </p>
            <p className="text-gray-400 mt-4 text-sm">
              Asegúrate de tener claros los nombres de los dos jugadores y algunas fechas posibles antes de empezar.
            </p>
           </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Schedule;
