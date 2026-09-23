-- 00006_seed_content.sql
-- Añade una nueva unidad y lección con variedad de ejercicios a Pythonia

DO $$
DECLARE
  v_world_id uuid;
  v_course_id uuid;
  v_unit_id uuid := gen_random_uuid();
  v_lesson_id uuid := gen_random_uuid();
  v_ex1_id uuid := gen_random_uuid();
  v_ex2_id uuid := gen_random_uuid();
  v_ex3_id uuid := gen_random_uuid();
BEGIN
  -- Obtener IDs de Pythonia y su curso principal
  SELECT id INTO v_world_id FROM worlds WHERE slug = 'pythonia' LIMIT 1;
  SELECT id INTO v_course_id FROM courses WHERE world_id = v_world_id LIMIT 1;

  IF v_course_id IS NULL THEN
    RAISE NOTICE 'Pythonia o su curso no encontrado.';
    RETURN;
  END IF;

  -- 1. Insertar nueva Unidad: Variables y Tipos
  INSERT INTO units (id, course_id, title, description, icon, sort_order, xp_reward, is_boss_battle, status)
  VALUES (
    v_unit_id, 
    v_course_id, 
    'Tipos de Datos', 
    'Aprende sobre Strings, Integers y Booleans.', 
    '📝', 
    2, -- Segunda unidad
    150, 
    false, 
    'published'
  );

  -- 2. Insertar Lección: Conociendo los Datos
  INSERT INTO lessons (id, unit_id, title, description, theory_content, sort_order, xp_reward, bytes_reward, estimated_minutes, status)
  VALUES (
    v_lesson_id, 
    v_unit_id, 
    'Conociendo los Datos', 
    '¿Qué tipos de datos maneja Python?', 
    '## Tipos de Datos en Python
En programación, la información se clasifica en tipos. En Python los más comunes son:
- **String (`str`)**: Cadenas de texto. Ej: `"Hola"`.
- **Integer (`int`)**: Números enteros. Ej: `42`.
- **Boolean (`bool`)**: Verdadero o falso. Ej: `True` o `False`.

Podemos usar la función `type()` para descubrir qué tipo de dato es un valor.', 
    1, 
    50, 
    10, 
    5, 
    'published'
  );

  -- 3. Insertar Ejercicio 1 (Multiple Choice)
  INSERT INTO exercises (id, lesson_id, type, instructions, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_ex1_id, 
    v_lesson_id, 
    'multiple_choice', 
    '¿Qué tipo de dato es `True` en Python?', 
    'easy', 
    10, 
    2, 
    1, 
    'published'
  );

  -- Opciones para el Ejercicio 1
  INSERT INTO exercise_options (exercise_id, content, is_correct, sort_order)
  VALUES 
    (v_ex1_id, 'String (str)', false, 1),
    (v_ex1_id, 'Boolean (bool)', true, 2),
    (v_ex1_id, 'Integer (int)', false, 3);

  -- 4. Insertar Ejercicio 2 (Predict Output)
  INSERT INTO exercises (id, lesson_id, type, instructions, code_snippet, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_ex2_id, 
    v_lesson_id, 
    'predict_output', 
    '¿Qué imprime el siguiente código?', 
    'print("1" + "1")', 
    'medium', 
    20, 
    5, 
    2, 
    'published'
  );

  -- Tests para el Ejercicio 2 (Usado para validar el text input)
  INSERT INTO exercise_tests (exercise_id, expected_output, is_hidden, sort_order)
  VALUES (v_ex2_id, '11', false, 1);

  -- 5. Insertar Ejercicio 3 (Code Lab)
  INSERT INTO exercises (id, lesson_id, type, instructions, starter_code, language, difficulty, xp_reward, bytes_reward, sort_order, status)
  VALUES (
    v_ex3_id, 
    v_lesson_id, 
    'code_lab', 
    'Imprime el tipo de dato del número 42.', 
    '# Usa print() y type() aquí
', 
    'python', 
    'easy', 
    20, 
    5, 
    3, 
    'published'
  );

  -- Tests para el Ejercicio 3
  INSERT INTO exercise_tests (exercise_id, expected_output, is_hidden, sort_order)
  VALUES (v_ex3_id, '<class ''int''>', false, 1);

END;
$$;
