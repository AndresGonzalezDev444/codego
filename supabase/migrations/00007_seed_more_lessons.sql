-- 00007_seed_more_lessons.sql
-- Añade más lecciones a la Unidad 1 (Fundamentos) y Unidad 2 (Tipos de Datos) en Pythonia

DO $$
DECLARE
  v_world_id uuid;
  v_course_id uuid;
  v_unit1_id uuid;
  v_unit2_id uuid;
  
  -- IDs para Unidad 1 -> Lección 3
  v_lesson3_u1_id uuid := gen_random_uuid();
  v_l3_u1_ex1_id uuid := gen_random_uuid();
  v_l3_u1_ex2_id uuid := gen_random_uuid();
  
  -- IDs para Unidad 2 -> Lección 2
  v_lesson2_u2_id uuid := gen_random_uuid();
  v_l2_u2_ex1_id uuid := gen_random_uuid();
  v_l2_u2_ex2_id uuid := gen_random_uuid();
BEGIN
  -- Obtener IDs
  SELECT id INTO v_world_id FROM worlds WHERE slug = 'pythonia' LIMIT 1;
  SELECT id INTO v_course_id FROM courses WHERE world_id = v_world_id LIMIT 1;
  
  -- Obtener Unidad 1 (1. Variables y Tipos) y Unidad 2 (Tipos de Datos)
  SELECT id INTO v_unit1_id FROM units WHERE course_id = v_course_id AND title = '1. Variables y Tipos' LIMIT 1;
  SELECT id INTO v_unit2_id FROM units WHERE course_id = v_course_id AND title = 'Tipos de Datos' LIMIT 1;

  IF v_unit1_id IS NULL OR v_unit2_id IS NULL THEN
    RAISE NOTICE 'Unidades no encontradas. Asegúrate de haber corrido los scripts anteriores.';
    RETURN;
  END IF;

  -- ==========================================
  -- MÁS CONTENIDO PARA UNIDAD 1: FUNDAMENTOS
  -- ==========================================
  
  -- Lección 3: Operadores Matemáticos
  INSERT INTO lessons (id, unit_id, title, description, theory_content, sort_order, xp_reward, bytes_reward, estimated_minutes, status)
  VALUES (
    v_lesson3_u1_id, 
    v_unit1_id, 
    'Operadores Matemáticos', 
    'Aprende a sumar, restar, multiplicar y dividir.', 
    '## Matemáticas en Python
Python es una excelente calculadora. Puedes usar operadores matemáticos básicos:
- **Suma (`+`)**: `5 + 3`
- **Resta (`-`)**: `10 - 2`
- **Multiplicación (`*`)**: `4 * 2`
- **División (`/`)**: `16 / 2`

¡Pruébalos en los siguientes retos!', 
    3, 
    50, 
    10, 
    5, 
    'published'
  );

  -- Ejercicio 1 (Predict Output)
  INSERT INTO exercises (id, lesson_id, type, instructions, code_snippet, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_l3_u1_ex1_id, v_lesson3_u1_id, 'predict_output', 
    '¿Qué imprimirá el siguiente código?', 
    'print(5 * 2)', 
    'easy', 15, 2, 1, 'published'
  );
  INSERT INTO exercise_tests (exercise_id, expected_output, is_hidden, sort_order)
  VALUES (v_l3_u1_ex1_id, '10', false, 1);

  -- Ejercicio 2 (Code Lab)
  INSERT INTO exercises (id, lesson_id, type, instructions, starter_code, language, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_l3_u1_ex2_id, v_lesson3_u1_id, 'code_lab', 
    'Calcula el área de un rectángulo de 5 de ancho y 10 de alto. Imprime el resultado.', 
    'ancho = 5
alto = 10
# Escribe el cálculo y el print abajo
', 
    'python', 'medium', 25, 5, 2, 'published'
  );
  INSERT INTO exercise_tests (exercise_id, expected_output, is_hidden, sort_order)
  VALUES (v_l3_u1_ex2_id, '50', false, 1);

  -- ==========================================
  -- MÁS CONTENIDO PARA UNIDAD 2: TIPOS DE DATOS
  -- ==========================================
  
  -- Lección 2: Conversión de Tipos
  INSERT INTO lessons (id, unit_id, title, description, theory_content, sort_order, xp_reward, bytes_reward, estimated_minutes, status)
  VALUES (
    v_lesson2_u2_id, 
    v_unit2_id, 
    'Conversión de Tipos', 
    'Aprende a transformar strings a números y viceversa.', 
    '## Casting en Python
A veces necesitas convertir un tipo de dato en otro. Por ejemplo, si tienes un número guardado como texto `"10"`, no puedes sumarle `5` directamente.
Para eso usamos las funciones de conversión:
- `int("10")` convierte el texto en el entero `10`.
- `str(42)` convierte el número en el texto `"42"`.
- `bool(1)` convierte a `True`.', 
    2, 
    60, 
    15, 
    5, 
    'published'
  );

  -- Ejercicio 1 (Multiple Choice)
  INSERT INTO exercises (id, lesson_id, type, instructions, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_l2_u2_ex1_id, v_lesson2_u2_id, 'multiple_choice', 
    '¿Qué devuelve la función `str(100)`?', 
    'easy', 15, 3, 1, 'published'
  );
  INSERT INTO exercise_options (exercise_id, content, is_correct, sort_order)
  VALUES 
    (v_l2_u2_ex1_id, 'El número entero 100', false, 1),
    (v_l2_u2_ex1_id, 'El texto "100"', true, 2),
    (v_l2_u2_ex1_id, 'True', false, 3);

  -- Ejercicio 2 (Code Lab)
  INSERT INTO exercises (id, lesson_id, type, instructions, starter_code, language, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_l2_u2_ex2_id, v_lesson2_u2_id, 'code_lab', 
    'Convierte el texto "50" en número, súmale 20 e imprime el resultado.', 
    'texto = "50"
# Convierte texto a entero, súmale 20 e imprime
', 
    'python', 'medium', 30, 8, 2, 'published'
  );
  INSERT INTO exercise_tests (exercise_id, expected_output, is_hidden, sort_order)
  VALUES (v_l2_u2_ex2_id, '70', false, 1);

END;
$$;
