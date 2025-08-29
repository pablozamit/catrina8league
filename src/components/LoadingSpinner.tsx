import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-400 rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-purple-400 font-semibold animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          {t('loading')}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingSpinner;