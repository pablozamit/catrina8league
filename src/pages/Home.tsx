import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, Settings } from 'lucide-react';

const Home: React.FC = () => {
  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Características de la liga
  const features = [
    {
      icon: Calendar,
      title: 'Calendario',
      description: 'Consulta próximos partidos y horarios',
      link: '/calendario',
      color: 'blue'
    },
    {
      icon: Trophy,
      title: 'Clasificaciones',
      description: 'Posiciones actuales de todos los grupos',
      link: '/clasificaciones',
      color: 'gold'
    },
    {
      icon: Users,
      title: 'Jugadores',
      description: 'Perfiles y estadísticas completas',
      link: '/clasificaciones',
      color: 'green'
    },
    {
      icon: Settings,
      title: 'Administración',
      description: 'Panel de control para organizadores',
      link: '/admin',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Fondos decorativos */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20" />
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.1),transparent_70%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4 animate-glow">
              Liga de Billar
            </h1>
            <motion.div
              className="text-2xl md:text-4xl text-gold-400 font-semibold mb-8"
              animate={{ 
                textShadow: [
                  "0 0 7px #fbbf24",
                  "0 0 10px #fbbf24",
                  "0 0 21px #fbbf24",
                  "0 0 42px #fbbf24",
                  "0 0 10px #fbbf24",
                  "0 0 7px #fbbf24"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Rock & Cocktails
            </motion.div>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Donde la precisión del billar se encuentra con la energía del rock clásico 
            y la sofisticación de los mejores cócteles. ¡Únete a la competición más épica!
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link 
              to="/calendario" 
              className="btn btn-primary px-8 py-4 text-lg font-semibold"
            >
              Ver Calendario
            </Link>
            <Link 
              to="/clasificaciones" 
              className="btn btn-secondary px-8 py-4 text-lg font-semibold"
            >
              Clasificaciones
            </Link>
          </motion.div>
        </div>

        {/* Elementos decorativos animados */}
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-3 h-3 bg-green-400 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 bg-black/30"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gold-400"
            variants={itemVariants}
          >
            Explora la Liga
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <Link to={feature.link}>
                    <div className={`card p-8 text-center h-full bg-gradient-to-br from-${feature.color}-900/20 to-transparent border-${feature.color}-500/30 hover:border-${feature.color}-400/60 transition-all duration-300`}>
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${feature.color}-500/20 flex items-center justify-center group-hover:bg-${feature.color}-500/30 transition-all duration-300`}>
                        <Icon className={`w-8 h-8 text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <h3 className={`text-xl font-semibold mb-4 text-${feature.color}-400 group-hover:text-${feature.color}-300`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-purple-400">
            La Liga en Números
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="card bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center p-8">
                <div className="text-5xl font-bold text-blue-400 mb-2 animate-glow">24</div>
                <div className="text-xl text-gray-300">Jugadores Activos</div>
              </div>
            </motion.div>
            
            <motion.div
              className="card bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center p-8">
                <div className="text-5xl font-bold text-green-400 mb-2 animate-glow">156</div>
                <div className="text-xl text-gray-300">Partidos Jugados</div>
              </div>
            </motion.div>
            
            <motion.div
              className="card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center p-8">
                <div className="text-5xl font-bold text-purple-400 mb-2 animate-glow">4</div>
                <div className="text-xl text-gray-300">Grupos Activos</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;