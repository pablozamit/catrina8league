import React from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../firebase/firestore';

interface BracketProps {
  // Recibe el array de 16 jugadores/null, indexado por seed-1
  players: (Player | null)[];
}

// Define la estructura fija de los 8 enfrentamientos de octavos por número de seed (1-16)
const roundOf16matchups = [ // <-- CORRECCIÓN AQUÍ
  { seed1: 1, seed2: 16 }, // Match 1
  { seed1: 8, seed2: 9 }, // Match 2
  { seed1: 5, seed2: 12 }, // Match 3
  { seed1: 4, seed2: 13 }, // Match 4
  { seed1: 6, seed2: 11 }, // Match 5
  { seed1: 3, seed2: 14 }, // Match 6
  { seed1: 7, seed2: 10 }, // Match 7
  { seed1: 2, seed2: 15 }, // Match 8
];

const Bracket: React.FC<BracketProps> = ({ players }) => {
  const { t } = useTranslation();

  // Función auxiliar para obtener el jugador por su seed (1-16)
  const getPlayerBySeedNumber = (seedNumber: number): Player | null => {
    if (seedNumber < 1 || seedNumber > 16) return null;
    return players[seedNumber - 1]; // Accede al array usando índice 0-15
  };

  return (
    <div className="flex justify-center p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Mapea la estructura de enfrentamientos */}
        {roundOf16matchups.map((matchup, index) => { // <-- CORRECCIÓN AQUÍ
          const player1 = getPlayerBySeedNumber(matchup.seed1);
          const player2 = getPlayerBySeedNumber(matchup.seed2);

          return (
            // Contenedor para cada enfrentamiento
            <div
              key={index}
              className="flex flex-col space-y-1 bg-black/30 p-3 rounded-lg border border-purple-500/30 shadow-lg shadow-purple-900/20"
            >
              {/* Slot Jugador 1 */}
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700/50 min-h-[50px] flex items-center">
                <span className="text-sm font-medium text-orange-300 truncate">
                  {/* Muestra el número de seed y el nombre o 'Por determinar' */}
                  <span className="font-bold text-purple-400 mr-2">
                    {matchup.seed1}.
                  </span>
                  {player1 ? player1.nombre : t('playoffs.toBeDetermined')}
                </span>
              </div>
              {/* Separador VS */}
              <div className="text-center text-xs font-bold text-gray-400 py-1">
                VS
              </div>
              {/* Slot Jugador 2 */}
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700/50 min-h-[50px] flex items-center">
                <span className="text-sm font-medium text-orange-300 truncate">
                  {/* Muestra el número de seed y el nombre o 'Por determinar' */}
                  <span className="font-bold text-purple-400 mr-2">
                    {matchup.seed2}.
                  </span>
                  {player2 ? player2.nombre : t('playoffs.toBeDetermined')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bracket;
