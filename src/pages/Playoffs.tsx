import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { playersService, matchesService, Player, Match } from '../firebase/firestore';
import { calculateQualificationStatus } from '../utils/classification';
import { assignSeeds } from '../utils/seeding';
import LoadingSpinner from '../components/LoadingSpinner';
import Bracket from '../components/Bracket';

const Playoffs: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [seededPlayers, setSeededPlayers] = useState<(Player | null)[]>([]);

  useEffect(() => {
    const fetchPlayersAndMatches = async () => {
      setLoading(true);
      const [allPlayers, allMatches] = await Promise.all([
        playersService.getAll(),
        matchesService.getAll(),
      ]);
      const qualified = allPlayers.filter(
        (player) =>
          calculateQualificationStatus(player, allPlayers, allMatches) ===
          'qualified',
      );
      setSeededPlayers(assignSeeds(qualified));
      setLoading(false);
    };

    fetchPlayersAndMatches();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-400 animate-glow-orange">
          {t('playoffs.title')}
        </h1>
        <h2 className="text-2xl text-gray-300">{t('playoffs.roundOf16')}</h2>
      </motion.div>

      <Bracket players={seededPlayers} />
    </div>
  );
};

export default Playoffs;
