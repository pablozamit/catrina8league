import React, { useEffect } from 'react';

const Schedule: React.FC = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://n8n.srv907628.hstgr.cloud/chat/widget.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://n8n.srv907628.hstgr.cloud/chat/widget.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.n8nChat) {
        // @ts-ignore
        window.n8nChat.init('https://n8n.srv907628.hstgr.cloud/webhook/08edf318-16cd-4aa4-81a5-ea5e4013be78/chat');
      }
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Programar un Partido</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FMadrid&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK&title=La%20Catrina%20Pool%20League&src=MjZiMmIxNGVmZGI4OGMwZjM4MGNhYjkzZjU5YjM0NjczOTcwMWRlZWEyNmEwMWM3YmUwZmE2ZDE0YjIwYTQ5MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237cb342"
            style={{ border: 'solid 1px #777', width: '100%', height: '600px' }}
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
        <div>
          <div id="n8n-chat-widget" />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
