import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Shield,
  Save,
  X,
  Scroll,
  Download,
  Swords,
  Trophy,
} from 'lucide-react';
import { exportToCsv, exportToJson } from '../utils/export';
import {
  playersService,
  groupsService,
  matchesService,
  playoffsService,
  Player,
  Group,
  Match,
  Timestamp,
  db,
  doc,
  writeBatch,
} from '../firebase/firestore';
import { getDoc } from 'firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [
    activeTab,
    setActiveTab,
  ] = useState<'players' | 'groups' | 'results' | 'playoffs'>('players');
  const [playoffPlayers, setPlayoffPlayers] = useState<(string | null)[]>(
    Array(16).fill(null),
  );
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [playerForm, setPlayerForm] = useState({
    nombre: '',
    grupo: '',
    esNovato: false,
  });

  const [groupForm, setGroupForm] = useState({
    nombre: '',
  });

  const [resultForm, setResultForm] = useState({
    setsJugador1: 0,
    setsJugador2: 0,
  });

  useEffect(() => {
    loadData();
    loadPlayoffData();
  }, []);

  const loadPlayoffData = async () => {
    const players = await playoffsService.getPlayoffPlayers();
    setPlayoffPlayers(players.map((p) => p?.id || null));
  };

  const handlePlayoffPlayerChange = (index: number, playerId: string) => {
    const newPlayoffPlayers = [...playoffPlayers];
    newPlayoffPlayers[index] = playerId || null;
    setPlayoffPlayers(newPlayoffPlayers);
  };

  const handleSavePlayoffs = async () => {
    try {
      await playoffsService.setPlayoffPlayers(playoffPlayers);
      alert('Clasificados a playoffs guardados correctamente.');
    } catch (error) {
      console.error('Error guardando clasificados a playoffs:', error);
      alert('Error guardando clasificados a playoffs.');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, groupsData, matchesData] = await Promise.all([
        playersService.getAll(),
        groupsService.getAll(),
        matchesService.getAll(),
      ]);
      setPlayers(playersData);
      setGroups(groupsData);
      setMatches(matchesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const playerData = {
        ...playerForm,
        partidasJugadas: 0,
        partidasGanadas: 0,
        partidasPerdidas: 0,
        juegosGanados: 0,
        juegosPerdidos: 0,
        puntos: 0,
      };

      if (editingPlayer) {
        await playersService.update(editingPlayer.id!, playerData);
      } else {
        await playersService.add(playerData);
      }

      setPlayerForm({ nombre: '', grupo: '', esNovato: false });
      setEditingPlayer(null);
      setShowPlayerForm(false);
      loadData();
    } catch (error) {
      console.error('Error guardando jugador:', error);
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const groupData = {
        nombre: groupForm.nombre,
        numeroDeJugadores: 8,
        jugadoresQueClasifican: 4,
      };

      if (editingGroup) {
        await groupsService.update(editingGroup.id!, groupData);
      } else {
        await groupsService.add(groupData);
      }

      setGroupForm({ nombre: '' });
      setEditingGroup(null);
      setShowGroupForm(false);
      loadData();
    } catch (error) {
      console.error('Error guardando grupo:', error);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setPlayerForm({
      nombre: player.nombre,
      grupo: player.grupo,
      esNovato: player.esNovato,
    });
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setGroupForm({
      nombre: group.nombre,
    });
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleDeletePlayer = async (id: string) => {
    if (window.confirm('¿Estás seguro de desterrar a este jugador?')) {
      try {
        await playersService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error desterrando jugador:', error);
      }
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (window.confirm('¿Estás seguro de disolver este clan?')) {
      try {
        await groupsService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error disolviendo clan:', error);
      }
    }
  };

  const generateRoundRobin = (
    players: Player[],
    groupName: string,
  ): Omit<Match, 'id'>[] => {
    const list = [...players];
    const n = list.length;
    const rounds = n - 1;
    const matches: Omit<Match, 'id'>[] = [];
    const startDate = new Date('2025-09-08T00:00:00');

    for (let round = 0; round < rounds; round++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + round * 7);

      for (let i = 0; i < n / 2; i++) {
        const p1 = list[i];
        const p2 = list[n - 1 - i];
        matches.push({
          jugador1Id: p1.id!,
          jugador2Id: p2.id!,
          jugador1Nombre: p1.nombre,
          jugador2Nombre: p2.nombre,
          grupo: groupName,
          semana: round + 1,
          completado: false,
          fecha: Timestamp.fromDate(weekDate),
        });
      }
      const last = list.pop();
      if (last) {
        list.splice(1, 0, last);
      }
    }

    return matches;
  };

  const handleGenerateCalendar = async () => {
    if (
      !window.confirm(
        'Esto borrará los duelos existentes y generará un nuevo calendario de batallas. ¿Deseas continuar?',
      )
    ) {
      return;
    }
    try {
      const playersByGroup: Record<string, Player[]> = {};
      players.forEach((player) => {
        if (!playersByGroup[player.grupo]) {
          playersByGroup[player.grupo] = [];
        }
        playersByGroup[player.grupo].push(player);
      });

      let newMatches: Omit<Match, 'id'>[] = [];
      Object.entries(playersByGroup).forEach(([groupName, groupPlayers]) => {
        if (groupPlayers.length === 8) {
          newMatches = newMatches.concat(
            generateRoundRobin(groupPlayers, groupName),
          );
        }
      });

      await matchesService.replaceCalendar(newMatches);
      alert('Calendario de batallas generado correctamente');
    } catch (error) {
      console.error('Error generando calendario de batallas:', error);
      alert('Error generando calendario de batallas');
    }
  };

  const handleDeleteCalendar = async () => {
    if (
      !window.confirm(
        '¡ATENCIÓN! Esta acción es irreversible y borrará TODOS los duelos del calendario. ¿Estás seguro?',
      )
    ) {
      return;
    }
    try {
      await matchesService.clearCalendar();
      alert('El calendario de batallas ha sido borrado.');
    } catch (error) {
      console.error('Error borrando el calendario:', error);
      alert('Ha ocurrido un error al borrar el calendario.');
    }
  };

  const handleOpenResultModal = (match: Match) => {
    setSelectedMatch(match);
    if (match.completado && match.resultado) {
      setResultForm({
        setsJugador1: match.resultado.setsJugador1,
        setsJugador2: match.resultado.setsJugador2,
      });
    } else {
      setResultForm({ setsJugador1: 0, setsJugador2: 0 });
    }
    setShowResultForm(true);
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMatch) return;

    const { setsJugador1, setsJugador2 } = resultForm;

    if (setsJugador1 === setsJugador2) {
      alert('Los resultados no pueden ser un empate.');
      return;
    }

    try {
      const batch = writeBatch(db);
      const isEditing = selectedMatch.completado;

      const jugador1Ref = doc(db, 'players', selectedMatch.jugador1Id);
      const jugador2Ref = doc(db, 'players', selectedMatch.jugador2Id);
      const [jugador1Snap, jugador2Snap] = await Promise.all([
        getDoc(jugador1Ref),
        getDoc(jugador2Ref),
      ]);

      if (!jugador1Snap.exists() || !jugador2Snap.exists()) {
        throw new Error('No se encontraron los combatientes en la base de datos.');
      }

      const jugador1 = {
        id: jugador1Snap.id,
        ...jugador1Snap.data(),
      } as Player;
      const jugador2 = {
        id: jugador2Snap.id,
        ...jugador2Snap.data(),
      } as Player;

      if (isEditing && selectedMatch.resultado) {
        const oldResult = selectedMatch.resultado;
        const oldGanadorId = oldResult.ganadorId;

        const oldSetsGanador =
          oldGanadorId === jugador1.id
            ? oldResult.setsJugador1
            : oldResult.setsJugador2;
        const oldSetsPerdedor =
          oldGanadorId === jugador1.id
            ? oldResult.setsJugador2
            : oldResult.setsJugador1;

        if (oldGanadorId === jugador1.id) {
          jugador1.partidasGanadas -= 1;
          jugador1.puntos -= 3;
          jugador1.juegosGanados -= oldSetsGanador;
          jugador1.juegosPerdidos -= oldSetsPerdedor;

          jugador2.partidasPerdidas -= 1;
          jugador2.juegosGanados -= oldSetsPerdedor;
          jugador2.juegosPerdidos -= oldSetsGanador;
        } else {
          jugador2.partidasGanadas -= 1;
          jugador2.puntos -= 3;
          jugador2.juegosGanados -= oldSetsGanador;
          jugador2.juegosPerdidos -= oldSetsPerdedor;

          jugador1.partidasPerdidas -= 1;
          jugador1.juegosGanados -= oldSetsPerdedor;
          jugador1.juegosPerdidos -= oldSetsGanador;
        }
      }

      const newGanadorId =
        setsJugador1 > setsJugador2 ? jugador1.id! : jugador2.id!;

      const newSetsGanador =
        setsJugador1 > setsJugador2 ? setsJugador1 : setsJugador2;
      const newSetsPerdedor =
        setsJugador1 > setsJugador2 ? setsJugador2 : setsJugador1;

      if (newGanadorId === jugador1.id) {
        jugador1.partidasGanadas += 1;
        jugador1.puntos += 3;
        jugador1.juegosGanados += newSetsGanador;
        jugador1.juegosPerdidos += newSetsPerdedor;
        if (!isEditing) jugador1.partidasJugadas += 1;

        jugador2.partidasPerdidas += 1;
        jugador2.juegosGanados += newSetsPerdedor;
        jugador2.juegosPerdidos += newSetsGanador;
        if (!isEditing) jugador2.partidasJugadas += 1;
      } else {
        jugador2.partidasGanadas += 1;
        jugador2.puntos += 3;
        jugador2.juegosGanados += newSetsGanador;
        jugador2.juegosPerdidos += newSetsPerdedor;
        if (!isEditing) jugador2.partidasJugadas += 1;

        jugador1.partidasPerdidas += 1;
        jugador1.juegosGanados += newSetsPerdedor;
        jugador1.juegosPerdidos += newSetsGanador;
        if (!isEditing) jugador1.partidasJugadas += 1;
      }

      const { id: id1, ...player1Data } = jugador1;
      batch.update(jugador1Ref, player1Data);

      const { id: id2, ...player2Data } = jugador2;
      batch.update(jugador2Ref, player2Data);

      const matchRef = doc(db, 'matches', selectedMatch.id!);
      batch.update(matchRef, {
        completado: true,
        resultado: {
          ganadorId: newGanadorId,
          setsJugador1,
          setsJugador2,
        },
      });

      await batch.commit();

      alert('Resultado de la batalla guardado.');
      resetForms();
      loadData();
    } catch (error) {
      console.error('Error guardando el resultado:', error);
      alert('Hubo un error al guardar el resultado.');
    }
  };

  const resetForms = () => {
    setPlayerForm({ nombre: '', grupo: '', esNovato: false });
    setGroupForm({ nombre: '' });
    setResultForm({ setsJugador1: 0, setsJugador2: 0 });
    setEditingPlayer(null);
    setEditingGroup(null);
    setSelectedMatch(null);
    setShowPlayerForm(false);
    setShowGroupForm(false);
    setShowResultForm(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-400 animate-glow-orange">
            Salón del Trono
          </h1>
          <p className="text-xl text-gray-300">
            Gestiona combatientes, clanes y designios de la liga
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="bg-black/50 rounded-lg p-2 border border-purple-500/30">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'players'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Combatientes
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'groups'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Shield className="inline-block w-5 h-5 mr-2" />
              Clanes
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'results'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Scroll className="inline-block w-5 h-5 mr-2" />
              Resultados
            </button>
            <button
              onClick={() => setActiveTab('playoffs')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'playoffs'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Trophy className="inline-block w-5 h-5 mr-2" />
              Playoffs
            </button>
          </div>
        </div>

        {activeTab === 'playoffs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-400">
                Configuración de Playoffs
              </h2>
              <button
                onClick={handleSavePlayoffs}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Guardar Clasificados</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {playoffPlayers.map((playerId, index) => (
                <div key={index} className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Posición {index + 1}
                  </label>
                  <select
                    value={playerId || ''}
                    onChange={(e) =>
                      handlePlayoffPlayerChange(index, e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  >
                    <option value="">Seleccionar jugador</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-400">
                Gestión de Batallas
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches
                .sort((a, b) => {
                  if (a.semana !== b.semana) {
                    return a.semana - b.semana;
                  }
                  return a.grupo.localeCompare(b.grupo);
                })
                .map((match) => (
                  <motion.div
                    key={match.id}
                    className={`card bg-gradient-to-br from-gray-900/20 to-purple-900/20 border-gray-500/30 ${
                      match.completado ? 'opacity-60' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300">
                          {match.jugador1Nombre} vs {match.jugador2Nombre}
                        </h3>
                        <p className="text-sm text-purple-400">
                          Clan: {match.grupo} - Semana: {match.semana}
                        </p>
                        {match.completado && match.resultado && (
                          <p className="text-sm text-green-400 font-bold mt-1">
                            Resultado: {match.resultado.setsJugador1} -{' '}
                            {match.resultado.setsJugador2}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleOpenResultModal(match)}
                        className="btn btn-primary flex items-center space-x-2"
                      >
                        {match.completado ? (
                          <Edit2 className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        <span>{match.completado ? 'Editar' : 'Resultado'}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'players' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-400">
                Gestión de Combatientes
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPlayerForm(true)}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Reclutar Combatiente</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  className="card bg-gradient-to-br from-orange-900/20 to-purple-900/20 border-orange-500/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-400">
                        {player.nombre}
                      </h3>
                      <p className="text-sm text-purple-400">
                        Clan: {player.grupo}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPlayer(player)}
                        className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-600/20 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id!)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>
                      Batallas: {player.partidasJugadas} | Puntos:{' '}
                      {player.puntos}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-orange-400">
                Gestión de Clanes y Exportar
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowGroupForm(true)}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Fundar Clan</span>
                </button>
                <button
                  onClick={handleGenerateCalendar}
                  disabled={players.length !== 32 || groups.length !== 4}
                  className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50"
                >
                  Generar Batallas
                </button>
                <button
                  onClick={handleDeleteCalendar}
                  className="btn btn-danger flex items-center space-x-2"
                >
                  Borrar Batallas
                </button>
              </div>
            </div>
            {(players.length !== 32 || groups.length !== 4) && (
              <p className="text-sm text-gray-400 mb-4">
                Se requieren 32 combatientes y 4 clanes para generar las
                batallas.
              </p>
            )}

            <div className="mb-6 p-4 rounded-lg bg-black/30 border border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-300 mb-3">
                Exportar Clasificación
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    exportToCsv(
                      players,
                      groups.map((g) => g.nombre).sort(),
                    )
                  }
                  className="btn btn-success flex items-center space-x-2"
                  disabled={players.length === 0}
                >
                  <Download className="w-5 h-5" />
                  <span>Exportar a CSV</span>
                </button>
                <button
                  onClick={() =>
                    exportToJson(
                      players,
                      groups.map((g) => g.nombre).sort(),
                    )
                  }
                  className="btn btn-info flex items-center space-x-2"
                  disabled={players.length === 0}
                >
                  <Download className="w-5 h-5" />
                  <span>Exportar a JSON</span>
                </button>
              </div>
              {players.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No hay combatientes para exportar.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  className="card bg-gradient-to-br from-green-900/20 to-purple-900/20 border-green-500/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">
                        {group.nombre}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-600/20 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id!)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>
                      Miembros:{' '}
                      {
                        players.filter((p) => p.grupo === group.nombre)
                          .length
                      }
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {showPlayerForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            className="card bg-black/90 border-purple-500/50 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-purple-400">
                {editingPlayer ? 'Editar Combatiente' : 'Reclutar Combatiente'}
              </h3>
              <button
                onClick={resetForms}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePlayerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={playerForm.nombre}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={playerForm.esNovato}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, esNovato: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 bg-gray-900/50 border-gray-600 rounded focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-300">
                  ¿Es un iniciado?
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Clan
                </label>
                <select
                  value={playerForm.grupo}
                  onChange={(e) =>
                    setPlayerForm({ ...playerForm, grupo: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                >
                  <option value="">Seleccionar clan</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.nombre}>
                      {group.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn btn-success flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingPlayer ? 'Actualizar' : 'Guardar'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showGroupForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            className="card bg-black/90 border-purple-500/50 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-purple-400">
                {editingGroup ? 'Editar Clan' : 'Fundar Clan'}
              </h3>
              <button
                onClick={resetForms}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Clan
                </label>
                <input
                  type="text"
                  value={groupForm.nombre}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn btn-success flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingGroup ? 'Actualizar' : 'Guardar'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showResultForm && selectedMatch && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            className="card bg-black/90 border-purple-500/50 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-purple-400">
                Añadir Resultado de Batalla
              </h3>
              <button
                onClick={resetForms}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleResultSubmit} className="space-y-4">
              <p className="text-center font-semibold text-lg text-white">
                <Swords className="inline-block w-5 h-5 mr-2" />
                {selectedMatch.jugador1Nombre} vs {selectedMatch.jugador2Nombre}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Puntos para {selectedMatch.jugador1Nombre}
                </label>
                <input
                  type="number"
                  value={resultForm.setsJugador1}
                  onChange={(e) =>
                    setResultForm({
                      ...resultForm,
                      setsJugador1: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Puntos para {selectedMatch.jugador2Nombre}
                </label>
                <input
                  type="number"
                  value={resultForm.setsJugador2}
                  onChange={(e) =>
                    setResultForm({
                      ...resultForm,
                      setsJugador2: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                  min="0"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn btn-success flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Guardar Resultado</span>
                </button>
                <button
                  type="button"
                  onClick={resetForms}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
