-- ============================================
-- CodeGo! — Seed Data
-- ============================================

-- 1. Lenguajes
INSERT INTO languages (id, slug, name, icon_url, description, sort_order)
VALUES 
  ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'python', 'Python', '🐍', 'El lenguaje de la serpiente, perfecto para empezar.', 1),
  ('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'javascript', 'JavaScript', '⚡', 'El motor de la web interactiva.', 2)
ON CONFLICT (id) DO NOTHING;

-- 2. Mundos
INSERT INTO worlds (id, language_id, slug, name, description, tagline, color_primary, color_secondary, is_locked, sort_order)
VALUES 
  ('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'pythonia', 'Pythonia', 'Un bosque encantado donde las variables crecen en los árboles.', 'Tu primera aventura', '#22c55e', '#15803d', false, 1),
  ('d4e5f6a7-b8c9-0123-4567-890abcdef123', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'js-city', 'JS City', 'Una metrópolis cyberpunk impulsada por promesas asíncronas.', 'El núcleo del frontend', '#facc15', '#ca8a04', true, 2)
ON CONFLICT (id) DO NOTHING;

-- 3. Cursos
INSERT INTO courses (id, world_id, slug, title, description, xp_total, lesson_count, sort_order, status)
VALUES 
  ('e5f6a7b8-c9d0-1234-5678-90abcdef1234', 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'py-fundamentos', 'Fundamentos de Python', 'Aprende los conceptos básicos de Pythonia.', 500, 10, 1, 'published')
ON CONFLICT (id) DO NOTHING;

-- 4. Unidades
INSERT INTO units (id, course_id, title, description, icon, sort_order, xp_reward, status)
VALUES 
  ('f6a7b8c9-d0e1-2345-6789-0abcdef12345', 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', '1. Variables y Tipos', 'La esencia de los datos.', '📦', 1, 100, 'published'),
  ('0a1b2c3d-4e5f-6789-0123-456789abcdef', 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', '2. Condicionales', 'Caminos que se bifurcan.', '🔀', 2, 120, 'published')
ON CONFLICT (id) DO NOTHING;

-- 5. Lecciones
INSERT INTO lessons (id, unit_id, title, description, theory_content, sort_order, xp_reward, status)
VALUES 
  (
    '1b2c3d4e-5f6a-7890-1234-56789abcdef0', 
    'f6a7b8c9-d0e1-2345-6789-0abcdef12345', 
    '¿Qué es una variable?', 
    'Aprende a guardar información.', 
    '### ¡Bienvenido a Pythonia! 🐍

En el mundo de la programación, constantemente necesitamos recordar información. Piensa en una **variable** como si fuera una caja con una etiqueta donde puedes guardar cosas.

Por ejemplo, si tienes un perro llamado "Firulais", puedes crear una caja etiquetada `nombre_perro` y meter "Firulais" dentro.

### ¿Cómo se crean en Python?

En Python, crear variables es súper fácil. Solo necesitas:
1. El **nombre** que quieres darle a la caja (ej: `mensaje`)
2. El signo de igual `=` (que significa "guarda esto dentro de la caja")
3. El **contenido** (ej: `"Hola Mundo"`)

```python
# Así guardamos texto en una variable
mensaje = "Hola Mundo"
```

### Usando la función print()

Guardar cosas está genial, pero ¿qué pasa si queremos verlas en la pantalla? Para eso usamos `print()`. 

```python
nombre = "Byte"
print(nombre) 
# Esto mostrará: Byte
```

**💡 Caso de uso:**
Usamos variables en TODO. En un videojuego, el `puntaje = 100` es una variable. En una tienda, el `precio = 9.99` es una variable. 

¡Inténtalo tú mismo en el siguiente reto!',
    1, 30, 'published'
  ),
  (
    '2c3d4e5f-6a7b-8901-2345-6789abcdef01', 
    'f6a7b8c9-d0e1-2345-6789-0abcdef12345', 
    'Números y Textos', 
    'Tipos de datos básicos.', 
    '### Los sabores de los datos 🍦

No toda la información es igual. En Python, hay diferentes "tipos" de datos. Hoy conoceremos dos fundamentales: **Strings** (Textos) y **Integers** (Números enteros).

#### 1. Strings (Cadenas de texto)
Son cualquier cosa escrita entre comillas (dobles `" "` o simples `''`).
```python
nombre = "CodeGo"
color = ''cyan''
numero_falso = "123" # ¡Ojo! Como tiene comillas, Python lo ve como texto, no como un número de verdad.
```

#### 2. Integers (Números Enteros)
Son números sin decimales. Se escriben **SIN** comillas.
```python
vidas = 3
puntos = 1500
```

### Operaciones mágicas ✨
Lo genial de los números es que puedes hacer matemáticas reales con ellos.

```python
vidas = 3
vidas_extra = 2
total_vidas = vidas + vidas_extra
print(total_vidas) # Mostrará: 5
```

**💡 Caso de uso:**
¿Quieres calcular cuánto le falta al jugador para subir de nivel? Restas el XP actual del XP necesario. Todo en el código depende de mezclar estos ingredientes. ¡Vamos al laboratorio!',
    2, 40, 'published'
  )
ON CONFLICT (id) DO UPDATE SET theory_content = EXCLUDED.theory_content;

-- 6. Ejercicios (de prueba)
INSERT INTO exercises (id, lesson_id, type, instructions, starter_code, language, xp_reward, sort_order, status)
VALUES 
  (
    '3d4e5f6a-7b8c-9012-3456-789abcdef012', 
    '1b2c3d4e-5f6a-7890-1234-56789abcdef0', 
    'code_lab', 
    'Crea una variable llamada "mensaje" con el texto "Hola Pythonia" y usa print() para mostrarla.', 
    '', 
    'python', 20, 1, 'published'
  ),
  (
    '4d5e6f7a-8b9c-0123-4567-89abcdef0123', 
    '2c3d4e5f-6a7b-8901-2345-6789abcdef01', 
    'code_lab', 
    'Calculando puntos: Crea la variable "puntos_base" con valor 100, "bonus" con 50. Luego, en "total", suma ambas. Finalmente usa print(total).', 
    E'# 1. Crea la variable puntos_base\n\n# 2. Crea la variable bonus\n\n# 3. Suma ambas en la variable total\n\n# 4. Imprime el total', 
    'python', 30, 1, 'published'
  )
ON CONFLICT (id) DO UPDATE SET starter_code = EXCLUDED.starter_code;

-- Tests del ejercicio 1
INSERT INTO exercise_tests (exercise_id, description, expected_output, is_hidden, sort_order)
VALUES 
  ('3d4e5f6a-7b8c-9012-3456-789abcdef012', 'Debe imprimir "Hola Pythonia"', 'Hola Pythonia', false, 1)
ON CONFLICT (id) DO NOTHING;

-- Tests del ejercicio 2
INSERT INTO exercise_tests (exercise_id, description, expected_output, is_hidden, sort_order)
VALUES 
  ('4d5e6f7a-8b9c-0123-4567-89abcdef0123', 'Debe imprimir 150', '150', false, 1)
ON CONFLICT (id) DO NOTHING;

-- 7. Logros
INSERT INTO achievements (id, slug, name, description, icon, condition_type, condition_value, xp_reward, rarity)
VALUES 
  ('4e5f6a7b-8c9d-0123-4567-89abcdef0123', 'primer-paso', 'Primer Paso', 'Completa tu primera lección.', '🏆', 'lesson_complete', 1, 50, 'common'),
  ('5f6a7b8c-9d0e-1234-5678-9abcdef01234', 'racha-fuego', 'Semana de Fuego', 'Mantén una racha de 7 días seguidos.', '🔥', 'streak', 7, 200, 'rare')
ON CONFLICT (id) DO NOTHING;
