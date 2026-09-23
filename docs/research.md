# CodeGo! — Research

## Plataformas analizadas

| Plataforma | Qué aprender | Qué NO copiar | Tecnología | Licencia | Reutilización |
|---|---|---|---|---|---|
| **Duolingo** | Gamificación, streak, onboarding, mascota, feedback inmediato | Personaje (Duo), frases exactas, mecánicas de "vida", UI | React Native / Web | Propietario | Solo inspiración conceptual |
| **Exercism** | Estructura de tracks, ejercicios por lenguaje, mentores, tests | Contenido de ejercicios directamente | Elixir / React | MIT (plataforma) / Varía por track | Ver licencia por ejercicio |
| **freeCodeCamp** | Curriculum progresivo, proyectos, certificados, Code Lab web | Contenido de texto, ejercicios específicos | React / Node | BSD-3-Clause | Posible con atribución correcta |
| **The Odin Project** | Secuencia pedagógica, proyectos reales, recursos open source | Contenido directamente | Ruby / React | CC BY-NC-SA 4.0 | Solo referencia, no comercial |
| **Artemis** | Sistema de gamificación académica, tipos de ejercicio, feedback | Código fuente (Apache 2.0) | Java Spring / Angular | Apache 2.0 | Referencia de arquitectura |
| **Codelingo** | Micro-lecciones de código, interfaz educativa | — (inactivo/cerrado) | — | — | Solo referencia visual |
| **Codewars** | Katas, ranking, XP, comunidad | Contenido de katas | Ruby / React | Propietario | Solo inspiración |
| **LeetCode** | Code Lab, tests, judge system | Contenido, juez | — | Propietario | Solo inspiración |
| **CodeCombat** | Gamificación extrema, mundos, avatares | Assets visuales | JavaScript | Propietario (core) | Solo inspiración |

## Decisiones clave del Research

### Code Runner
- **Pyodide** (Python en WASM): MIT license, mantenido por Mozilla/comunidad. Ejecuta Python real en el navegador sin servidor.
- **Sandbox JS**: Web Worker + Function constructor con whitelist. Sin acceso a DOM, localStorage, fetch.
- **HTML/CSS**: iframe sandboxed sin allow-scripts para preview seguro.
- Arquitectura preparada para Judge0 (open source, auto-hosteable).

### Gamificación
- XP lineal con curva de nivel cuadrática (como Duolingo/Reddit)
- Streak basado en días calendario (timezone del usuario)
- Logros inmutables (no se pierden una vez obtenidos)
- Bytes (moneda) no intercambiables por dinero real

### Contenido Educativo
- Todo el contenido de Python Fundamentals será **original y creado específicamente para CodeGo!**
- Se usarán como referencia pedagógica (sin copiar): freeCodeCamp curriculum structure, The Odin Project lesson format
- Cada ejercicio tendrá autor, fecha de creación y revisión documentada en DB

### Seguridad
- RLS en Supabase para todas las tablas
- No ejecutar código de usuarios en el servidor de la app
- Auth mediante Supabase (no contraseñas manuales)
- Variables de entorno nunca en Git
