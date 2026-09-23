# CodeGo! 🚀

CodeGo! es una plataforma educativa gamificada (al estilo Duolingo) diseñada para aprender a programar de manera interactiva. Actualmente enfocado en Python a través del mundo "Pythonia", permite a los usuarios ejecutar código real directamente en el navegador, completar misiones, ganar experiencia (XP) y competir en un ranking global.

**Desarrollado por [AndresGonzalezDev](https://andresgonzalezdev.me)**

---

## ✨ Características Principales

* **Code Lab Integrado:** Ejecución real de Python en el navegador utilizando Web Workers y Pyodide (sin necesidad de servidores backend para compilar).
* **Gamificación Avanzada:** 
  * Sistema de vidas (Corazones) con temporizadores de regeneración.
  * Experiencia (XP), Niveles y Rachas de días activos (Streaks).
  * Sala de Logros y Medallas desbloqueables.
* **Mundos Temáticos:** El aprendizaje se divide en "Mundos" interactivos y visualmente atractivos. (Ej. Pythonia).
* **CodeGo! Plus:** Una capa premium (simulada) que otorga a los usuarios vidas infinitas y una insignia VIP dorada en la Liga de Programadores.
* **Leaderboard en Tiempo Real:** Ranking global donde los usuarios compiten por estar en el primer lugar según su XP acumulada.
* **UI/UX Moderna:** Diseño "Dark Mode" con Glassmorphism, animaciones fluidas con Framer Motion y una mascota interactiva llamada "Byte" que reacciona a los eventos del código.

---

## 🛠️ Stack Tecnológico

**Frontend:**
* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS v4](https://tailwindcss.com/)
* [Framer Motion](https://www.framer.com/motion/) (Animaciones)
* [Zustand](https://github.com/pmndrs/zustand) (Estado Global)
* [CodeMirror 6](https://codemirror.net/) (Editor de código)

**Backend & Database:**
* [Supabase](https://supabase.com/) (PostgreSQL + Auth + Row Level Security)

**Code Execution:**
* [Pyodide](https://pyodide.org/) (Ejecución de Python en Web Workers)

---

## ⚙️ Instalación Local

Para correr este proyecto en tu entorno local necesitas tener `Node.js` instalado y una base de datos de Supabase.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AndresGonzalezDev444/codego.git
   cd codego
   ```

2. **Configurar el entorno Frontend:**
   ```bash
   cd web
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Crea un archivo `.env.local` en la carpeta `web/` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=tu_supabase_anon_key
   ```

4. **Configurar Supabase (Base de Datos):**
   Abre la consola SQL de tu proyecto en Supabase y ejecuta en orden los archivos de la carpeta `supabase/`:
   - `migrations/00001_initial_schema.sql` (Esquema base, tablas y políticas RLS)
   - `migrations/00002_add_hearts.sql` (Migración para el sistema de vidas)
   - `migrations/00003_add_plus_status.sql` (Migración para suscripción Plus)
   - `seed/00001_initial_data.sql` (Datos semilla: mundos, cursos y lecciones)

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Creador

Desarrollado con ❤️ y código limpio por **AndresGonzalezDev**.
* 🌐 **Portafolio:** [andresgonzalezdev.me](https://andresgonzalezdev.me)
* 🐙 **GitHub:** [AndresGonzalezDev444](https://github.com/AndresGonzalezDev444)
