import { Player } from '../firebase/firestore';

export type QualificationStatus = 'qualified' | 'eliminated' | 'pending' | 'none';

const TOTAL_MATCHES = 7;
const POINTS_PER_WIN = 3;

export const calculateQualificationStatus = (
  player: Player,
  allPlayers: Player[],
): QualificationStatus => {
  const remainingMatches = TOTAL_MATCHES - player.partidasJugadas;

  // Best case scenario for the player
  const bestCasePoints = player.puntos + remainingMatches * POINTS_PER_WIN;
  const bestCaseWins = player.partidasGanadas + remainingMatches;
  const bestCaseGamesWon = player.juegosGanados + remainingMatches * 2; // Assuming 2-0 wins

  // Worst case scenario for the player
  const worstCasePoints = player.puntos;
  const worstCaseWins = player.partidasGanadas;
  const worstCaseGamesWon = player.juegosGanados;

  const otherPlayers = allPlayers.filter((p) => p.id !== player.id);

  // Check if player is already qualified
  let playersWhoCanSurpassBest = 0;
  for (const other of otherPlayers) {
    const otherRemainingMatches = TOTAL_MATCHES - other.partidasJugadas;
    const otherBestPoints = other.puntos + otherRemainingMatches * POINTS_PER_WIN;
    const otherBestWins = other.partidasGanadas + otherRemainingMatches;
    const otherBestGamesWon = other.juegosGanados + otherRemainingMatches * 2;

    if (otherBestPoints > bestCasePoints) {
      playersWhoCanSurpassBest++;
    } else if (otherBestPoints === bestCasePoints) {
      if (otherBestWins > bestCaseWins) {
        playersWhoCanSurpassBest++;
      } else if (otherBestWins === bestCaseWins && otherBestGamesWon > bestCaseGamesWon) {
        playersWhoCanSurpassBest++;
      }
    }
  }

  if (playersWhoCanSurpassBest < 4) {
    let canBeFourth = true;
    let playersBetterInWorstCase = 0;
    for (const other of otherPlayers) {
        const otherRemainingMatches = TOTAL_MATCHES - other.partidasJugadas;
        const otherWorstPoints = other.puntos;
        const otherWorstWins = other.partidasGanadas;
        const otherWorstGamesWon = other.juegosGanados;

        if (otherWorstPoints > worstCasePoints) {
            playersBetterInWorstCase++;
        } else if (otherWorstPoints === worstCasePoints) {
            if (otherWorstWins > worstCaseWins) {
                playersBetterInWorstCase++;
            } else if (otherWorstWins === worstCaseWins && otherWorstGamesWon > worstCaseGamesWon) {
                playersBetterInWorstCase++;
            }
        }
    }

    if (playersBetterInWorstCase >= 4) {
        canBeFourth = false;
    }

    if (canBeFourth) {
        return 'qualified';
    }
  }

  // Check if player is already eliminated
  let playersOutOfReach = 0;
  for (const other of otherPlayers) {
    const otherWorstPoints = other.puntos;
    const otherWorstWins = other.partidasGanadas;
    const otherWorstGamesWon = other.juegosGanados;

    if (otherWorstPoints > bestCasePoints) {
      playersOutOfReach++;
    } else if (otherWorstPoints === bestCasePoints) {
      if (otherWorstWins > bestCaseWins) {
        playersOutOfReach++;
      } else if (otherWorstWins === bestCaseWins && otherWorstGamesWon > bestCaseGamesWon) {
        playersOutOfReach++;
      }
    }
  }

  if (playersOutOfReach >= 4) {
    return 'eliminated';
  }

  // Check if player's fate is not in their own hands
  // This is true if even in their best case, they can be eliminated by others' results
  let playersThatCanSurpass = 0;
  for (const other of otherPlayers) {
      const otherRemaining = TOTAL_MATCHES - other.partidasJugadas;
      const otherBestPoints = other.puntos + otherRemaining * POINTS_PER_WIN;
      const otherBestWins = other.partidasGanadas + otherRemaining;
      const otherBestGamesWon = other.juegosGanados + otherRemaining * 2;

      if (otherBestPoints > bestCasePoints) {
        playersThatCanSurpass++;
      } else if (otherBestPoints === bestCasePoints) {
          if(otherBestWins > bestCaseWins) {
            playersThatCanSurpass++;
          } else if (otherBestWins === bestCaseWins && otherBestGamesWon > bestCaseGamesWon) {
            playersThatCanSurpass++;
          }
      }
  }

  if (playersThatCanSurpass >= 4) {
      return 'pending';
  }


  return 'none';
};