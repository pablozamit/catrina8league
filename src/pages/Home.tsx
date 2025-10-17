import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Ghost, Sparkles, Spider, Bat } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Ghost,
      title: 'Calendario Embrujado',
      description: 'Consulta la programación de partidos espectrales',
      link: '/calendario',
      color: 'text-orange-400',
    },
    {
      icon: Sparkles,
      title: 'Clasificaciones Mágicas',
      description: 'Revisa las posiciones de la liga de brujas y magos',
      link: '/clasificaciones',
      color: 'text-purple-400',
    },
    {
      icon: Spider,
      title: 'Programar Hechizo',
      description: 'Usa el asistente para agendar tu encantamiento',
      link: '/programar',
      color: 'text-lime-400',
    },
  ];
  return (
    <div className="min-h-screen">
      <motion.section
        className="relative py-20 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-black/20 to-purple-900/20" />
        <motion.div
          className="absolute top-0 right-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Spider className="w-16 h-16 text-gray-400" />
        </motion.div>
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_70%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold animate-glow-orange"
          >
            {t('home.title')}
          </motion.h1>
          <LanguageSelector />
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 relative">
        <motion.div
          className="absolute top-1/2 left-10"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Bat className="w-12 h-12 text-purple-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-center mb-12">
          Explora la Liga de las Sombras
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.link}
                to={feature.link}
                className="group block p-6 rounded-lg border border-gray-700 bg-black/40 hover:bg-black/60 transition"
              >
                <Icon className={`w-10 h-10 mb-4 ${feature.color}`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;

