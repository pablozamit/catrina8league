import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Target, TrendingUp, Users } from 'lucide-react';
import { playersService, groupsService, Player, Group } from '../firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';

const Standings: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, groupsData] = await Promise.all([
        playersService.getAll(),
        groupsService.getAll()
      ]);
      setPlayers(playersData);
      setGroups(groupsData);
      
      // Seleccionar el primer grupo por defecto
      if (groupsData.length > 0 && !selectedGroup) {
        setSelectedGroup(groupsData[0].nombre);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener jugadores del grupo seleccionado ordenados por puntos
  const getGroupPlayers = (groupName: string) => {
    return players
      .filter(player => player.grupo === groupName)
      .sort((a, b) => {
        // Ordenar por puntos descendente, luego por diferencia de sets
        if (b.puntos !== a.puntos) {
          return b.puntos - a.puntos;
        }
        const diffA = a.setsGanados - a.setsPerdidos;
        const diffB = b.setsGanados - b.setsPerdidos;
        if (diffB !== diffA) {
          return diffB - diffA;
        }
        // Si empatan en puntos y diferencia, ordenar por sets ganados
        return b.setsGanados - a.setsGanados;
      });
  };

  // Calcular estadísticas del grupo
  const getGroupStats = (groupName: string) => {
    const groupPlayers = players.filter(player => player.grupo === groupName);
    return {
      totalPlayers: groupPlayers.length,
      totalMatches: groupPlayers.reduce((sum, player) => sum + player.partidosJugados, 0) / 2,
      totalSets: groupPlayers.reduce((sum, player) => sum + player.setsGanados + player.setsPerdidos, 0) / 2
    };
  };

  // Obtener icono de posición
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-6 h-6 text-gold-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{position}</span>;
    }
  };

  // Calcular porcentaje de victorias
  const getWinPercentage = (player: Player) => {
    if (player.partidosJugados === 0) return 0;
    return Math.round((player.partidosGanados / player.partidosJugados) * 100);
  };

  // Obtener color según la posición
  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-900/30 to-gold-900/30 border-gold-500/50';
      case 2:
        return 'from-gray-800/30 to-gray-700/30 border-gray-400/50';
      case 3:
        return 'from-orange-900/30 to-red-900/30 border-orange-500/50';
      default:
        return 'from-blue-900/20 to-purple-900/20 border-blue-500/30';
    }
  };

  const groupPlayers = selectedGroup ? getGroupPlayers(selectedGroup) : [];
  const groupStats = selectedGroup ? getGroupStats(selectedGroup) : null;

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gold-400">
            Clasificaciones
          </h1>
          <p className="text-xl text-gray-300">
            Consulta las posiciones y estadísticas de cada grupo
          </p>
        </motion.div>

        {/* Selector de grupos */}
        {groups.length > 0 && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-wrap justify-center gap-2 bg-black/50 rounded-lg p-2 border border-purple-500/30">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.nombre)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedGroup === group.nombre
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-400 hover:text-purple-400 hover:bg-purple-600/20'
                  }`}
                >
                  <Users className="inline-block w-5 h-5 mr-2" />
                  Grupo {group.nombre}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedGroup && groupStats && (
          <>
            {/* Estadísticas del grupo */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="card bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{groupStats.totalPlayers}</div>
                <div className="text-gray-400">Jugadores</div>
              </div>
              <div className="card bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30 text-center">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{groupStats.totalMatches}</div>
                <div className="text-gray-400">Partidos Jugados</div>
              </div>
              <div className="card bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">{groupStats.totalSets}</div>
                <div className="text-gray-400">Sets Jugados</div>
              </div>
            </motion.div>

            {/* Tabla de clasificación */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
                Clasificación - Grupo {selectedGroup}
              </h2>

              {groupPlayers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    No hay jugadores en este grupo
                  </h3>
                  <p className="text-gray-500">
                    Agrega jugadores desde el panel de administración
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groupPlayers.map((player, index) => {
                    const position = index + 1;
                    const winPercentage = getWinPercentage(player);
                    const setsDiff = player.setsGanados - player.setsPerdidos;
                    
                    return (
                      <motion.div
                        key={player.id}
                        className={`card bg-gradient-to-r ${getPositionColor(position)} hover:scale-[1.02] transition-all duration-300`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * index }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Posición */}
                          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                            {getPositionIcon(position)}
                          </div>

                          {/* Información del jugador */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg font-bold truncate ${
                                position <= 3 ? 'text-white' : 'text-blue-400'
                              }`}>
                                {player.nombre} {player.apellidos}
                              </h3>
                              <div className="text-right">
                                <div className={`text-xl font-bold ${
                                  position <= 3 ? 'text-white' : 'text-blue-400'
                                }`}>
                                  {player.puntos} pts
                                </div>
                              </div>
                            </div>
                            
                            {/* Estadísticas */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3 text-sm">
                              <div className="text-center">
                                <div className="text-gray-400">Partidos</div>
                                <div className="font-semibold text-white">
                                  {player.partidosJugados}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-400">Ganados</div>
                                <div className="font-semibold text-green-400">
                                  {player.partidosGanados}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-400">Perdidos</div>
                                <div className="font-semibold text-red-400">
                                  {player.partidosPerdidos}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-400">Sets +/-</div>
                                <div className={`font-semibold ${
                                  setsDiff > 0 ? 'text-green-400' : setsDiff < 0 ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                  {setsDiff > 0 ? '+' : ''}{setsDiff}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-400">% Victoria</div>
                                <div className={`font-semibold ${
                                  winPercentage >= 70 ? 'text-green-400' :
                                  winPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {winPercentage}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Barra de progreso para % de victorias */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${
                                winPercentage >= 70 ? 'bg-green-400' :
                                winPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${winPercentage}%` }}
                              transition={{ duration: 1, delay: 0.1 * index }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Leyenda */}
            <motion.div
              className="mt-8 p-6 bg-black/30 rounded-lg border border-gray-700/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-300 mb-4">Leyenda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <strong className="text-white">Sistema de Puntuación:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Victoria: 3 puntos</li>
                    <li>• Derrota: 0 puntos</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-white">Criterios de Desempate:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• 1. Mayor puntuación</li>
                    <li>• 2. Mejor diferencia de sets</li>
                    <li>• 3. Mayor número de sets ganados</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Standings;