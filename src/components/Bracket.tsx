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
  { id: 1, p1Text: 'nica', p2Text: 'Amauris' },
  { id: 2, p1Text: 'Mina', p2Text: '3º mejor clasificado grupo 2' },
  { id: 3, p1Text: 'Mejor clasificado grupo 2', p2Text: 'Evodia' },
  { id: 4, p1Text: 'pablo', p2Text: 'Román' },
  // Lado Derecho
  { id: 5, p1Text: '2º mejor clasificado grupo 2', p2Text: 'Damián' },
  { id: 6, p1Text: 'artur', p2Text: 'nino' },
  { id: 7, p1Text: 'angel', p2Text: 'alvaro' },
  { id: 8, p1Text: 'johhny', p1Score: 3, p2Text: 'alex f.', p2Score: 5, winner: 'p2' },
];

// Estructura para cuartos de final
const quarterfinalsMatchups = [
    { id: 9, p1Text: 'Ganador de nica/Amauris', p2Text: 'Ganador de Mina/3º mejor clasificado grupo 2' },
    { id: 10, p1Text: 'Ganador de Mejor clasificado grupo 2/Evodia', p2Text: 'Ganador de pablo/Román' },
    { id: 11, p1Text: 'Ganador de 2º mejor clasificado grupo 2/Damián', p2Text: 'Ganador de artur/nino' },
    { id: 12, p1Text: 'Ganador de angel/alvaro', p2Text: 'alex f.' },
];

// Componente para un slot de texto en el bracket
interface TextSlotProps {
  text: string;
  score?: number;
  isWinner?: boolean;
}

const TextSlot: React.FC<TextSlotProps> = ({ text, score, isWinner }) => {
  // Detectar si es un placeholder genérico para darle un estilo diferente
  const isPlaceholder = text.toLowerCase().includes('clasificado') || text.toLowerCase().includes('ganador de');
  const winnerClass = isWinner ? 'border-green-400/80 shadow-lg shadow-green-500/20' : 'border-gray-700/50';
  const textColor = isWinner ? 'text-green-300' : (isPlaceholder ? 'text-gray-400 italic text-sm' : 'text-orange-300');

  return (
    <div className={`bg-gray-800/60 p-3 rounded border min-h-[50px] flex items-center justify-between shadow-inner ${winnerClass}`}>
      <span className={`text-base font-semibold truncate ${textColor}`}>
        {text}
      </span>
      {score !== undefined && (
        <span className={`text-xl font-bold ${isWinner ? 'text-green-300' : 'text-gray-400'}`}>
          {score}
        </span>
      )}
    </div>
  );
};

// Componente principal del Bracket (simplificado)
const Bracket: React.FC<BracketProps> = () => {
  const { t } = useTranslation(); // Lo mantenemos por si se usa en Playoffs.tsx
  const leftMatchups = roundOf16Matchups.slice(0, 4);
  const rightMatchups = roundOf16Matchups.slice(4, 8);

  return (
    // Contenedor principal para todo el bracket
    <div className="flex justify-between items-start w-full gap-4 md:gap-8 lg:gap-12 px-2">

      {/* Columna Izquierda: Octavos y Cuartos */}
      <div className="flex w-2/5">
        {/* Octavos de Final - Izquierda */}
        <div className="flex flex-col justify-around gap-y-10 md:gap-y-16 w-1/2">
          {leftMatchups.map((matchup) => (
            <div key={matchup.id} className="flex flex-col space-y-1 bg-black/40 p-3 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-900/40">
              <TextSlot text={matchup.p1Text} />
              <div className="text-center text-xs font-bold text-red-400 py-1">VS</div>
              <TextSlot text={matchup.p2Text} />
            </div>
          ))}
        </div>
        {/* Cuartos de Final - Izquierda */}
        <div className="flex flex-col justify-around gap-y-24 md:gap-y-48 w-1/2 pt-12 md:pt-24 pl-4">
          {quarterfinalsMatchups.slice(0, 2).map((matchup) => (
            <div key={matchup.id} className="flex flex-col space-y-1 bg-black/30 p-3 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-900/40">
              <TextSlot text={matchup.p1Text} />
              <div className="text-center text-xs font-bold text-red-400 py-1">VS</div>
              <TextSlot text={matchup.p2Text} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Columna Central (para Semifinales/Final) */}
      <div className="flex flex-col justify-center items-center w-1/5 pt-24 md:pt-48">
          <div className="text-gray-600 italic">Semifinales</div>
      </div>

      {/* Columna Derecha: Cuartos y Octavos */}
      <div className="flex w-2/5">
        {/* Cuartos de Final - Derecha */}
        <div className="flex flex-col justify-around gap-y-24 md:gap-y-48 w-1/2 pt-12 md:pt-24 pr-4">
          {quarterfinalsMatchups.slice(2, 4).map((matchup) => (
            <div key={matchup.id} className="flex flex-col space-y-1 bg-black/30 p-3 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-900/40">
              <TextSlot text={matchup.p1Text} />
              <div className="text-center text-xs font-bold text-red-400 py-1">VS</div>
              <TextSlot text={matchup.p2Text} />
            </div>
          ))}
        </div>
        {/* Octavos de Final - Derecha */}
        <div className="flex flex-col justify-around gap-y-10 md:gap-y-16 w-1/2">
          {rightMatchups.map((matchup) => (
            <div key={matchup.id} className="flex flex-col space-y-1 bg-black/40 p-3 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-900/40">
            <TextSlot 
              text={matchup.p1Text} 
              score={matchup.p1Score} 
              isWinner={matchup.winner === 'p1'} 
            />
            <div className="text-center text-xs font-bold text-red-400 py-1">VS</div>
            <TextSlot 
              text={matchup.p2Text} 
              score={matchup.p2Score} 
              isWinner={matchup.winner === 'p2'} 
            />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Bracket;
