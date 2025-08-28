import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, Settings, Save, X } from 'lucide-react';
import { playersService, groupsService, Player, Group } from '../firebase/firestore';
import LoadingSpinner from '../components/LoadingSpinner';

const Admin: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'players' | 'groups'>('players');
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Estados para formularios
  const [playerForm, setPlayerForm] = useState({
    nombre: '',
    apellidos: '',
    contacto: '',
    grupo: ''
  });

  const [groupForm, setGroupForm] = useState({
    nombre: '',
    descripcion: ''
  });

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
        partidosJugados: 0,
        partidosGanados: 0,
        partidosPerdidos: 0,
        setsGanados: 0,
        setsPerdidos: 0,
        puntos: 0
      };

      if (editingPlayer) {
        await playersService.update(editingPlayer.id!, playerData);
      } else {
        await playersService.add(playerData);
      }

      setPlayerForm({ nombre: '', apellidos: '', contacto: '', grupo: '' });
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
      if (editingGroup) {
        await groupsService.update(editingGroup.id!, groupForm);
      } else {
        await groupsService.add(groupForm);
      }

      setGroupForm({ nombre: '', descripcion: '' });
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
      apellidos: player.apellidos,
      contacto: player.contacto,
      grupo: player.grupo
    });
    setEditingPlayer(player);
    setShowPlayerForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setGroupForm({
      nombre: group.nombre,
      descripcion: group.descripcion || ''
    });
    setEditingGroup(group);
    setShowGroupForm(true);
  };

  const handleDeletePlayer = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este jugador?')) {
      try {
        await playersService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error eliminando jugador:', error);
      }
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este grupo?')) {
      try {
        await groupsService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error eliminando grupo:', error);
      }
    }
  };

  const resetForms = () => {
    setPlayerForm({ nombre: '', apellidos: '', contacto: '', grupo: '' });
    setGroupForm({ nombre: '', descripcion: '' });
    setEditingPlayer(null);
    setEditingGroup(null);
    setShowPlayerForm(false);
    setShowGroupForm(false);
  };

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-400">
            Panel de Administración
          </h1>
          <p className="text-xl text-gray-300">
            Gestiona jugadores, grupos y configuraciones de la liga
          </p>
        </motion.div>

        {/* Tabs */}
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
              Jugadores
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'groups'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <Settings className="inline-block w-5 h-5 mr-2" />
              Grupos
            </button>
          </div>
        </div>

        {/* Contenido de Jugadores */}
        {activeTab === 'players' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Botón agregar jugador */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gold-400">Gestión de Jugadores</h2>
              <button
                onClick={() => setShowPlayerForm(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Jugador</span>
              </button>
            </div>

            {/* Lista de jugadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  className="card bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400">
                        {player.nombre} {player.apellidos}
                      </h3>
                      <p className="text-sm text-gray-400">{player.contacto}</p>
                      <p className="text-sm text-purple-400">Grupo: {player.grupo}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPlayer(player)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-all"
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
                    <p>Partidos: {player.partidosJugados} | Puntos: {player.puntos}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contenido de Grupos */}
        {activeTab === 'groups' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Botón agregar grupo */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gold-400">Gestión de Grupos</h2>
              <button
                onClick={() => setShowGroupForm(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Agregar Grupo</span>
              </button>
            </div>

            {/* Lista de grupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  className="card bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400">
                        {group.nombre}
                      </h3>
                      <p className="text-sm text-gray-400">{group.descripcion}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-all"
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
                    <p>Jugadores: {players.filter(p => p.grupo === group.nombre).length}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal Formulario Jugador */}
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
                {editingPlayer ? 'Editar Jugador' : 'Agregar Jugador'}
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
                  onChange={(e) => setPlayerForm({ ...playerForm, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={playerForm.apellidos}
                  onChange={(e) => setPlayerForm({ ...playerForm, apellidos: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contacto
                </label>
                <input
                  type="text"
                  value={playerForm.contacto}
                  onChange={(e) => setPlayerForm({ ...playerForm, contacto: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grupo
                </label>
                <select
                  value={playerForm.grupo}
                  onChange={(e) => setPlayerForm({ ...playerForm, grupo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                >
                  <option value="">Seleccionar grupo</option>
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

      {/* Modal Formulario Grupo */}
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
                {editingGroup ? 'Editar Grupo' : 'Agregar Grupo'}
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
                  Nombre del Grupo
                </label>
                <input
                  type="text"
                  value={groupForm.nombre}
                  onChange={(e) => setGroupForm({ ...groupForm, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={groupForm.descripcion}
                  onChange={(e) => setGroupForm({ ...groupForm, descripcion: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-purple-500 text-white"
                  rows={3}
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
    </div>
  );
};

export default Admin;