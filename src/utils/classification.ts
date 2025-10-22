import { Player, Match } from '../firebase/firestore';
import { TFunction } from 'i18next'; // Importar TFunction

export type QualificationStatus = 'qualified' | 'eliminated' | 'pending' | 'none';

const TOTAL_MATCHES = 7;
const POINTS_PER_WIN = 3;
const TOP_N_QUALIFY = 4; // Número de jugadores que clasifican

// --- Función existente (sin cambios) ---
export const calculateQualificationStatus = (
  player: Player,
  groupPlayers: Player[], // Renombrado para claridad
): QualificationStatus => {
  const remainingMatches = TOTAL_MATCHES - player.partidasJugadas;

  // Best case scenario for the player
  const bestCasePoints = player.puntos + remainingMatches * POINTS_PER_WIN;
  const bestCaseWins = player.partidasGanadas + remainingMatches;
  // Considerar desempate por juegos ganados en el mejor caso es complejo,
  // nos centramos en puntos y victorias para simplificar la lógica matemática.
  // Podríamos añadir una estimación alta de juegos ganados si fuera necesario.

  // Worst case scenario for the player (puntos actuales)
  const worstCasePoints = player.puntos;
  const worstCaseWins = player.partidasGanadas;
  // También necesitamos juegos ganados/perdidos actuales para desempates en el peor caso
  const worstCaseGamesWon = player.juegosGanados;
  const worstCaseGamesDiff = player.juegosGanados - player.juegosPerdidos;


  const otherPlayers = groupPlayers.filter((p) => p.id !== player.id);

  // --- Lógica de Clasificación Matemática ('qualified') ---
  // El jugador está clasificado si, en su peor escenario (worstCase),
  // menos de TOP_N_QUALIFY jugadores pueden superarle incluso en el mejor escenario (bestCase) de ellos.
  let playersWhoCanPotentiallySurpassWorstCase = 0;
  for (const other of otherPlayers) {
    const otherRemainingMatches = TOTAL_MATCHES - other.partidasJugadas;
    const otherBestPoints = other.puntos + otherRemainingMatches * POINTS_PER_WIN;
    const otherBestWins = other.partidasGanadas + otherRemainingMatches;
     // Estimación simple para desempate en el mejor caso del rival
    const otherBestGamesWon = other.juegosGanados + otherRemainingMatches * 2;
    const otherBestGamesDiff = otherBestGamesWon - other.juegosPerdidos;


    if (otherBestPoints > worstCasePoints) {
      playersWhoCanPotentiallySurpassWorstCase++;
    } else if (otherBestPoints === worstCasePoints) {
      if (otherBestWins > worstCaseWins) {
        playersWhoCanPotentiallySurpassWorstCase++;
      } else if (otherBestWins === worstCaseWins && otherBestGamesDiff > worstCaseGamesDiff) {
         // Considerando diferencia de juegos como tercer criterio si puntos y victorias son iguales
        playersWhoCanPotentiallySurpassWorstCase++;
      }
    }
  }
  // Si menos de 4 rivales pueden superarle en su mejor caso vs el peor caso del jugador, está dentro.
  if (playersWhoCanPotentiallySurpassWorstCase < TOP_N_QUALIFY) {
    return 'qualified';
  }

  // --- Lógica de Eliminación Matemática ('eliminated') ---
  // El jugador está eliminado si, incluso en su mejor escenario (bestCase),
  // al menos TOP_N_QUALIFY jugadores están garantizados a quedar por encima (en el peor escenario de ellos).
  let playersGuaranteedAboveBestCase = 0;
  for (const other of otherPlayers) {
    // Peor caso del rival (puntos actuales)
    const otherWorstPoints = other.puntos;
    const otherWorstWins = other.partidasGanadas;
    const otherWorstGamesWon = other.juegosGanados;
    const otherWorstGamesDiff = other.juegosGanados - other.juegosPerdidos;


    if (otherWorstPoints > bestCasePoints) {
      playersGuaranteedAboveBestCase++;
    } else if (otherWorstPoints === bestCasePoints) {
      if (otherWorstWins > bestCaseWins) {
        playersGuaranteedAboveBestCase++;
      } else if (otherWorstWins === bestCaseWins && otherWorstGamesDiff > bestCaseGamesWon - player.juegosPerdidos) {
         // Comparamos diferencia de juegos si puntos y victorias coinciden
        playersGuaranteedAboveBestCase++;
      }
    }
  }
   // Si 4 o más rivales ya están inalcanzables incluso en el mejor caso del jugador, está fuera.
  if (playersGuaranteedAboveBestCase >= TOP_N_QUALIFY) {
    return 'eliminated';
  }

  // Si no está ni clasificado ni eliminado matemáticamente, está pendiente
  // (La lógica original para 'pending' vs 'none' era un poco redundante aquí, simplificamos)
  return 'pending';
};

// --- NUEVA FUNCIÓN ---
// Devuelve un string explicando el escenario de clasificación (versión simplificada)
export const getQualificationScenario = (
  player: Player,
  groupPlayers: Player[],
  allMatches: Match[], // Necesitamos los partidos para saber cuántos quedan
  t: TFunction, // Función de traducción
): string => {
  const status = calculateQualificationStatus(player, groupPlayers);

  // Si no está pendiente, no necesita explicación detallada
  if (status !== 'pending') {
    // Podríamos devolver un string vacío o un mensaje genérico si quisiéramos
    return ''; // Opcional: podrías retornar algo como t('qualification.status_' + status)
  }

  const remainingMatchesCount = TOTAL_MATCHES - player.partidasJugadas;

  // Caso: No le quedan partidos
  if (remainingMatchesCount <= 0) {
    return t('qualification.noRemainingMatches');
  }

  // --- Lógica Simplificada para Escenarios Pendientes ---
  // Calcula el mínimo de puntos necesarios APROXIMADO para estar entre los 4 primeros
  // Ordena a los otros por su PEOR caso (puntos actuales)
  const othersSortedByWorstCase = groupPlayers
    .filter((p) => p.id !== player.id)
    .sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.partidasGanadas !== a.partidasGanadas) return b.partidasGanadas - a.partidasGanadas;
        return (b.juegosGanados - b.juegosPerdidos) - (a.juegosGanados - a.juegosPerdidos);
    });

  // Punto de corte: los puntos del 4º jugador actual (o el último si hay menos de 4)
  const fourthPlacePoints = othersSortedByWorstCase[TOP_N_QUALIFY - 2]?.puntos ?? 0; // -2 porque el array 'others' no incluye al 'player'

  // Mejor caso del jugador
  const bestCasePoints = player.puntos + remainingMatchesCount * POINTS_PER_WIN;

  // Escenario 1: Si ni ganando todo alcanza al 4º actual -> Depende totalmente de otros
  if (bestCasePoints < fourthPlacePoints) {
     return t('qualification.winAllAndDepend');
  }

  // Escenario 2: Calcular cuántas victorias necesita *como mínimo* para superar al 4º actual
  // Esto es una simplificación, no tiene en cuenta desempates ni que el 4º puede sumar más puntos.
  let winsNeeded = 0;
  for (let wins = 1; wins <= remainingMatchesCount; wins++) {
    const potentialPoints = player.puntos + wins * POINTS_PER_WIN;
    if (potentialPoints >= fourthPlacePoints) { // Usamos >= para incluir el caso de empate (que luego iría a desempate)
      winsNeeded = wins;
      break;
    }
  }

   if (winsNeeded > 0 && winsNeeded <= remainingMatchesCount) {
       return t('qualification.winAtLeast', { winsNeeded, remainingMatches: remainingMatchesCount });
   }


  // Si los cálculos anteriores no aplican (ej: ya está por encima del 4º pero no asegurado)
  // o si la lógica se complica mucho con desempates.
  return t('qualification.complexScenario');
};
