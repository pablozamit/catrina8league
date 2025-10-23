import React from 'react'; // Eliminados useState y useEffect
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// Eliminados imports de firestore, classification, seeding, LoadingSpinner
import Bracket from '../components/Bracket'; // Mantenemos la importación del Bracket

const Playoffs: React.FC = () => {
  const { t } = useTranslation();
  // Eliminados los estados loading y seededPlayers
  // Eliminado el useEffect para fetchPlayers

  // Ya no se necesita el estado de carga
  // if (loading) {
  //   return <LoadingSpinner />;
  // }

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

      {/* Renderiza Bracket sin pasarle props */}
      <Bracket />

    </div>
  );
};

export default Playoffs;
