import { Player } from '../firebase/firestore';

// Función hash simple y determinista para convertir ID de jugador a número
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a entero de 32bit
  }
  return Math.abs(hash);
}

// Función para asignar seeds aleatorios pero fijos a los jugadores calificados
export function assignSeeds(qualifiedPlayers: Player[]): (Player | null)[] {
  const totalSeeds = 16;
  const seededPlayers: (Player | null)[] = Array(totalSeeds).fill(null);
  const availableSeeds = Array.from({ length: totalSeeds }, (_, i) => i); // Índices 0 a 15

  // Ordenar jugadores por ID para asegurar consistencia si la lista de entrada cambia de orden
  const sortedPlayers = [...qualifiedPlayers].sort((a, b) =>
    (a.id ?? '').localeCompare(b.id ?? ''),
  );

  // Asignar cada jugador a un seed disponible de forma determinista
  sortedPlayers.forEach((player) => {
    if (availableSeeds.length === 0) {
      console.warn('Más jugadores calificados que seeds disponibles.');
      return;
    }

    // Usar el hash del ID para elegir un índice de seed disponible
    const hashValue = simpleHash(player.id ?? '');
    const seedIndexToRemove = hashValue % availableSeeds.length;
    const assignedSeedIndex = availableSeeds.splice(seedIndexToRemove, 1)[0]; // Obtiene y quita el seed

    if (assignedSeedIndex !== undefined) {
      seededPlayers[assignedSeedIndex] = player;
    }
  });

  return seededPlayers; // Devuelve el array de 16 (índices 0-15), con jugadores o null
}
