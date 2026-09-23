-- ============================================
-- CodeGo! — Initial Schema Migration
-- ============================================

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLAS CORE Y AUTH
-- ============================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  bio text,
  role text DEFAULT 'student' CHECK (role IN ('guest','student','admin','instructor','editor')),
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  bytes integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_active_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. JERARQUÍA DE CONTENIDO
-- ============================================

CREATE TABLE languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  icon_url text,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_id uuid REFERENCES languages(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  tagline text,
  image_url text,
  color_primary text,
  color_secondary text,
  is_locked boolean DEFAULT true,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  xp_total integer DEFAULT 0,
  lesson_count integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0,
  xp_reward integer DEFAULT 50,
  is_boss_battle boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES units(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  theory_content text,
  sort_order integer DEFAULT 0,
  xp_reward integer DEFAULT 20,
  bytes_reward integer DEFAULT 5,
  estimated_minutes integer DEFAULT 5,
  status text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('multiple_choice','true_false','complete_code','predict_output','order_code','find_bug','matching','code_lab','challenge')),
  title text,
  instructions text NOT NULL,
  code_snippet text,
  starter_code text,
  language text,
  difficulty text DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard','boss')),
  xp_reward integer DEFAULT 10,
  bytes_reward integer DEFAULT 2,
  sort_order integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE exercise_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_correct boolean DEFAULT false,
  explanation text,
  sort_order integer DEFAULT 0
);

CREATE TABLE exercise_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  description text,
  input_data jsonb,
  expected_output text,
  is_hidden boolean DEFAULT false,
  sort_order integer DEFAULT 0
);

CREATE TABLE hints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  content text NOT NULL,
  level integer DEFAULT 1,
  sort_order integer DEFAULT 0
);

-- ============================================
-- 3. PROGRESO Y ACTIVIDAD
-- ============================================

CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  score integer DEFAULT 0,
  completed_at timestamptz,
  last_attempt_at timestamptz,
  attempts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE exercise_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  user_answer jsonb,
  is_correct boolean,
  xp_earned integer DEFAULT 0,
  bytes_earned integer DEFAULT 0,
  hints_used integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  xp_amount integer NOT NULL,
  reference_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. GAMIFICACIÓN Y NOTIFICACIONES
-- ============================================

CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  condition_type text NOT NULL,
  condition_value integer NOT NULL,
  xp_reward integer DEFAULT 0,
  bytes_reward integer DEFAULT 10,
  rarity text DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. TRIGGERS Y FUNCIONES
-- ============================================

-- Crear un perfil automáticamente tras el signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 6)),
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- Inicializar streak
  INSERT INTO public.streaks (user_id) VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Actualizar XP global al insertar en xp_events
CREATE OR REPLACE FUNCTION public.update_profile_xp()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET xp = xp + NEW.xp_amount,
      level = floor(1 + sqrt((xp + NEW.xp_amount) / 50.0))::integer
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_xp_event_inserted
  AFTER INSERT ON public.xp_events
  FOR EACH ROW EXECUTE PROCEDURE public.update_profile_xp();

-- Función para updated_at automático
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_worlds_updated_at BEFORE UPDATE ON worlds FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_exercises_updated_at BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_streaks_updated_at BEFORE UPDATE ON streaks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================
-- 6. RLS (ROW LEVEL SECURITY)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura (Contenido)
CREATE POLICY "Public read for languages" ON languages FOR SELECT USING (true);
CREATE POLICY "Public read for worlds" ON worlds FOR SELECT USING (true);
CREATE POLICY "Public read for courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read for units" ON units FOR SELECT USING (true);
CREATE POLICY "Public read for lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Public read for exercises" ON exercises FOR SELECT USING (true);
CREATE POLICY "Public read for exercise_options" ON exercise_options FOR SELECT USING (true);
CREATE POLICY "Public read for exercise_tests" ON exercise_tests FOR SELECT USING (true);
CREATE POLICY "Public read for hints" ON hints FOR SELECT USING (true);
CREATE POLICY "Public read for achievements" ON achievements FOR SELECT USING (true);

-- Políticas de lectura públicas para perfiles
CREATE POLICY "Public read for profiles" ON profiles FOR SELECT USING (true);

-- Políticas de actualización propia
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own attempts" ON exercise_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON exercise_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own xp events" ON xp_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp events" ON xp_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own streak" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON streaks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_user ON exercise_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_attempts_exercise ON exercise_attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_user ON xp_events(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson ON exercises(lesson_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_units_course ON units(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_courses_world ON courses(world_id, sort_order);
