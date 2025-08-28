# Liga de Billar Rock & Cocktails 🎱🎸🍸

Aplicación web completa para gestionar una liga de billar con ambiente rock y cócteles sofisticados.

## ✨ Características

### 🎨 Diseño
- **Tema oscuro** con acentos neón (azul eléctrico, morado, verde lima, dorado)
- **Tipografía robusta** con fuentes Orbitron y Exo 2
- **Animaciones fluidas** con Framer Motion
- **Responsive design** optimizado para dispositivos móviles
- **Efectos visuales** de luces neón y destellos

### 🔧 Funcionalidades

#### 🏠 Página Principal
- Presentación atractiva de la liga
- Estadísticas generales
- Navegación rápida a secciones principales

#### 🔐 Sistema de Autenticación
- Login seguro para administradores
- Protección de rutas administrativas
- Firebase Authentication

#### ⚙️ Panel de Administración
- **Gestión de Jugadores**: Agregar, editar, eliminar jugadores
- **Gestión de Grupos**: Crear y administrar grupos de la liga
- **Formularios dinámicos** con validación
- **Interfaz intuitiva** con modales y confirmaciones

#### 📅 Calendario de Partidos
- **Navegación semanal** con controles intuitivos
- **Visualización por grupos** organizada y clara
- **Estados de partidos** (programado/finalizado)
- **Resultados** con marcadores y ganadores

#### 🏆 Clasificaciones
- **Tablas dinámicas** por grupo
- **Sistema de puntuación** (3 puntos por victoria)
- **Estadísticas completas**: partidos, sets, porcentaje de victorias
- **Criterios de desempate** automáticos
- **Indicadores visuales** de posiciones (oro, plata, bronce)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS personalizado
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router DOM
- **Hosting**: Firebase App Hosting

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta de Firebase

### 1. Clonar e Instalar
```bash
git clone <repository-url>
cd liga-billar-app
npm install
```

### 2. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password)
3. Habilitar Firestore Database
4. Obtener la configuración del proyecto
5. Actualizar `src/firebase/config.ts` con tus credenciales:

```typescript
const firebaseConfig = {
  apiKey: \"tu-api-key\",
  authDomain: \"tu-auth-domain\",
  projectId: \"tu-project-id\",
  storageBucket: \"tu-storage-bucket\",
  messagingSenderId: \"tu-messaging-sender-id\",
  appId: \"tu-app-id\"
};
```

### 3. Configurar Usuario Administrador

1. En Firebase Authentication, crear un usuario con email/contraseña
2. Actualizar `src/firebase/auth.ts` con el email del administrador:

```typescript
export const ADMIN_EMAIL = 'tu-email-admin@ejemplo.com';
```

### 4. Ejecutar en Desarrollo
```bash
npm run dev
```

### 5. Build y Deploy
```bash
# Build para producción
npm run build

# Deploy a Firebase (requiere Firebase CLI)
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📱 Uso de la Aplicación

### Para Visitantes
- **Navegar** por el calendario de partidos
- **Consultar** clasificaciones por grupo
- **Ver** estadísticas de jugadores

### Para Administradores
1. **Iniciar sesión** en `/login`
2. **Acceder** al panel de administración en `/admin`
3. **Gestionar jugadores**: agregar nuevos participantes
4. **Crear grupos**: organizar la liga
5. **Programar partidos**: definir enfrentamientos
6. **Actualizar resultados**: registrar marcadores

## 🎮 Estructura de Datos

### Jugadores
```typescript
interface Player {
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
```

### Partidos
```typescript
interface Match {
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
```

## 🔒 Seguridad

- **Autenticación** requerida para operaciones administrativas
- **Reglas de Firestore** para control de acceso
- **Validación** en frontend y backend
- **Rutas protegidas** para funciones sensibles

## 🎨 Personalización del Tema

El tema se puede personalizar modificando las variables CSS en `src/index.css`:

```css
:root {
  --neon-blue: #00f3ff;
  --neon-purple: #bf00ff;
  --neon-green: #39ff14;
  --neon-gold: #ffd700;
  /* ... más variables */
}
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🎯 Próximas Funcionalidades

- [ ] Sistema de torneos
- [ ] Estadísticas avanzadas
- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [ ] Modo espectador en vivo
- [ ] Integración con redes sociales
- [ ] Sistema de apuestas virtuales

---

**¡Que comience la competición! 🎱⚡**