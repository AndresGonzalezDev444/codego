-- 00004_seed_achievements.sql
-- Seed data para los logros iniciales de CodeGo!

INSERT INTO achievements (slug, name, description, icon, condition_type, condition_value, xp_reward, bytes_reward, rarity)
VALUES
  ('first_lesson', 'Primeros Pasos', 'Completa tu primera lección en cualquier mundo.', '🌱', 'lessons_completed', 1, 50, 10, 'common'),
  ('five_lessons', 'Estudiante Dedicado', 'Completa 5 lecciones.', '📚', 'lessons_completed', 5, 100, 20, 'common'),
  ('streak_3', 'Chispa Inicial', 'Mantén una racha de 3 días seguidos.', '🔥', 'streak_days', 3, 100, 25, 'rare'),
  ('streak_7', 'En Llamas', 'Mantén una racha de 7 días ininterrumpidos.', '🌋', 'streak_days', 7, 300, 50, 'epic'),
  ('level_5', 'Aprendiz Avanzado', 'Alcanza el nivel 5 de programador.', '⭐', 'level_reached', 5, 200, 30, 'rare'),
  ('level_10', 'Maestro del Código', 'Alcanza el nivel 10. ¡Eres imparable!', '👑', 'level_reached', 10, 500, 100, 'legendary')
ON CONFLICT (slug) DO NOTHING;
