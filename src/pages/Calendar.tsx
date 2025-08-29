import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { matchesService, Match } from '../firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const Calendar: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const matchesData = await matchesService.getAll();
      setMatches(matchesData);
    } catch (error) {
      console.error('Error cargando partidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener partidos de la semana actual
  const getWeekMatches = (week: number) => {
    return matches.filter(match => match.semana === week);
  };

  // Obtener grupos únicos
  const getUniqueGroups = () => {
    const groups = matches.map(match => match.grupo);
    return [...new Set(groups)];
  };

  // Agrupar partidos por grupo
  const groupMatchesByGroup = (weekMatches: Match[]) => {
    const grouped: { [key: string]: Match[] } = {};
    weekMatches.forEach(match => {
      if (!grouped[match.grupo]) {
        grouped[match.grupo] = [];
      }
      grouped[match.grupo].push(match);
    });
    return grouped;
  };

  const getLocale = () => {
    if (i18n.language === 'es') return 'es-ES';
    return 'en-US';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return t('calendar.noDate');
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(getLocale(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '20:00';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString(getLocale(), {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaxWeek = () => {
    if (matches.length === 0) return 0;
    return Math.max(...matches.map(match => match.semana));
  };

  const weekMatches = getWeekMatches(currentWeek);
  const groupedMatches = groupMatchesByGroup(weekMatches);
  const maxWeek = getMaxWeek();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400">
            {t('calendar.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('calendar.description')}
          </p>
        </motion.div>

        {/* Navegación de semanas */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center bg-black/50 rounded-lg border border-blue-500/30 p-2">
            <button
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
              className={`p-3 rounded-lg transition-all duration-300 ${
                currentWeek === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-blue-400 hover:bg-blue-600/20 hover:text-blue-300'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="px-8 py-3 text-center">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-xl font-bold text-blue-400">
                    {t('calendar.week', { week: currentWeek + 1 })}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {t('calendar.scheduledMatches', { count: weekMatches.length })}
                </p>
            </div>
            
            <button
              onClick={() => setCurrentWeek(Math.min(maxWeek, currentWeek + 1))}
              disabled={currentWeek >= maxWeek}
              className={`p-3 rounded-lg transition-all duration-300 ${
                currentWeek >= maxWeek
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-blue-400 hover:bg-blue-600/20 hover:text-blue-300'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Contenido principal */}
        {weekMatches.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-12 h-12 text-blue-400" />
            </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                {t('calendar.noMatches')}
              </h3>
              <p className="text-gray-500">
                {t('calendar.noMatchesForWeek', { week: currentWeek + 1 })}
              </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {Object.entries(groupedMatches).map(([group, groupMatches], groupIndex) => (
              <motion.div
                key={group}
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * groupIndex }}
              >
                {/* Header del grupo */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-purple-400" />
                      <h2 className="text-2xl font-bold text-purple-400">
                        {t('calendar.group', { group })}
                      </h2>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
                    <span className="text-sm text-gray-400">
                      {t('calendar.matches', { count: groupMatches.length })}
                    </span>
                </div>

                {/* Partidos del grupo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupMatches.map((match, matchIndex) => (
                    <motion.div
                      key={match.id}
                      className={`card bg-gradient-to-br ${
                        match.completado
                          ? 'from-green-900/20 to-blue-900/20 border-green-500/30'
                          : 'from-blue-900/20 to-purple-900/20 border-blue-500/30'
                      }`}
                      whileHover={{ scale: 1.02, y: -4 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 * matchIndex }}
                    >
                      {/* Estado del partido */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          match.completado
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                            : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        }`}>
                        {match.completado ? t('calendar.status.finished') : t('calendar.status.scheduled')}
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(match.fecha)}</span>
                        </div>
                      </div>

                      {/* Jugadores */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-400">
                            {match.jugador1Nombre}
                          </span>
                          {match.resultado && (
                            <span className={`text-lg font-bold ${
                              match.resultado.ganadorId === match.jugador1Id
                                ? 'text-green-400'
                                : 'text-gray-400'
                            }`}>
                              {match.resultado.setsJugador1}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-center text-gray-500 font-bold text-sm">
                          VS
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-blue-400">
                            {match.jugador2Nombre}
                          </span>
                          {match.resultado && (
                            <span className={`text-lg font-bold ${
                              match.resultado.ganadorId === match.jugador2Id
                                ? 'text-green-400'
                                : 'text-gray-400'
                            }`}>
                              {match.resultado.setsJugador2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="border-t border-gray-700/50 pt-3">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{t('calendar.location')}</span>
                          </div>
                          <span>{formatDate(match.fecha)}</span>
                        </div>
                      </div>
                      
                      {/* Ganador */}
                      {match.completado && match.resultado && (
                        <div className="mt-3 p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
                          <div className="text-center">
                            <span className="text-sm text-gray-400">{t('calendar.winner')}</span>
                            <div className="font-bold text-green-400">
                              {match.resultado.ganadorId === match.jugador1Id
                                ? match.jugador1Nombre
                                : match.jugador2Nombre}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Navegación inferior */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex space-x-2">
            {Array.from({ length: maxWeek + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentWeek(i)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                  i === currentWeek
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-black/30 text-gray-400 hover:bg-blue-600/20 hover:text-blue-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;