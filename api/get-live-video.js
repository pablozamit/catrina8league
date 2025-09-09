// api/get-live-video.js
import { google } from 'googleapis';

// Las credenciales se leerán desde las variables de entorno de Vercel
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, CHANNEL_ID } = process.env;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export default async function handler(req, res) {
  // Configuración de CORS para permitir que tu web hable con esta API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Hacemos la llamada a la API de YouTube como el dueño del canal
    const response = await youtube.search.list({
      part: 'snippet',
      channelId: CHANNEL_ID,
      eventType: 'live',
      type: 'video',
    });

    if (response.data.items && response.data.items.length > 0) {
      // Si hay un directo, devolvemos el ID del vídeo
      const liveVideoId = response.data.items[0].id.videoId;
      return res.status(200).json({ liveVideoId });
    } else {
      // Si no hay directo, devolvemos un objeto vacío
      return res.status(200).json({ liveVideoId: null });
    }
  } catch (error) {
    console.error('Error al contactar con la API de YouTube:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
