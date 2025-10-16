import { Player } from '../firebase/firestore';

// Función para convertir datos a CSV y descargar
export const exportToCsv = (players: Player[], groups: string[]) => {
  // Encabezados del CSV
  const headers = [
    'Nombre',
    'Grupo',
    'Puntos',
    'Partidas Jugadas',
    'Partidas Ganadas',
    'Partidas Perdidas',
    'Juegos Ganados',
    'Juegos Perdidos',
    'Diferencia de Juegos',
    'Novato'
  ];

  // Ordenar jugadores por grupo y luego por puntos/diferencia
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.grupo !== b.grupo) {
      return groups.indexOf(a.grupo) - groups.indexOf(b.grupo);
    }
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }
    const diffA = a.juegosGanados - a.juegosPerdidos;
    const diffB = b.juegosGanados - b.juegosPerdidos;
    return diffB - diffA;
  });

  // Construir las filas del CSV
  const rows = sortedPlayers.map(p => [
    p.nombre,
    p.grupo,
    p.puntos,
    p.partidasJugadas,
    p.partidasGanadas,
    p.partidasPerdidas,
    p.juegosGanados,
    p.juegosPerdidos,
    p.juegosGanados - p.juegosPerdidos,
    p.esNovato ? 'Sí' : 'No'
  ]);

  // Unir todo en un string CSV
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += headers.join(',') + "\r\n";
  rows.forEach(rowArray => {
    const row = rowArray.join(',');
    csvContent += row + "\r\n";
  });

  // Crear y descargar el archivo
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "clasificacion.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para convertir datos a JSON y descargar
export const exportToJson = (players: Player[], groups: string[]) => {
  // Estructurar los datos por grupo
  const dataByGroup: Record<string, any[]> = {};

  // Ordenar jugadores dentro de cada grupo
  groups.forEach(groupName => {
    dataByGroup[groupName] = players
      .filter(p => p.grupo === groupName)
      .sort((a, b) => {
        if (b.puntos !== a.puntos) {
          return b.puntos - a.puntos;
        }
        const diffA = a.juegosGanados - a.juegosPerdidos;
        const diffB = b.juegosGanados - b.juegosPerdidos;
        return diffB - diffA;
      })
      .map(p => ({
        nombre: p.nombre,
        grupo: p.grupo,
        puntos: p.puntos,
        partidasJugadas: p.partidasJugadas,
        partidasGanadas: p.partidasGanadas,
        partidasPerdidas: p.partidasPerdidas,
        juegosGanados: p.juegosGanados,
        juegosPerdidos: p.juegosPerdidos,
        diferenciaDeJuegos: p.juegosGanados - p.juegosPerdidos,
        esNovato: p.esNovato
      }));
  });

  // Convertir a string JSON
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(dataByGroup, null, 2)
  )}`;

  // Crear y descargar el archivo
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "clasificacion.json";
  link.click();
};