import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, MessageCircle } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Calendar,
      title: 'Calendario',
      description: 'Consulta la programación de partidos',
      link: '/calendario',
      color: 'text-blue-400',
    },
    {
      icon: Trophy,
      title: 'Clasificaciones',
      description: 'Revisa las posiciones de la liga',
      link: '/clasificaciones',
      color: 'text-green-400',
    },
    {
      icon: MessageCircle,
      title: 'Programar Partido',
      description: 'Usa el asistente para agendar tu partida',
      link: '/programar',
      color: 'text-red-400',
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20" />
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.1),transparent_70%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold animate-glow"
          >
            {t('home.title')}
          </motion.h1>
          <LanguageSelector />
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Explora la Liga</h2>
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

