-- 00005_seed_notifications.sql
-- Inyecta notificaciones iniciales para los usuarios existentes

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM profiles LOOP
    INSERT INTO notifications (user_id, type, title, message)
    VALUES 
      (rec.id, 'system', '¡Bienvenido a CodeGo!', 'Nos emociona verte por aquí. Empieza tu viaje explorando Pythonia.'),
      (rec.id, 'reminder', '¡No pierdas tu racha!', 'Recuerda completar al menos una lección hoy para mantener tu racha en llamas 🔥.');
  END LOOP;
END;
$$;
