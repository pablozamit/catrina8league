import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Tipos de datos
export interface Player {
  id?: string;
  nombre: string;
  apellidos: string;
  contacto: string;
  grupo: string;
  partidosJugados: number;
  partidosGanados: number;
  partidosPerdidos: number;
  setsGanados: number;
  setsPerdidos: number;
  puntos: number;
}

export interface Group {
  id?: string;
  nombre: string;
  descripcion?: string;
}

export interface Match {
  id?: string;
  jugador1Id: string;
  jugador2Id: string;
  jugador1Nombre: string;
  jugador2Nombre: string;
  grupo: string;
  fecha: Timestamp;
  semana: number;
  resultado?: {
    ganadorId: string;
    setsJugador1: number;
    setsJugador2: number;
  };
  completado: boolean;
}

// Servicios para jugadores
export const playersService = {
  // Obtener todos los jugadores
  getAll: async (): Promise<Player[]> => {
    const querySnapshot = await getDocs(collection(db, 'players'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
  },

  // Agregar jugador
  add: async (player: Omit<Player, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'players'), player);
    return docRef.id;
  },

  // Actualizar jugador
  update: async (id: string, player: Partial<Player>): Promise<void> => {
    const playerRef = doc(db, 'players', id);
    await updateDoc(playerRef, player);
  },

  // Eliminar jugador
  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'players', id));
  },

  // Escuchar cambios en tiempo real
  listen: (callback: (players: Player[]) => void) => {
    const q = query(collection(db, 'players'), orderBy('puntos', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const players = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
      callback(players);
    });
  }
};

// Servicios para grupos
export const groupsService = {
  // Obtener todos los grupos
  getAll: async (): Promise<Group[]> => {
    const querySnapshot = await getDocs(collection(db, 'groups'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
  },

  // Agregar grupo
  add: async (group: Omit<Group, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'groups'), group);
    return docRef.id;
  },

  // Actualizar grupo
  update: async (id: string, group: Partial<Group>): Promise<void> => {
    const groupRef = doc(db, 'groups', id);
    await updateDoc(groupRef, group);
  },

  // Eliminar grupo
  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'groups', id));
  }
};

// Servicios para partidos
export const matchesService = {
  // Obtener todos los partidos
  getAll: async (): Promise<Match[]> => {
    const querySnapshot = await getDocs(collection(db, 'matches'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
  },

  // Agregar partido
  add: async (match: Omit<Match, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'matches'), match);
    return docRef.id;
  },

  // Actualizar partido
  update: async (id: string, match: Partial<Match>): Promise<void> => {
    const matchRef = doc(db, 'matches', id);
    await updateDoc(matchRef, match);
  },

  // Eliminar partido
  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'matches', id));
  },

  // Escuchar cambios en tiempo real
  listen: (callback: (matches: Match[]) => void) => {
    const q = query(collection(db, 'matches'), orderBy('fecha', 'asc'));
    return onSnapshot(q, (querySnapshot) => {
      const matches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      callback(matches);
    });
  }
};