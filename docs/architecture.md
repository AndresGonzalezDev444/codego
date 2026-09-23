# CodeGo! — Architecture

## Visión General

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                      │
│                                                          │
│  React + TypeScript + Vite                               │
│  Tailwind CSS + Framer Motion                            │
│  Zustand (estado global)                                 │
│  React Router v6 (navegación)                            │
│                                                          │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │  Code Runner│   │  Byte Engine │   │  Exercise    │  │
│  │  (WASM/WW) │   │  (SVG+CSS)   │   │  Renderer    │  │
│  └─────────────┘   └──────────────┘   └──────────────┘  │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS / Supabase SDK
┌──────────────────────────▼───────────────────────────────┐
│                   SUPABASE                                │
│                                                          │
│  PostgreSQL + RLS                                        │
│  Supabase Auth (Email + Google OAuth)                    │
│  Supabase Storage (assets)                               │
│  Edge Functions (futuro)                                 │
└──────────────────────────────────────────────────────────┘
```

## Navegación (Mapa de Rutas)

### Rutas Públicas
```
/                    Landing page
/login               Inicio de sesión
/register            Registro
/forgot-password     Recuperar contraseña
```

### Rutas de App (requieren auth)
```
/app                 → redirect a /app/home
/app/home            Dashboard del estudiante
/app/map             Mapa de mundos interactivo
/app/worlds          Lista de mundos
/app/courses/:id     Detalle de curso
/app/unit/:id        Detalle de unidad
/app/lesson/:id      Lección con ejercicios
/app/exercise/:id    Ejercicio individual
/app/code-lab/:id    Code Lab
/app/profile         Perfil del usuario
/app/achievements    Logros
/app/leaderboard     Ranking
/app/settings        Configuración
/app/training        Entrenamiento / repaso
```

### Rutas Admin (requieren role=admin)
```
/admin               Dashboard admin
/admin/users         Gestión de usuarios
/admin/worlds        CRUD mundos
/admin/courses       CRUD cursos
/admin/units         CRUD unidades
/admin/lessons       CRUD lecciones
/admin/exercises     CRUD ejercicios
/admin/achievements  CRUD logros
/admin/statistics    Estadísticas
```

## Capa de Servicios

Toda la comunicación con Supabase pasa por servicios:

```typescript
authService        // login, register, logout, OAuth, profile
courseService      // worlds, courses, units, lessons
exerciseService    // exercises, options, tests, hints
progressService    // user_progress, attempts, completion
gamificationService // XP, bytes, streak, level, achievements
profileService     // perfil, stats, settings
leaderboardService // ranking, posición del usuario
adminService       // CMS operations
notificationService // notificaciones en-app
```

## Stores (Zustand)

```typescript
authStore          // user, session, loading
uiStore            // theme, sidebar, modals, toasts
progressStore      // XP, bytes, streak, level, achievements
byteStore          // estado/mood de Byte, mensajes
lessonStore        // estado de lección actual
```

## Code Runner Architecture

```
Browser
  ├── Python  → Pyodide (WebAssembly) [Web Worker]
  ├── JS      → Function() sandbox   [Web Worker]
  ├── HTML/CSS → iframe sandboxed
  └── [Futuro] → Judge0 API adapter
```

## Flujo de Usuario Principal

```
Landing → Register/Login → Onboarding → Dashboard
                                           ↓
                                      Map → World → Course
                                           ↓
                               Unit → Lesson → Exercises
                                           ↓
                            XP + Bytes + Byte celebration
                                           ↓
                                   Progress persisted
```

## Principios de Diseño

1. **Contenido en BD, no hardcodeado** — El CMS es real
2. **Servicios centralizados** — No queries dispersas
3. **RLS como primera línea** — La seguridad no es solo frontend
4. **Code Runner aislado** — Nunca código de usuario en el server
5. **Byte como sistema** — No decoración, sino UX activa
6. **Responsive desde el inicio** — No al final
