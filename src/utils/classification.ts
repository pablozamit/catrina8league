import { Player, Match } from '../firebase/firestore';
import { TFunction } from 'i18next'; // Importar TFunction

export type QualificationStatus = 'qualified' | 'eliminated' | 'pending' | 'none';

const TOTAL_MATCHES = 7;
const POINTS_PER_WIN = 3;
const TOP_N_QUALIFY = 4; // Número de jugadores que clasifican

// --- Función existente (CORREGIDA) ---
export const calculateQualificationStatus = (
  player: Player,
  groupPlayers: Player[], // Renombrado para claridad
): QualificationStatus => {
  const remainingMatches = TOTAL_MATCHES - player.partidasJugadas;

  // Best case scenario for the player
  const bestCasePoints = player.puntos + remainingMatches * POINTS_PER_WIN;
  const bestCaseWins = player.partidasGanadas + remainingMatches;
  // Estimación simple para desempate en el mejor caso del jugador
  const bestCaseGamesWonEstimate = player.juegosGanados + remainingMatches * 2; // Asumiendo victorias 2-0
  const bestCaseGamesDiffEstimate = bestCaseGamesWonEstimate - player.juegosPerdidos;


  // Worst case scenario for the player (puntos actuales)
  const worstCasePoints = player.puntos;
  const worstCaseWins = player.partidasGanadas;
  // También necesitamos juegos ganados/perdidos actuales para desempates en el peor caso
  // const worstCaseGamesWon = player.juegosGanados; // No se usa directamente, usamos diff
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
    const otherBestGamesWonEstimate = other.juegosGanados + otherRemainingMatches * 2;
    const otherBestGamesDiffEstimate = otherBestGamesWonEstimate - other.juegosPerdidos;


    if (otherBestPoints > worstCasePoints) {
      playersWhoCanPotentiallySurpassWorstCase++;
    } else if (otherBestPoints === worstCasePoints) {
      if (otherBestWins > worstCaseWins) {
        playersWhoCanPotentiallySurpassWorstCase++;
      } else if (otherBestWins === worstCaseWins && otherBestGamesDiffEstimate > worstCaseGamesDiff) {
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
    //const otherWorstGamesWon = other.juegosGanados; // No se usa directamente, usamos diff
    const otherWorstGamesDiff = other.juegosGanados - other.juegosPerdidos;


    if (otherWorstPoints > bestCasePoints) {
      playersGuaranteedAboveBestCase++;
    } else if (otherWorstPoints === bestCasePoints) {
      if (otherWorstWins > bestCaseWins) {
        playersGuaranteedAboveBestCase++;
        // CORRECCIÓN AQUÍ: Comparar diferencia de juegos actual del rival vs diferencia estimada del jugador
      } else if (otherWorstWins === bestCaseWins && otherWorstGamesDiff > bestCaseGamesDiffEstimate) {
        playersGuaranteedAboveBestCase++;
      }
    }
  }
   // Si 4 o más rivales ya están inalcanzables incluso en el mejor caso del jugador, está fuera.
  if (playersGuaranteedAboveBestCase >= TOP_N_QUALIFY) {
    return 'eliminated';
  }

  // Si no está ni clasificado ni eliminado matemáticamente, está pendiente
  return 'pending';
};

// --- NUEVA FUNCIÓN ---
// Devuelve un string explicando el escenario de clasificación (versión simplificada)
export const getQualificationScenario = (
  player: Player,
  groupPlayers: Player[],
  allMatches: Match[], // No usado en esta versión simple, pero podría ser útil para lógica más compleja
  t: TFunction, // Función de traducción
): string => {
  const status = calculateQualificationStatus(player, groupPlayers);

  // Si no está pendiente, no necesita explicación detallada
  if (status !== 'pending') {
    return '';
  }

  const remainingMatchesCount = TOTAL_MATCHES - player.partidasJugadas;

  // Caso: No le quedan partidos
  if (remainingMatchesCount <= 0) {
    return t('qualification.noRemainingMatches');
  }

  // --- Lógica Simplificada para Escenarios Pendientes ---
  const othersSortedByWorstCase = groupPlayers
    .filter((p) => p.id !== player.id)
    .sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.partidasGanadas !== a.partidasGanadas) return b.partidasGanadas - a.partidasGanadas;
        return (b.juegosGanados - b.juegosPerdidos) - (a.juegosGanados - a.juegosPerdidos);
    });

  // Punto de corte: los puntos del 4º jugador actual (índice 3, pero como filtramos al player, es índice 2 en 'others')
  const fourthPlacePlayer = othersSortedByWorstCase[TOP_N_QUALIFY - 2];
  const fourthPlacePoints = fourthPlacePlayer?.puntos ?? 0; // Puntos del 4º actual

  // Mejor caso del jugador
  const bestCasePoints = player.puntos + remainingMatchesCount * POINTS_PER_WIN;

  // Escenario 1: Si ni ganando todo alcanza al 4º actual -> Depende totalmente de otros
  if (bestCasePoints < fourthPlacePoints) {
     return t('qualification.winAllAndDepend');
  }

  // Escenario 2: Calcular cuántas victorias necesita *como mínimo* para superar al 4º actual
  // Esto es una simplificación, no tiene en cuenta desempates ni que el 4º puede sumar más puntos.
  let winsNeeded = 0;
  for (let wins = 0; wins <= remainingMatchesCount; wins++) { // Empezamos desde 0 victorias
    const potentialPoints = player.puntos + wins * POINTS_PER_WIN;
    if (potentialPoints >= fourthPlacePoints) { // Usamos >= para cubrir el empate (que requeriría desempate)
        // Ahora, una comprobación adicional: ¿es *posible* que incluso con estas victorias, 4 rivales le superen?
        // Comprobamos si el jugador, incluso con 'wins' victorias, puede ser superado por 4 rivales en el *mejor* caso de ellos.
        let playersWhoCanStillSurpass = 0;
        const potentialPlayerPoints = player.puntos + wins * POINTS_PER_WIN;
        const potentialPlayerWins = player.partidasGanadas + wins;
        // Estimación muy simple de games diff con 'wins' victorias
        const potentialPlayerGamesDiff = player.juegosGanados - player.juegosPerdidos + wins;


        for (const other of othersSortedByWorstCase) {
             const otherRemainingMatches = TOTAL_MATCHES - other.partidasJugadas;
             const otherBestPoints = other.puntos + otherRemainingMatches * POINTS_PER_WIN;
             const otherBestWins = other.partidasGanadas + otherRemainingMatches;
             const otherBestGamesDiffEstimate = (other.juegosGanados + otherRemainingMatches * 2) - other.juegosPerdidos;

             if (otherBestPoints > potentialPlayerPoints) {
                 playersWhoCanStillSurpass++;
             } else if (otherBestPoints === potentialPlayerPoints) {
                 if (otherBestWins > potentialPlayerWins) {
                     playersWhoCanStillSurpass++;
                 } else if (otherBestWins === potentialPlayerWins && otherBestGamesDiffEstimate > potentialPlayerGamesDiff) {
                     playersWhoCanStillSurpass++;
                 }
             }
        }

        // Si con 'wins' victorias, todavía hay 4 o más que *podrían* superarle, necesita más victorias (o depender)
        if (playersWhoCanStillSurpass < TOP_N_QUALIFY) {
             winsNeeded = wins;
             break; // Encontramos el mínimo de victorias con posibilidad real
        } else if (wins === remainingMatchesCount) {
             // Si necesita todas las victorias y aún así 4 pueden superarle, depende de otros
             return t('qualification.winAllAndDepend');
        }
    }
     // Si ni ganando todas alcanza, ya se cubrió en Escenario 1
     if (wins === remainingMatchesCount && winsNeeded === 0 && bestCasePoints < fourthPlacePoints){
         return t('qualification.winAllAndDepend'); // Redundante pero seguro
     }
  }


   if (winsNeeded > 0 && winsNeeded <= remainingMatchesCount) {
       // Si necesita ganar todas y aún así depende de otros (detectado en el bucle)
       if (winsNeeded === remainingMatchesCount && calculateQualificationStatus(player,{...player, puntos: bestCasePoints, partidasGanadas: player.partidasGanadas + winsNeeded, partidasJugadas: TOTAL_MATCHES }, groupPlayers) === 'pending') {
            return t('qualification.winAllAndDepend');
       }
       return t('qualification.winAtLeast', { winsNeeded, remainingMatches: remainingMatchesCount });
   } else if (winsNeeded === 0 && player.puntos >= fourthPlacePoints) {
       // Si ya tiene puntos suficientes pero no está asegurado, depende de otros
        return t('qualification.complexScenario'); // O un mensaje tipo "Depende de desempates y resultados ajenos"
   }


  // Fallback por si algo falla
  return t('qualification.complexScenario');
};
