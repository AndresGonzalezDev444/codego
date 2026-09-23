# CODEGO! — PROMPT MAESTRO DE DESARROLLO

## 0. ROL DEL AGENTE

Actúa como un equipo senior multidisciplinario encargado de diseñar y construir desde cero **CodeGo!**, una plataforma web gamificada para aprender programación.

Debes comportarte simultáneamente como:

- Product Designer / UX Designer.
- UI Designer.
- Software Architect.
- Frontend Engineer.
- Backend Engineer.
- Database Engineer.
- Mobile Architect.
- Content Designer educativo.
- QA Engineer.
- DevOps Engineer.
- Security Engineer.

El objetivo no es crear un simple CRUD ni un clon visual de Duolingo.

El objetivo es construir un **MVP real, funcional, desplegable y escalable**, donde el aprendizaje de programación esté representado como una experiencia de videojuego educativa.

El producto debe sentirse como una plataforma propia, con identidad visual propia, mascota propia, sistema de progresión propio y mecánicas educativas propias.

El nombre oficial del producto es:

# CODEGO!

Tagline principal:

> **Aprende. Crea. Evoluciona.**

Personaje principal:

# BYTE

Byte será la mascota y acompañante del usuario durante toda la experiencia.

---

# 1. VISIÓN DEL PRODUCTO

CodeGo! será una plataforma para aprender programación mediante:

- microlecciones;
- preguntas tipo opción múltiple;
- quizzes;
- completar código;
- ordenar código;
- detectar errores;
- predecir resultados;
- ejercicios interactivos;
- desafíos;
- ejecución de código;
- niveles;
- experiencia XP;
- rachas;
- recompensas;
- logros;
- rankings;
- mapas de aprendizaje;
- mundos temáticos;
- progreso persistente;
- feedback visual;
- mascota animada;
- CMS administrativo.

La filosofía de aprendizaje debe ser:

> **Aprender → intentar → equivocarse → recibir feedback → volver a intentar → dominar → desbloquear.**

No convertir la plataforma en un curso tradicional lleno de texto.

El usuario debe sentir que está avanzando dentro de un mundo.

---

# 2. REFERENCIA VISUAL PRINCIPAL

Usa como referencia conceptual y visual el diseño de CodeGo! previamente establecido.

La dirección artística es:

## TECH + FANTASY + GAMIFICATION + EDUCATION

No utilizar una estética genérica de dashboard SaaS.

No producir una interfaz que parezca:

- Bootstrap por defecto;
- AdminLTE;
- plantilla empresarial;
- Moodle;
- dashboard corporativo;
- clon exacto de Duolingo;
- clon de VS Code.

CodeGo! debe tener identidad propia.

---

# 3. IDENTIDAD VISUAL

## Paleta

La paleta base debe partir aproximadamente de:

- fondo principal: navy/azul muy oscuro;
- superficies: azul oscuro ligeramente elevado;
- cyan eléctrico;
- violeta/púrpura;
- azul luminoso;
- naranja cálido para recompensas;
- blanco para texto principal.

Usar gradientes con moderación.

El diseño debe tener profundidad mediante:

- glassmorphism ligero;
- paneles elevados;
- bordes luminosos sutiles;
- sombras;
- glow controlado;
- gradientes;
- ilustraciones.

No saturar la pantalla de efectos.

---

# 4. TIPOGRAFÍA

Utilizar una tipografía moderna y consistente.

Referencia:

**Montserrat** para headings y UI principal.

Para código:

usar una fuente monoespaciada adecuada.

Crear tokens tipográficos:

```text
Display
H1
H2
H3
Body
Small
Caption
Code
```

No utilizar tamaños arbitrarios por componente.

---

# 5. BYTE — MASCOTA OFICIAL

Byte es un pequeño robot de aspecto felino/mascota digital.

Características visuales:

- cuerpo pequeño;
- cabeza relativamente grande;
- orejas puntiagudas;
- visor negro/dark;
- ojos/expresiones luminosas;
- carcasa blanca;
- detalles cyan;
- detalles violetas;
- pequeños elementos tecnológicos;
- apariencia simpática;
- proporciones de mascota;
- estética futurista;
- aspecto de compañero de aventura.

Byte NO debe parecer un robot militar.

Debe transmitir:

> curioso + inteligente + amigable + aventurero.

Byte es una identidad propia de CodeGo!.

No utilizar personajes de Duolingo ni copiar diseños, sprites, animaciones, ilustraciones o assets de Duolingo.

---

# 6. ESTADOS DE BYTE

Crear un sistema de estados de mascota.

Mínimo:

```text
IDLE
HAPPY
SAD
THINKING
CONFUSED
EXCITED
CELEBRATING
ANGRY
SLEEPING
TIRED
ENCOURAGING
PROUD
SURPRISED
ERROR
WELCOME
EXPLORER
```

Cada estado debe tener:

- expresión;
- postura;
- animación;
- mensaje opcional;
- contexto de activación.

Ejemplos:

## WELCOME

Cuando el usuario entra:

Byte aparece:

> "¡Listo para programar?"

Animación:

- pequeño salto;
- ojos luminosos;
- saludo.

---

## SAD / ABSENCE

Cuando el usuario lleva determinado tiempo sin iniciar sesión:

Byte debe aparecer triste.

Ejemplo visual:

```text
Byte sentado
orejas ligeramente bajas
mirando hacia un lado
pequeña animación de espera
```

Mensaje original:

> "Hace rato no exploramos juntos. Tengo una misión esperando."

No copiar frases, animaciones ni comportamiento exacto de Duolingo.

---

## CELEBRATING

Cuando termina una lección:

- Byte salta;
- confeti;
- partículas;
- ojos brillantes;
- pequeño movimiento corporal.

Mensaje:

> "¡Nivel superado!"

---

## ERROR

Cuando falla un ejercicio:

Byte NO debe castigar ni ridiculizar.

Debe mostrar:

> "Casi. Mira otra vez esa parte."

---

## THINKING

Cuando se muestra una pista:

Byte aparece pensando.

---

## PROUD

Después de resolver un ejercicio difícil:

> "¡Eso estuvo genial!"

---

## SLEEPING

Cuando el usuario permanece mucho tiempo inactivo o durante una pantalla de espera.

---

# 7. ANIMACIÓN DE BYTE

Prioridad:

1. SVG propio + CSS;
2. Framer Motion;
3. animaciones React;
4. Lottie/Rive solamente cuando aporte verdadero valor y la licencia sea apropiada.

No depender de assets externos con licencias desconocidas.

Crear un sistema reusable:

```text
<Byte
   mood="happy"
   animation="celebrate"
   size="medium"
/>
```

Ejemplo conceptual:

```typescript
type ByteMood =
  | "idle"
  | "happy"
  | "sad"
  | "thinking"
  | "confused"
  | "celebrating"
  | "angry"
  | "sleeping"
  | "tired"
  | "proud";
```

Crear un componente global para que cualquier pantalla pueda solicitar el estado de Byte.

---

# 8. EXPERIENCIA PRINCIPAL

La pantalla principal NO debe ser simplemente un dashboard lleno de tarjetas.

La home del estudiante debe representar:

# "Tu aventura en el mundo del código"

Debe mostrar:

```text
Byte

Tu progreso

XP
Racha
Bytes

Continuar aprendizaje

Mapa

Última misión

Logros
```

Y el elemento visual principal debe ser el **mundo de aprendizaje**.

---

# 9. CODE WORLD

Crear un mapa visual de aprendizaje.

Ejemplo conceptual:

```text
                🌌 CODE WORLD

                     🏰

                  Variables
                     │
                     ●
                     │
                 Condiciones
                     │
                     ●
                    / \
                   /   \
               Loops   Quiz
                  │
                  ●
               Functions
                  │
                  ●
                🔒 OOP
```

No tiene que ser literalmente ese diseño.

Debe sentirse como un mapa de videojuego educativo.

---

# 10. MUNDOS

Crear múltiples mundos conceptuales.

MVP:

```text
Pythonia
JavaScript City
WebVerse
Java Empire
C++ Forge
```

No todos tienen que estar totalmente desarrollados inicialmente.

Para la primera versión:

# PYTHONIA

debe ser el mundo principal completamente funcional.

Los demás pueden existir como contenido bloqueado / roadmap.

---

# 11. SISTEMA DE PROGRESIÓN

Cada lenguaje contiene:

```text
World
  ↓
Course
  ↓
Unit
  ↓
Lesson
  ↓
Exercise
  ↓
Challenge
```

Ejemplo:

```text
Pythonia
└── Python Fundamentals
    ├── 01 Variables
    ├── 02 Data Types
    ├── 03 Operators
    ├── 04 Conditionals
    ├── 05 Loops
    ├── 06 Functions
    └── 07 Collections
```

---

# 12. TIPOS DE LECCIONES

CodeGo! necesita variedad.

No usar únicamente preguntas ABCD.

Implementar una arquitectura extensible de tipos de ejercicio.

Mínimo:

## TYPE A — MULTIPLE CHOICE

```text
¿Qué imprime este código?

x = 5
print(x + 2)

A) 5
B) 7
C) 52
D) Error
```

---

## TYPE B — TRUE / FALSE

Ejemplo:

```text
Una variable puede cambiar de valor.

[Verdadero]
[Falso]
```

---

## TYPE C — COMPLETE CODE

```python
nombre = "Robinson"

print(________)
```

---

## TYPE D — PREDICT OUTPUT

Mostrar código y solicitar resultado.

---

## TYPE E — ORDER CODE

El usuario debe ordenar bloques de código.

Debe funcionar tanto con:

- mouse;
- touch;
- teclado.

---

## TYPE F — FIND THE BUG

Presentar código incorrecto y solicitar:

- línea incorrecta;
- error;
- corrección.

---

## TYPE G — MATCHING

Relacionar:

```text
Variable → almacenar datos
Loop → repetir
Function → reutilizar lógica
```

---

## TYPE H — CODE LAB

Editor de código.

Ejemplo:

```text
┌──────────────────────────────┐
│ 1  def suma(a, b):           │
│ 2      return a + b           │
│                              │
└──────────────────────────────┘

        [ Ejecutar ]

Output
───────────────────────────────
5
```

---

## TYPE I — CHALLENGE

Problema abierto.

Ejemplo:

> Crea una función que reciba dos números y devuelva el mayor.

---

# 13. CODE LAB

El Code Lab es una de las funcionalidades diferenciadoras.

Diseñarlo visualmente como una mezcla entre:

- playground;
- editor educativo;
- terminal;
- feedback gamificado.

No copiar VS Code.

Debe tener:

```text
Challenge
Instructions
Code Editor
Run
Reset
Output
Tests
Hints
Progress
```

Ejemplo:

```text
┌─────────────────────────────────────────┐
│ Misión #14                              │
│                                         │
│ Crea una función que sume dos números.  │
├───────────────────────┬─────────────────┤
│                       │ Byte             │
│ def suma(a,b):        │ 💡 Pista        │
│     return ...        │                  │
│                       │ "Piensa qué      │
│                       │ operación..."    │
│                       │                  │
├───────────────────────┴─────────────────┤
│ [▶ Ejecutar] [↻ Reiniciar]              │
├─────────────────────────────────────────┤
│ Tests                                   │
│ ✓ suma(2,3) → 5                         │
│ ✓ suma(5,5) → 10                        │
└─────────────────────────────────────────┘
```

---

# 14. SEGURIDAD DEL CODE LAB

Nunca ejecutar código arbitrario de usuarios dentro del servidor normal de la aplicación.

Crear una abstracción:

```text
CodeRunner
```

Ejemplo:

```typescript
interface CodeRunner {
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
}
```

Primera versión sin presupuesto:

- JavaScript en navegador;
- Python mediante tecnología WebAssembly apropiada, como Pyodide;
- HTML/CSS con preview aislado;
- ejercicios que puedan evaluarse localmente.

Crear el sistema para poder agregar posteriormente:

```text
Judge0 adapter
Docker sandbox
self-hosted runner
```

No depender del API público de Piston.

Toda ejecución remota futura debe utilizar aislamiento, límites de CPU/memoria/tiempo y prohibición de acceso indebido al sistema.

---

# 15. SISTEMA DE TESTS

Cada ejercicio de código debe poder tener tests ocultos y visibles.

Ejemplo:

```json
{
  "language": "python",
  "starterCode": "def suma(a,b):\n    pass",
  "tests": [
    {
      "input": [2,3],
      "expected": 5
    },
    {
      "input": [10,5],
      "expected": 15
    }
  ]
}
```

Nunca enviar al cliente los tests realmente secretos cuando el sistema de evaluación futuro sea server-side.

---

# 16. FEEDBACK

El feedback debe ser inmediato.

Correcto:

```text
✓ Correcto

+20 XP
+5 Bytes

Byte celebrando
```

Incorrecto:

```text
Casi.

Tu respuesta no coincide.

💡 Pista:
¿Qué ocurre antes de ejecutar el print?
```

Evitar mensajes agresivos.

---

# 17. SISTEMA DE GAMIFICACIÓN

Crear:

## XP

Se obtiene por:

- completar lecciones;
- resolver ejercicios;
- completar desafíos;
- finalizar unidades;
- mantener rachas.

---

## BYTES

Moneda interna de CodeGo!.

Sirven inicialmente para:

- personalización;
- elementos cosméticos;
- Byte;
- temas;
- insignias especiales.

No implementar compras reales.

---

## STREAK

Registrar días consecutivos.

Ejemplo:

```text
🔥 7 días
```

Crear protección de racha como funcionalidad futura.

---

## LEVEL

El nivel depende del XP.

---

## ACHIEVEMENTS

Ejemplos:

```text
🎖 Primer código
🐍 Python básico
⚡ 100 XP
🔥 7 días
💻 50 ejercicios
🧠 Sin pistas
🏆 Primer Boss
```

---

# 18. BOSS BATTLE

Cada gran unidad termina con un reto especial.

Ejemplo:

```text
╔═══════════════════════════════╗
║        BOSS BATTLE             ║
║                               ║
║      🐛 THE BUG                ║
║                               ║
║   Corrige el código.           ║
╚═══════════════════════════════╝
```

Debe combinar conceptos aprendidos anteriormente.

Byte acompaña al usuario.

---

# 19. SISTEMA DE PISTAS

Cada ejercicio puede tener:

```text
Hint 1
Hint 2
Hint 3
```

Las pistas deben ir progresivamente de:

```text
sutil
↓
orientación
↓
conceptual
↓
casi solución
```

No revelar automáticamente la solución.

La IA no se implementará inicialmente.

Diseñar la arquitectura para agregar un servicio `TutorAI` posteriormente.

---

# 20. IA — ARQUITECTURA RESERVADA, NO IMPLEMENTAR EN MVP

Crear una capa abstracta:

```text
TutorService
```

No conectar ninguna API de IA durante la primera fase funcional.

Posteriormente podrá soportar:

- OpenRouter;
- modelos propios;
- APIs comerciales;
- modelos locales.

La interfaz deberá permitir:

```text
generateHint()
explainMistake()
generatePractice()
reviewCode()
```

Pero durante V1:

```text
TutorService = StaticTutorService
```

utilizando contenido predefinido.

---

# 21. AUTENTICACIÓN

Implementar:

- registro;
- login;
- logout;
- recuperación de contraseña;
- sesión persistente;
- Google OAuth;
- protección de rutas.

Propuesta para MVP:

# Supabase Auth

No almacenar contraseñas manualmente.

Google OAuth debe manejarse mediante Supabase.

Todos los secrets deben estar en:

```text
.env
.env.local
```

Nunca subir secrets a Git.

Crear:

```text
.env.example
```

---

# 22. PROGRESO PERSISTENTE

El usuario debe poder:

1. registrarse desde PC;
2. completar una lección;
3. cerrar sesión;
4. entrar desde otro dispositivo;
5. recuperar exactamente su progreso.

Persistir:

```text
XP
Level
Streak
Bytes
completed lessons
exercise attempts
scores
achievements
current path
last activity
favorites
settings
theme
```

---

# 23. MODELO DE BASE DE DATOS

Diseñar PostgreSQL adecuadamente.

Entidades mínimas:

```text
profiles
roles
languages
worlds
courses
units
lessons
exercises
exercise_options
exercise_tests
hints
user_progress
exercise_attempts
xp_events
streaks
achievements
user_achievements
leaderboard
rewards
user_rewards
notifications
```

Añadir timestamps:

```text
created_at
updated_at
```

cuando corresponda.

Utilizar relaciones adecuadas.

Crear índices donde sean necesarios.

No almacenar información redundante sin motivo.

---

# 24. RLS / SEGURIDAD

Aplicar Row Level Security.

Un usuario normal:

- puede leer contenido publicado;
- puede leer y modificar su propio progreso;
- puede leer sus propios intentos;
- puede administrar su perfil;
- no puede modificar cursos;
- no puede crear ejercicios;
- no puede otorgarse XP;
- no puede modificar rankings;
- no puede acceder a información administrativa.

Administrador:

- administra contenidos;
- administra usuarios;
- administra ejercicios;
- administra estadísticas.

No confiar únicamente en ocultar botones del frontend.

---

# 25. ROLES

Mínimo:

```text
guest
student
admin
```

Preparar arquitectura para:

```text
instructor
editor
moderator
```

---

# 26. CMS ADMINISTRATIVO

Crear un CMS completo.

Ruta:

```text
/admin
```

Dashboard:

```text
Usuarios
Cursos
Mundos
Unidades
Lecciones
Ejercicios
Logros
Recompensas
Estadísticas
Configuración
```

---

# 27. CMS — CREAR EJERCICIO

El administrador debe poder seleccionar:

```text
Tipo:
○ Multiple Choice
○ True / False
○ Complete
○ Predict
○ Order
○ Find Bug
○ Matching
○ Code Lab
○ Challenge
```

Y crear el contenido correspondiente.

No crear un formulario gigantesco.

Usar formularios dinámicos dependiendo del tipo.

Ejemplo:

```text
Exercise Type:
[Code Lab ▼]
```

automáticamente muestra:

```text
Language
Starter Code
Instructions
Visible Tests
Hidden Tests
Hints
XP Reward
Byte Reward
Difficulty
```

---

# 28. CMS — PUBLICACIÓN

Los contenidos deben tener estados:

```text
draft
review
published
archived
```

El estudiante solamente ve:

```text
published
```

---

# 29. CMS — PREVISUALIZACIÓN

El administrador debe poder pulsar:

```text
[Preview]
```

y ver el ejercicio tal como lo verá el estudiante.

---

# 30. ESTADÍSTICAS

Dashboard administrativo:

```text
Usuarios registrados
Usuarios activos
Lecciones completadas
Ejercicios completados
Tasa de error
Ejercicio más fallado
Unidad con mayor abandono
Lenguaje más utilizado
XP total
Rachas
```

Gráficas claras.

No llenar el dashboard de gráficos innecesarios.

---

# 31. PERFIL DEL USUARIO

Diseñar perfil como:

```text
           BYTE

       AlexCode
       Level 12

XP ─────────────────

🔥 Racha 17 días

💎 Bytes 480

🏆 Logros
```

Secciones:

```text
Overview
Progress
Achievements
Statistics
Customization
Settings
```

---

# 32. PERSONALIZACIÓN

Permitir posteriormente:

- tema;
- avatar;
- accesorios de Byte;
- fondo;
- badges;
- frame de perfil.

No implementar compras reales.

Los elementos se desbloquean mediante Bytes o logros.

---

# 33. RANKING

Crear leaderboard:

```text
#1
#2
#3
...
```

Pero evitar convertirlo en una experiencia tóxica.

Mostrar también:

> Tu posición

y comparar con amigos/ficticios en el MVP.

No es necesario implementar sistema social complejo.

---

# 34. NOTIFICACIONES

Implementar inicialmente:

- notificación de nuevo logro;
- subida de nivel;
- misión completada;
- regreso después de ausencia;
- nueva misión.

Crear arquitectura preparada para Web Push.

No depender de servicios de pago.

---

# 35. DISEÑO RESPONSIVE

CodeGo! debe ser responsive desde el comienzo.

Breakpoints:

```text
mobile
tablet
desktop
wide desktop
```

No hacer simplemente "encoger el desktop".

La interfaz móvil debe rediseñar elementos cuando sea necesario.

Ejemplo:

Desktop:

```text
Sidebar
Content
Right panel
```

Mobile:

```text
Header
Content
Bottom navigation
```

---

# 36. MOBILE WEB

En móvil:

Bottom navigation:

```text
🏠
🗺
📚
🏆
👤
```

No utilizar sidebar gigante.

Los ejercicios deben funcionar perfectamente mediante touch.

El Code Lab debe poder usarse en pantallas pequeñas.

---

# 37. WEB + FUTURA APP FLUTTER

Diseñar desde ahora para que Flutter sea un segundo cliente.

Arquitectura conceptual:

```text
                 CODEGO BACKEND
                       │
             ┌─────────┴─────────┐
             │                   │
          WEB CLIENT        FLUTTER CLIENT
             │                   │
           React               Flutter
```

No duplicar lógica de negocio innecesariamente.

La información debe vivir en backend/database.

Flutter deberá reutilizar:

- autenticación;
- cursos;
- progreso;
- XP;
- logros;
- ranking;
- perfil;
- contenido.

La futura aplicación móvil NO será una simple webview.

Será una aplicación Flutter auténtica.

---

# 38. API / CONTRATO

Aunque Supabase pueda proporcionar acceso directo a datos, diseñar claramente los contratos del sistema.

Crear capa de servicios:

```text
authService
courseService
lessonService
exerciseService
progressService
gamificationService
profileService
leaderboardService
adminService
```

No colocar consultas de base de datos por todo el código.

---

# 39. STACK PROPUESTO

Primera opción:

## Web

```text
React
TypeScript
Vite o Next.js
Tailwind CSS
Framer Motion
```

Usar componentes reutilizables.

## Backend / Database

```text
Supabase
PostgreSQL
Supabase Auth
Supabase Storage
```

## Mobile futuro

```text
Flutter
Dart
```

## Testing

```text
Vitest
React Testing Library
Playwright
```

Utilizar equivalentes si el stack finalmente elegido es diferente, pero justificar la decisión en `docs/architecture.md`.

---

# 40. DESIGN SYSTEM

Crear:

```text
Button
IconButton
Input
Select
Textarea
Card
Badge
Modal
Toast
Tooltip
ProgressBar
ProgressRing
Avatar
Byte
LessonCard
WorldCard
ExerciseCard
AchievementCard
LeaderboardRow
CodeEditor
CodeOutput
HintPanel
XPAnimation
StreakBadge
```

No repetir estilos manualmente.

---

# 41. MICROINTERACCIONES

Agregar microanimaciones:

- button press;
- correct answer;
- incorrect answer;
- XP gained;
- level up;
- badge unlocked;
- streak;
- exercise completion;
- map unlock;
- Byte reaction.

Ejemplo:

```text
Correcto
     ↓
✓
+20 XP
+5 Bytes
     ↓
Byte celebra
     ↓
siguiente ejercicio
```

La animación debe durar poco.

Nunca ralentizar innecesariamente la experiencia.

---

# 42. ESTADOS DE UI

Cada pantalla debe considerar:

```text
loading
empty
error
success
disabled
offline
unauthorized
not found
```

No dejar pantallas blancas.

Ejemplo:

```text
Cargando...

Byte está preparando tu misión...
```

---

# 43. OFFLINE / CONECTIVIDAD

Preparar la web para detectar pérdida de conexión.

Mostrar:

```text
⚡ Sin conexión

Tus últimos datos están disponibles.
Al recuperar conexión sincronizaremos tu progreso.
```

No perder progreso fácilmente.

Para V1 puede utilizarse una estrategia simple de cola/sincronización.

---

# 44. CONTENIDO EDUCATIVO

No llenar CodeGo! exclusivamente con preguntas generadas al azar.

La plataforma necesita una secuencia pedagógica coherente.

Primer curso:

# Python Fundamentals

Contenido inicial recomendado:

```text
01 ¿Qué es programar?
02 Variables
03 Tipos de datos
04 Strings
05 Numbers
06 Booleanos
07 Operadores
08 Input
09 Condicionales
10 Loops
11 Lists
12 Dictionaries
13 Functions
14 Scope
15 Exceptions
16 Mini Project
```

Cada unidad debe contener:

```text
Micro lesson
Example
Quiz
Practice
Challenge
Review
```

---

# 45. CURRICULUM OPEN SOURCE

Investigar antes de incorporar contenido externo.

Revisar como referencias:

- Exercism;
- freeCodeCamp;
- The Odin Project;
- otros currículos open source adecuados.

También inspeccionar repositorios similares a CodeGo!, incluyendo proyectos como Codelingo y plataformas de aprendizaje interactivas como Artemis.

IMPORTANTE:

No copiar contenido, branding, código, imágenes o ejercicios de terceros sin revisar primero su licencia.

Crear:

```text
docs/content-sources.md
```

con:

```text
Fuente
URL/referencia
Tipo de material
Licencia
Qué puede reutilizarse
Qué debe atribuirse
Qué no puede reutilizarse
```

Para materiales con licencia permisiva:

- conservar copyright;
- conservar licencia;
- incluir atribución cuando corresponda.

Para materiales con restricciones:

- no importar automáticamente;
- usar únicamente como referencia;
- crear contenido original.

Preferir siempre contenido original escrito específicamente para CodeGo!.

---

# 46. IMPORTACIÓN DE CONTENIDO

Crear scripts opcionales:

```text
/scripts/import/
```

pero NO ejecutar importaciones masivas automáticamente.

Primero:

```text
research
↓
license check
↓
sample import
↓
human review
↓
full import
```

Crear seed inicial propio para Python.

---

# 47. CONTENIDO EN BASE DE DATOS

El contenido no debe estar hardcodeado en React.

NO hacer:

```typescript
const lessons = [...]
```

como fuente principal.

Debe existir:

```text
Database
   ↓
API
   ↓
Frontend
```

Esto es fundamental para que el CMS sea real.

---

# 48. SEO / LANDING PAGE

Crear landing pública:

```text
/
```

Debe tener:

```text
Logo CodeGo!
Byte
Qué es CodeGo!
Cómo funciona
Aprendizaje
Code Lab
Gamificación
CTA
Footer
```

CTA:

> Empieza tu aventura

y

> Explorar CodeGo!

---

# 49. PÁGINAS PRINCIPALES

Mínimo:

```text
/
 /login
 /register
 /forgot-password
 /app
 /app/map
 /app/worlds
 /app/courses
 /app/lesson/:id
 /app/exercise/:id
 /app/code-lab/:id
 /app/profile
 /app/achievements
 /app/leaderboard
 /app/settings
 /admin
 /admin/users
 /admin/worlds
 /admin/courses
 /admin/units
 /admin/lessons
 /admin/exercises
 /admin/achievements
 /admin/statistics
```

---

# 50. GAMIFICATION EVENTS

No modificar XP directamente desde cualquier componente.

Crear servicio:

```text
gamificationService
```

Ejemplos:

```text
completeExercise()
completeLesson()
completeUnit()
unlockAchievement()
updateStreak()
awardXP()
awardBytes()
```

Crear historial:

```text
xp_events
```

para poder auditar los cambios.

---

# 51. SISTEMA DE DIFICULTAD

Cada ejercicio:

```text
easy
medium
hard
boss
```

La interfaz debe comunicar visualmente la dificultad.

---

# 52. ADAPTACIÓN

No implementar IA inicialmente.

Pero crear reglas básicas.

Ejemplo:

```text
si usuario falla 3 ejercicios de loops
→ recomendar práctica adicional de loops
```

Esto crea un sistema de aprendizaje adaptativo sencillo.

Después se puede mejorar con IA.

---

# 53. REVIEW / REPASO

Crear una sección:

# "Entrenamiento"

El usuario puede practicar conceptos donde tuvo errores.

Ejemplo:

```text
Byte detectó que debes practicar:

Loops       ████░░ 62%
Functions   █████░ 72%
```

CTA:

```text
[Practicar ahora]
```

---

# 54. EXPERIENCIA DE RETORNO

Cuando un usuario vuelve después de ausentarse:

```text
Byte aparece
↓
animación
↓
mensaje
↓
último progreso
↓
"Continuar aventura"
```

Cuando vuelve después de varios días:

mostrar una pantalla especial:

```text
BYTE

"¡Regresaste!"

Tu aventura continúa.

🔥 Recupera tu racha
```

No regalar progreso artificialmente.

---

# 55. ONBOARDING

Al registrarse:

```text
Paso 1
¿Cómo quieres empezar?

○ Nunca he programado
○ Tengo conocimientos básicos
○ Ya programo
```

Paso 2:

```text
¿Qué quieres aprender?

○ Python
○ JavaScript
○ Web
```

Paso 3:

```text
¿Cuánto tiempo quieres practicar?

○ 5 min
○ 10 min
○ 20 min
```

Después:

```text
Byte
↓
Mapa
↓
Primera misión
```

No hacer onboarding demasiado largo.

---

# 56. PRIMERA MISIÓN

La primera interacción debe enseñar el funcionamiento de CodeGo!.

Ejemplo:

```text
Byte:

"Vamos a empezar con algo sencillo."

¿Qué imprime?

print("Hola")

○ Hola
○ Error
○ print
○ Nada
```

Correcto:

```text
Byte celebra
+10 XP
```

Después:

```text
Completa:

print(______)
```

Después:

```text
Code Lab
```

El usuario debe experimentar progresión en menos de unos minutos.

---

# 57. PRIMER BOSS

Al finalizar el primer bloque de Python:

```text
BOSS:
"Construye un pequeño programa."
```

Debe combinar:

- variables;
- input;
- condiciones;
- funciones.

No debe ser imposible para un principiante.

---

# 58. ACCESIBILIDAD

Aplicar WCAG razonablemente.

Considerar:

- contraste;
- navegación teclado;
- focus visible;
- labels;
- aria-label;
- tamaños táctiles;
- no depender exclusivamente del color;
- reduced motion;
- mensajes comprensibles.

Para animaciones:

respetar:

```text
prefers-reduced-motion
```

---

# 59. THEME

Crear:

```text
Dark
Light
System
```

La estética principal de la propuesta es dark.

Light theme debe mantener la identidad CodeGo!, no convertirse en una plantilla blanca genérica.

---

# 60. ICONOGRAFÍA

Usar un sistema consistente.

Puede utilizarse:

```text
Lucide
```

o una biblioteca equivalente.

Los iconos principales de CodeGo! pueden complementarse con ilustraciones propias.

---

# 61. NO HACER

No hacer:

```text
❌ clon visual de Duolingo
❌ copiar personajes de Duolingo
❌ copiar textos de Duolingo
❌ copiar animaciones de Duolingo
❌ dashboard genérico
❌ CRUD sin UX
❌ botones falsos
❌ información hardcodeada
❌ password management manual
❌ ejecutar código sin sandbox
❌ secretos en Git
❌ API de IA obligatoria
❌ dependencia obligatoria de servicios pagados
❌ dependencia obligatoria de API pública de ejecución
❌ responsive hecho al final
❌ navegación rota
❌ pantallas sin estados de error/loading
```

---

# 62. PRINCIPIO NO-BUDGET

CodeGo! debe poder funcionar inicialmente con:

```text
GitHub
+
Supabase Free
+
Hosting gratuito compatible
+
servicios open source
```

No incorporar:

- servicios premium;
- APIs pagadas obligatorias;
- dominios premium;
- infraestructura costosa.

Cuando una solución requiera dinero:

1. buscar alternativa open source;
2. buscar free tier;
3. buscar ejecución local/browser;
4. hacer el componente opcional.

La plataforma debe seguir funcionando sin IA y sin pagos.

---

# 63. DESPLIEGUE

Preparar:

```text
GitHub
↓
CI/CD
↓
Hosting gratuito
```

Crear ambientes:

```text
development
production
```

Crear:

```text
.env.example
README.md
DEPLOYMENT.md
```

No subir:

```text
.env
secrets
tokens
service keys
OAuth secrets
```

---

# 64. TESTING

Crear pruebas para:

### Auth

- register;
- login;
- logout;
- OAuth;
- protected routes.

### Learning

- lesson completion;
- exercise validation;
- progress persistence.

### Gamification

- XP;
- level;
- streak;
- achievements;
- Bytes.

### CMS

- CRUD;
- publication;
- permissions.

### Security

- user cannot modify another user's progress;
- user cannot assign own XP;
- student cannot access admin functionality.

### E2E

Flujo:

```text
Register
↓
Onboarding
↓
First Lesson
↓
Exercise
↓
XP
↓
Progress
↓
Logout
↓
Login again
↓
Progress preserved
```

---

# 65. DOCUMENTACIÓN

Crear:

```text
docs/
├── product.md
├── ux.md
├── design-system.md
├── architecture.md
├── database.md
├── api.md
├── security.md
├── content-sources.md
├── code-runner.md
├── gamification.md
├── mobile-roadmap.md
└── deployment.md
```

---

# 66. ESTRUCTURA DEL REPOSITORIO

Propuesta:

```text
codego/
│
├── apps/
│   ├── web/
│   └── mobile/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   ├── seed/
│   └── functions/
│
├── scripts/
│   ├── seed/
│   ├── content/
│   └── import/
│
├── docs/
│
├── tests/
│
├── .env.example
├── README.md
└── LICENSE
```

No es obligatorio utilizar exactamente esta estructura si el agente encuentra una arquitectura mejor, pero debe documentar cualquier cambio.

---

# 67. DESARROLLO POR FASES

NO construir todo de una vez.

Trabajar estrictamente por fases.

Cada fase debe terminar funcionando.

No comenzar la siguiente fase hasta que la actual tenga:

```text
implemented
tested
documented
```

---

# FASE 0 — RESEARCH

Objetivo:

Investigar antes de programar.

Analizar:

- Codelingo;
- Exercism;
- freeCodeCamp;
- The Odin Project;
- Artemis;
- proyectos similares;
- Code Lab;
- sistemas de gamificación;
- autenticación;
- ejecución segura.

Investigar licencias.

Crear:

```text
docs/research.md
docs/content-sources.md
```

Resultado esperado:

Una tabla con:

```text
Proyecto
Qué podemos aprender
Qué no debemos copiar
Tecnología
Licencia
Posible reutilización
```

NO copiar ningún proyecto directamente.

---

# FASE 1 — PRODUCT + DESIGN SYSTEM

Crear:

- identidad CodeGo!;
- logo textual;
- palette;
- typography;
- spacing;
- buttons;
- cards;
- forms;
- navigation;
- Byte;
- estados de Byte;
- animaciones;
- mapa;
- componentes educativos.

Crear mockups funcionales directamente en la aplicación.

Resultado:

Un sistema visual coherente.

---

# FASE 2 — FOUNDATION

Implementar:

- proyecto;
- TypeScript;
- routing;
- Tailwind;
- componentes;
- Supabase;
- environment variables;
- base architecture;
- lint;
- formatting;
- testing.

Resultado:

Proyecto limpio y ejecutable.

---

# FASE 3 — DATABASE + AUTH

Implementar:

- PostgreSQL;
- schema;
- migrations;
- seed;
- RLS;
- register;
- login;
- logout;
- Google OAuth;
- profile;
- protected routes.

Resultado:

Usuario real.

---

# FASE 4 — ONBOARDING + STUDENT HOME

Crear:

- onboarding;
- Byte welcome;
- dashboard;
- stats;
- XP;
- streak;
- Bytes;
- continue button.

Resultado:

Un usuario nuevo puede registrarse y comenzar.

---

# FASE 5 — CODE WORLD + COURSES

Implementar:

- mapa;
- mundos;
- Pythonia;
- cursos;
- unidades;
- locks/unlocks;
- progreso;
- navegación.

Resultado:

El usuario visualiza su viaje educativo.

---

# FASE 6 — EXERCISE ENGINE

Crear el motor de ejercicios.

Debe permitir:

```text
Multiple Choice
True/False
Complete
Predict
Order
Find Bug
Matching
```

No crear cada ejercicio como una pantalla independiente hardcodeada.

Crear:

```text
ExerciseRenderer
```

que determine cómo mostrar el ejercicio.

Resultado:

El CMS podrá crear distintos tipos.

---

# FASE 7 — CODE LAB

Implementar:

- editor;
- syntax highlighting;
- ejecutar;
- output;
- tests;
- feedback;
- reset;
- hints.

Primero:

```text
JavaScript
Python
HTML/CSS preview
```

Arquitectura preparada para otros lenguajes.

Resultado:

El estudiante puede programar realmente.

---

# FASE 8 — GAMIFICATION

Implementar:

- XP;
- level;
- Bytes;
- streak;
- achievements;
- rewards;
- leaderboard;
- level up;
- celebration animations.

Integrar Byte.

Resultado:

Aprendizaje convertido en progresión.

---

# FASE 9 — BYTE BEHAVIOR SYSTEM

Crear el motor de comportamiento.

Ejemplo:

```text
Event
  ↓
Byte Reaction
  ↓
Animation
  ↓
Message
```

Eventos:

```text
login
logout
first_visit
correct_answer
wrong_answer
lesson_complete
unit_complete
boss_complete
new_level
streak
absence
return
error
loading
```

Resultado:

Byte deja de ser una decoración y se convierte en parte real de la UX.

---

# FASE 10 — CMS

Construir:

```text
Admin Dashboard
Users
Worlds
Courses
Units
Lessons
Exercises
Hints
Achievements
Rewards
Statistics
```

Crear:

- CRUD;
- búsqueda;
- filtros;
- publicación;
- preview;
- permisos.

Resultado:

El profesor puede crear/modificar contenido desde el navegador.

---

# FASE 11 — REVIEW SYSTEM

Crear:

```text
Practice
Review
Weak Skills
Recommended Lessons
```

Reglas básicas:

```text
error frecuente
↓
concepto débil
↓
recomendación
```

Sin IA.

Resultado:

Sistema adaptativo inicial basado en reglas.

---

# FASE 12 — RESPONSIVE + ACCESSIBILITY

Revisar TODA la aplicación.

No solo CSS.

Revisar:

- navegación;
- formularios;
- ejercicios;
- Code Lab;
- mapa;
- CMS;
- tablas;
- modales;
- Byte;
- animaciones;
- accesibilidad.

Probar:

```text
mobile
tablet
desktop
```

Resultado:

Una experiencia realmente responsive.

---

# FASE 13 — QA

Ejecutar:

```text
unit tests
integration tests
E2E
accessibility checks
security review
performance review
responsive review
```

Corregir errores.

No pasar a despliegue con funcionalidad conocida rota.

---

# FASE 14 — DEPLOYMENT

Publicar:

```text
production
```

Configurar:

- environment variables;
- auth redirect;
- database;
- storage;
- HTTPS;
- favicon;
- metadata;
- error page;
- README de producción.

Crear URL de demostración.

---

# FASE 15 — DOCUMENTACIÓN UNIVERSITARIA

Generar documentación del proyecto:

```text
Problem
Justification
Objectives
Users
Personas
User Stories
Requirements
Architecture
Database
UX
Design System
Security
Testing
Deployment
Future Flutter Version
```

Crear también diagramas:

```text
Use Case
ER
Architecture
Navigation
User Flow
Deployment
```

---

# FASE 16 — FLUTTER / MOBILE

NO implementar hasta que la web esté estable.

Crear posteriormente:

```text
CodeGo Mobile
```

Flutter.

Reutilizar:

```text
Auth
API
Database
Progress
Courses
Exercises
XP
Byte
Achievements
```

Adaptar UX a móvil.

Nunca convertir la web en WebView.

Crear navegación móvil nativa.

---

# 68. WORKFLOW PARA AGENTES DE IA

El agente principal debe dividir el trabajo.

Roles sugeridos:

```text
Agent 1 — Research
Agent 2 — UX/UI
Agent 3 — Architecture
Agent 4 — Frontend
Agent 5 — Backend/Database
Agent 6 — Content
Agent 7 — Code Lab
Agent 8 — QA
Agent 9 — Security
Agent 10 — DevOps
```

No permitir que dos agentes modifiquen simultáneamente las mismas partes críticas sin coordinación.

Mantener una lista:

```text
TASKS.md
```

Cada tarea:

```text
[ ] pending
[x] completed
[!] blocked
```

---

# 69. REGLA DE AUTONOMÍA

No realizar preguntas innecesarias.

Cuando exista una decisión menor:

1. tomar una decisión razonable;
2. implementarla;
3. documentarla.

Preguntar únicamente cuando una decisión cambie significativamente la arquitectura o el producto.

---

# 70. REGLA DE CALIDAD

No aceptar:

```text
"esto se puede hacer después"
```

cuando la funcionalidad forma parte de la fase actual.

Todo botón importante debe funcionar.

Todo enlace debe funcionar.

Todo formulario debe validar.

Toda pantalla debe manejar loading/error/empty.

Todo dato importante debe persistir.

---

# 71. REGLA DE DISEÑO

Antes de implementar una pantalla:

```text
Purpose
User goal
Primary CTA
Secondary actions
Content hierarchy
Responsive behavior
States
Empty state
Error state
Loading state
Byte behavior
```

Después implementar.

---

# 72. REGLA DE ORIGINALIDAD

CodeGo! puede inspirarse en las mejores prácticas de productos educativos y proyectos open source.

Pero NO debe convertirse en:

```text
Duolingo con código
```

Debe convertirse en:

# CODEGO!

La experiencia debe tener identidad propia.

La diferencia principal debe estar en:

```text
Byte
+
Code World
+
Code Lab
+
microlearning
+
gamification
+
progression
+
programming challenges
```

---

# 73. DEFINITION OF DONE

Una fase solamente se considera completada cuando:

```text
✓ Código funcionando
✓ Tests relevantes
✓ Responsive
✓ Accesible razonablemente
✓ Sin errores evidentes en consola
✓ Sin secretos expuestos
✓ Datos persistentes
✓ Loading/Error/Empty states
✓ README actualizado
✓ Documentación actualizada
✓ Commit limpio
```

---

# 74. DEMO FINAL DEL MVP

La demo ideal debe permitir:

```text
Entrar a CodeGo!
       ↓
Registrar usuario
       ↓
Google Login
       ↓
Onboarding
       ↓
Conocer a Byte
       ↓
Entrar a Pythonia
       ↓
Comenzar primera lección
       ↓
Responder quiz
       ↓
Completar código
       ↓
Entrar al Code Lab
       ↓
Ejecutar código
       ↓
Pasar tests
       ↓
Ganar XP
       ↓
Obtener Bytes
       ↓
Desbloquear logro
       ↓
Ver mapa actualizado
       ↓
Cerrar sesión
       ↓
Volver a entrar
       ↓
Ver progreso preservado
```

Y desde el administrador:

```text
Entrar /admin
       ↓
Crear curso
       ↓
Crear unidad
       ↓
Crear lección
       ↓
Crear ejercicio
       ↓
Publicarlo
       ↓
Entrar como estudiante
       ↓
Verlo en Code World
```

Ese flujo debe funcionar realmente.

---

# 75. PRIORIDAD ABSOLUTA

Cuando existan conflictos entre características, priorizar en este orden:

```text
1. Funcionamiento
2. Seguridad
3. UX
4. Responsive
5. Accesibilidad
6. Arquitectura mantenible
7. Diseño visual
8. Animaciones
9. Extras
```

No sacrificar estabilidad por efectos visuales.

---

# 76. RESULTADO ESPERADO

Al terminar las fases iniciales debe existir una plataforma denominada:

# CODEGO!

con:

```text
🌐 Web responsive
🔐 Auth
👤 Usuarios
💾 Progreso persistente
🗺️ Mundos
📚 Cursos
🎯 Lecciones
🧩 Ejercicios
💻 Code Lab
🏆 Gamificación
🔥 Streak
💎 Bytes
🤖 Byte
👾 Boss Battles
🧠 Review
⚙️ CMS
📊 Estadísticas
🔒 Seguridad
🚀 Deployment
```

Sin IA obligatoria.

Sin pagos obligatorios.

Sin servicios premium obligatorios.

Preparada para agregar posteriormente:

```text
🤖 AI Tutor
📱 Flutter
☁️ Code Runner server-side
🌎 nuevos lenguajes
👥 sistema social
```

---

# 77. PRIMERA ACCIÓN DEL AGENTE

NO empieces escribiendo código inmediatamente.

Primero:

1. analiza este documento completo;
2. inspecciona los repositorios open source relevantes;
3. revisa sus licencias;
4. identifica qué ideas/técnicas son reutilizables;
5. genera `docs/research.md`;
6. genera `docs/architecture.md`;
7. genera `docs/product.md`;
8. genera el mapa inicial de navegación;
9. genera el modelo de datos;
10. crea el backlog dividido por fases.

Después comienza exclusivamente con:

# FASE 0

y continúa secuencialmente.

NO saltar directamente a Flutter.

NO implementar IA todavía.

NO implementar infraestructura paga.

NO utilizar assets o contenido con licencia desconocida.

La prioridad es construir primero una experiencia web excelente, funcional y demostrable.

# CODEGO!

> **Aprende. Crea. Evoluciona.**