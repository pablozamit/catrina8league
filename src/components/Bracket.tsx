import React from 'react';
import { useTranslation } from 'react-i18next';
import { Player } from '../firebase/firestore';

interface BracketProps {
  players: (Player | null)[];
}

const Bracket: React.FC<BracketProps> = ({ players }) => {
  const { t } = useTranslation();

  const matchups = [
    { p1: '3C', p2: '1B' },
    { p1: '4A', p2: '2D' },
    { p1: '1A', p2: '3B' },
    { p1: '4C', p2: '2A' },
    { p1: '1D', p2: '4B' },
    { p1: '2C', p2: '3D' },
    { p1: '4D', p2: '1C' },
    { p1: '3A', p2: '2B' },
  ];

  const getPlayerBySeed = (seed: string) => {
    const seedNumber = parseInt(seed.replace(/[A-Z]/, ''));
    return players[seedNumber - 1];
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4">
        {matchups.map((matchup, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-white">
                {getPlayerBySeed(matchup.p1)?.nombre || t('playoffs.toBeDetermined')}
              </p>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <p className="text-white">
                {getPlayerBySeed(matchup.p2)?.nombre || t('playoffs.toBeDetermined')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
