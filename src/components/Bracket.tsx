import React from 'react';
import { useTranslation } from 'react-i18next';
// No necesitamos Player de firestore aquí si solo mostramos texto
// import { Player } from '../firebase/firestore';

interface BracketProps {
  // Ya no necesitamos pasarle los jugadores por ahora
}

// Define la estructura fija con los textos EXACTOS de tu HTML
const roundOf16Matchups = [
  // Lado Izquierdo
  { id: 1, p1Text: 'nica',   p2Text: 'Amauris' },
  { id: 2, p1Text: '2º mejor clasificado grupo 3', p2Text: '3º mejor clasificado grupo 2' },
  { id: 3, p1Text: 'Mejor clasificado grupo 2', p2Text: '2º mejor clasificado grupo 4' },
  { id: 4, p1Text: 'pablo', p2Text: 'Mejor clasificado grupo 3' },
  // Lado Derecho
  { id: 5, p1Text: '2º mejor clasificado grupo 2', p2Text: 'Mejor clasificado grupo 4' },
  { id: 6, p1Text: 'artur',  p2Text: 'nino' },
  { id: 7, p1Text: 'angel',  p2Text: 'alvaro' },
  { id: 8, p1Text: 'johhny', p2Text: 'alex f.' },
];

// Componente para un slot de texto en el bracket
const TextSlot: React.FC<{ text: string }> = ({ text }) => {
  // Detectar si es un placeholder genérico para darle un estilo diferente (opcional)
  const isPlaceholder = text.toLowerCase().includes('clasificado');
  return (
    <div className={`bg-gray-800/60 p-3 rounded border border-gray-700/50 min-h-[50px] flex items-center shadow-inner ${isPlaceholder ? 'opacity-70' : ''}`}>
      <span className={`text-base font-semibold truncate ${isPlaceholder ? 'text-gray-400 italic text-sm' : 'text-orange-300'}`}>
        {text}
      </span>
    </div>
  );
};

// Componente principal del Bracket (simplificado)
const Bracket: React.FC<BracketProps> = () => {
  const { t } = useTranslation(); // Lo mantenemos por si se usa en Playoffs.tsx
  const leftMatchups = roundOf16Matchups.slice(0, 4);
  const rightMatchups = roundOf16Matchups.slice(4, 8);

  return (
    // Contenedor principal usando flex para lados izquierdo/derecho
    <div className="flex flex-col md:flex-row justify-between w-full gap-8 md:gap-16 lg:gap-24 px-4">

      {/* Columna Izquierda (Octavos) */}
      <div className="flex flex-col justify-around gap-y-10 md:gap-y-16">
        {leftMatchups.map((matchup) => (
          <div key={matchup.id} className="flex flex-col space-y-1 bg-black/40 p-3 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-900/40">
            <TextSlot text={matchup.p1Text} />
            <div className="text-center text-xs font-bold text-red-400 py-1">VS</div>
            <TextSlot text={matchup.p2Text} />
          </div>
        ))}
      </div>

       {/* Espacio Central (para futuras rondas y líneas) */}
       <div className="hidden md:flex flex-col items-center justify-center">
           <div className="text-gray-600 italic">Futuras Rondas</div>
       </div>

      {/* Columna Derecha (Octavos) */}
      <div className="flex flex-col justify-around gap-y-10 md:gap-y-16">
        {rightMatchups.map((matchup) => (
          <div key={matchup.id} className="flex flex-col space-y-1 bg-black/40 p-3 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-900/40">
            <TextSlot text={matchup.p1Text} />
            <div className="text-center text-xs font-bold text-red-400 py-1">VS</div>
            <TextSlot text={matchup.p2Text} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default Bracket;
