import { Player, Match } from '../firebase/firestore';
import { TFunction } from 'i18next';

// Helper to get all combinations of k elements from an array
function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];

  const [first, ...rest] = arr;
  const combsWithFirst = combinations(rest, k - 1).map(comb => [first, ...comb]);
  const combsWithoutFirst = combinations(rest, k);

  return [...combsWithFirst, ...combsWithoutFirst];
}

export type QualificationStatus = 'qualified' | 'eliminated' | 'pending'; // Eliminamos 'none' por redundancia

const TOTAL_MATCHES = 7;
const POINTS_PER_WIN = 3;
const TOP_N_QUALIFY = 4;

// Estructura para almacenar escenarios
interface PlayerScenario extends Player {
    // Hereda todos los campos de Player
}

// Helper para comparar jugadores (mismo que antes)
const comparePlayers = (a: PlayerScenario, b: PlayerScenario): number => {
  if (a.puntos !== b.puntos) return a.puntos - b.puntos; // Puntos (descendente en sort, ascendente aquí)
  if (a.partidasGanadas !== b.partidasGanadas) return a.partidasGanadas - b.partidasGanadas; // Victorias (desc)
  const diffA = a.juegosGanados - a.juegosPerdidos;
  const diffB = b.juegosGanados - b.juegosPerdidos;
  if (diffA !== diffB) return diffA - diffB; // Diferencia Juegos (desc)
  // Aquí podrían ir más criterios si fueran necesarios
  return 0; // Empate
};

// --- FUNCIÓN REESCRITA ---
export const calculateQualificationStatus = (
  player: Player,
  groupPlayers: Player[],
  allMatches: Match[],
): QualificationStatus => {
  const playerId = player.id;
  if (!playerId) return 'pending'; // Seguridad por si acaso

  const otherPlayers = groupPlayers.filter((p) => p.id !== playerId);
  const remainingMatchesPlayer = TOTAL_MATCHES - player.partidasJugadas;

  // --- ESCENARIOS BASE ---
  // Peor escenario del jugador (WCP): Estado actual
  const wcp: PlayerScenario = { ...player };

  // Mejor escenario del jugador (BCP): Ganando todo 2-0 (simplificación para desempate)
  const bcp: PlayerScenario = {
    ...player,
    puntos: player.puntos + remainingMatchesPlayer * POINTS_PER_WIN,
    partidasGanadas: player.partidasGanadas + remainingMatchesPlayer,
    juegosGanados: player.juegosGanados + remainingMatchesPlayer * 2,
    // juegosPerdidos no cambia en el BCP
    partidasJugadas: TOTAL_MATCHES,
  };

  // --- LÓGICA DE CLASIFICACIÓN ('qualified') ---
  // Un jugador está clasificado si no existe ningún grupo de 4 rivales que puedan superarle simultáneamente.
  const rivals = otherPlayers;

  // Si hay menos de 4 rivales, no pueden sacarlo del top 4.
  if (rivals.length < TOP_N_QUALIFY) {
    return 'qualified';
  }
  
  const rivalCombinations = combinations(rivals, TOP_N_QUALIFY);
  let isPotentiallyEliminated = false;

  for (const combo of rivalCombinations) {
    const comboPlayerIds = combo.map(p => p.id);

    const internalMatches = allMatches.filter(m =>
      m.status === 'pendiente' &&
      m.grupo === player.grupo &&
      comboPlayerIds.includes(m.player1Id) &&
      comboPlayerIds.includes(m.player2Id)
    );
    const internalPointsToDistribute = internalMatches.length * POINTS_PER_WIN;

    const potentialScores = combo.map(rival => {
      const remainingMatchesOutsideCombo = allMatches.filter(m =>
        m.status === 'pendiente' &&
        m.grupo === player.grupo &&
        ((m.player1Id === rival.id && !comboPlayerIds.includes(m.player2Id)) ||
         (m.player2Id === rival.id && !comboPlayerIds.includes(m.player1Id)))
      ).length;
      
      return {
        ...rival,
        potentialPoints: rival.puntos + (remainingMatchesOutsideCombo * POINTS_PER_WIN),
      };
    });

    let totalInternalPointsNeeded = 0;
    for (const rival of potentialScores) {
      // Para superar al jugador (wcp), el rival necesita tener más puntos.
      // Si tienen los mismos puntos, asumimos que no lo supera para estar del lado de la seguridad.
      // El desempate es complejo, y para garantizar la clasificación, es mejor ser estricto.
      if (rival.potentialPoints > wcp.puntos) {
        continue; // Ya lo supera
      }
      
      // Calculamos los puntos que necesita para superarlo estrictamente.
      const pointsNeeded = wcp.puntos - rival.potentialPoints + 1;
      const winsNeeded = Math.ceil(pointsNeeded / POINTS_PER_WIN);
      totalInternalPointsNeeded += winsNeeded * POINTS_PER_WIN;
    }

    if (totalInternalPointsNeeded <= internalPointsToDistribute) {
      // Se encontró un combo que PUEDE superar al jugador.
      isPotentiallyEliminated = true;
      break;
    }
  }

  if (!isPotentiallyEliminated) {
    return 'qualified';
  }
  // --- LÓGICA DE ELIMINACIÓN ('eliminated') ---
  // Contamos cuántos rivales *garantizado* superarán el MEJOR caso del jugador (bcp)
  let countGuaranteedBetterThanBCP = 0;
  for (const other of otherPlayers) {
    // Peor caso del rival (WCO): Estado actual
    const wco: PlayerScenario = { ...other };

    // Si el peor caso del rival (wco) es mejor que el mejor caso del jugador (bcp)
    if (comparePlayers(wco, bcp) > 0) { // compare(a,b) > 0 significa a > b
      countGuaranteedBetterThanBCP++;
    }
  }

  // Si 4 o más rivales *ya* están por encima de su mejor escenario posible, está eliminado.
  if (countGuaranteedBetterThanBCP >= TOP_N_QUALIFY) {
    return 'eliminated';
  }

  // Si no se cumple ninguna de las anteriores, está pendiente.
  return 'pending';
};


// --- Función getQualificationScenario (Sin cambios respecto a la versión anterior funcional) ---
export const getQualificationScenario = (
  player: Player,
  groupPlayers: Player[],
  allMatches: Match[], // No usado activamente, pero disponible
  t: TFunction,
): string => {
   const status = calculateQualificationStatus(player, groupPlayers, allMatches); // Re-calcula por si acaso

  if (status !== 'pending') {
    return ''; // Solo explicamos si está pendiente
  }

  const remainingMatchesCount = TOTAL_MATCHES - player.partidasJugadas;

  if (remainingMatchesCount <= 0) {
    return t('qualification.noRemainingMatches');
  }

  const othersSortedByWorstCase = groupPlayers
    .filter((p) => p.id !== player.id)
    .sort((a, b) => comparePlayers(b, a)); // Usamos el helper de comparación (b,a para descendente)

  const fourthPlacePlayer = othersSortedByWorstCase[TOP_N_QUALIFY - 2]; // Índice 2 si TOP_N_QUALIFY es 4
  const fourthPlacePoints = fourthPlacePlayer?.puntos ?? 0;

  const bestCasePoints = player.puntos + remainingMatchesCount * POINTS_PER_WIN;
   const bestCasePlayer: PlayerScenario = { // Usamos el tipo Scenario aquí también
      ...player,
      puntos: bestCasePoints,
      partidasGanadas: player.partidasGanadas + remainingMatchesCount,
      juegosGanados: player.juegosGanados + remainingMatchesCount * 2,
      partidasJugadas: TOTAL_MATCHES
  };


  if (bestCasePoints < fourthPlacePoints) {
     return t('qualification.winAllAndDepend');
  }

  // Intentar encontrar el mínimo de victorias necesarias para TENER OPCIONES
  let minWinsForChance = -1;
  for (let wins = 0; wins <= remainingMatchesCount; wins++) {
      const losses = remainingMatchesCount - wins;
      // Creamos un escenario hipotético para el jugador con 'wins' victorias
      const potentialPlayer: PlayerScenario = {
          ...player,
          puntos: player.puntos + wins * POINTS_PER_WIN,
          partidasGanadas: player.partidasGanadas + wins,
          partidasPerdidas: player.partidasPerdidas + losses,
          juegosGanados: player.juegosGanados + wins * 2 , // Estimación simplificada
          juegosPerdidos: player.juegosPerdidos + losses * 1, // Estimación simplificada
          partidasJugadas: TOTAL_MATCHES
      };

      // Comprobamos si con 'wins' victorias, *aún no estaría eliminado matemáticamente*
      let playersGuaranteedAbovePotential = 0;
       for (const other of othersSortedByWorstCase) { // Usamos los rivales ya ordenados
           const wco = { ...other }; // Peor caso rival
           if (comparePlayers(wco, potentialPlayer) > 0) { // Si rival(peor) > jugador(potencial)
               playersGuaranteedAbovePotential++;
           }
       }

       // Si menos de 4 rivales le superan garantizado, aún tiene opciones con 'wins' victorias
       if (playersGuaranteedAbovePotential < TOP_N_QUALIFY) {
           minWinsForChance = wins;
           break;
       }
  }


  if (minWinsForChance === -1) {
       // Si ni ganando todo tiene opciones (ya debería haber sido 'eliminated')
       // Esto podría indicar un error en la lógica de 'eliminated' o un caso muy raro
       console.warn("Pending player seems eliminated in scenario check:", player.nombre);
       return t('qualification.complexScenario');
  } else if (minWinsForChance === remainingMatchesCount) {
       // Si necesita ganar todas las partidas restantes para tener opción
       // Verificamos si, incluso ganando todo (BCP), sigue 'pending' (depende de otros)
        const statusIfWinsAll = calculateQualificationStatus(bestCasePlayer, groupPlayers, allMatches);
        if (statusIfWinsAll === 'pending' || statusIfWinsAll === 'eliminated') { // Si ganando todo aún no está 'qualified'
            return t('qualification.winAllAndDepend');
        } else { // Si ganando todo pasa a 'qualified'
            return t('qualification.winAtLeast', { winsNeeded: remainingMatchesCount, remainingMatches: remainingMatchesCount });
        }
  } else if (minWinsForChance > 0) {
       // Si necesita ganar al menos 'minWinsForChance'
       return t('qualification.winAtLeast', { winsNeeded: minWinsForChance, remainingMatches: remainingMatchesCount });
  } else { // minWinsForChance === 0
       // No necesita ganar más, pero aún no está clasificado (depende de desempates/resultados ajenos)
        return t('qualification.complexScenario');
  }

};
