import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

const Schedule: React.FC = () => {
  useEffect(() => {
    if ((window as any).__n8nChatMounted) return;
    (window as any).__n8nChatMounted = true;

    createChat({
      webhookUrl: 'https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78',
      mode: 'window',
      showWelcomeScreen: false,
    });
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
              Usa el botón de chat de la esquina inferior derecha para hablar con "El Marcador" y agendar tu partida.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;
