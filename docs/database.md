# CodeGo! — Modelo de Base de Datos

## Schema PostgreSQL

### profiles
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id)
username    text UNIQUE NOT NULL
display_name text
avatar_url  text
bio         text
role        text DEFAULT 'student' CHECK (role IN ('guest','student','admin','instructor','editor'))
xp          integer DEFAULT 0
level       integer DEFAULT 1
bytes       integer DEFAULT 0
streak_days integer DEFAULT 0
last_active_at timestamptz
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### languages
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug        text UNIQUE NOT NULL  -- 'python', 'javascript', 'java'
name        text NOT NULL
icon_url    text
description text
is_active   boolean DEFAULT true
sort_order  integer DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### worlds
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
language_id uuid REFERENCES languages(id)
slug        text UNIQUE NOT NULL  -- 'pythonia', 'javascript-city'
name        text NOT NULL
description text
tagline     text
image_url   text
color_primary text   -- hex color para identidad del mundo
color_secondary text
is_locked   boolean DEFAULT true
is_active   boolean DEFAULT true
sort_order  integer DEFAULT 0
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### courses
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
world_id    uuid REFERENCES worlds(id)
slug        text UNIQUE NOT NULL
title       text NOT NULL
description text
image_url   text
xp_total    integer DEFAULT 0
lesson_count integer DEFAULT 0
sort_order  integer DEFAULT 0
status      text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived'))
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### units
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
course_id   uuid REFERENCES courses(id)
title       text NOT NULL
description text
icon        text   -- emoji o nombre de icono
sort_order  integer DEFAULT 0
xp_reward   integer DEFAULT 50
is_boss_battle boolean DEFAULT false
status      text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived'))
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### lessons
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
unit_id     uuid REFERENCES units(id)
title       text NOT NULL
description text
theory_content text  -- markdown/html de la micro-lección
sort_order  integer DEFAULT 0
xp_reward   integer DEFAULT 20
bytes_reward integer DEFAULT 5
estimated_minutes integer DEFAULT 5
status      text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived'))
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### exercises
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
lesson_id   uuid REFERENCES lessons(id)
type        text NOT NULL CHECK (type IN ('multiple_choice','true_false','complete_code','predict_output','order_code','find_bug','matching','code_lab','challenge'))
title       text
instructions text NOT NULL
code_snippet text    -- código de referencia si aplica
starter_code text    -- código inicial para code_lab
language    text     -- 'python', 'javascript', 'html'
difficulty  text DEFAULT 'easy' CHECK (difficulty IN ('easy','medium','hard','boss'))
xp_reward   integer DEFAULT 10
bytes_reward integer DEFAULT 2
sort_order  integer DEFAULT 0
status      text DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived'))
created_at  timestamptz DEFAULT now()
updated_at  timestamptz DEFAULT now()
```

### exercise_options
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
exercise_id uuid REFERENCES exercises(id)
content     text NOT NULL
is_correct  boolean DEFAULT false
explanation text
sort_order  integer DEFAULT 0
```

### exercise_tests
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
exercise_id uuid REFERENCES exercises(id)
description text
input_data  jsonb
expected_output text
is_hidden   boolean DEFAULT false
sort_order  integer DEFAULT 0
```

### hints
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
exercise_id uuid REFERENCES exercises(id)
content     text NOT NULL
level       integer DEFAULT 1  -- 1=sutil, 2=orientación, 3=casi-solución
sort_order  integer DEFAULT 0
```

### user_progress
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id        uuid REFERENCES profiles(id)
lesson_id      uuid REFERENCES lessons(id)
status         text DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed'))
score          integer DEFAULT 0
completed_at   timestamptz
last_attempt_at timestamptz
attempts_count integer DEFAULT 0
created_at     timestamptz DEFAULT now()
updated_at     timestamptz DEFAULT now()
UNIQUE(user_id, lesson_id)
```

### exercise_attempts
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES profiles(id)
exercise_id uuid REFERENCES exercises(id)
user_answer jsonb
is_correct  boolean
xp_earned   integer DEFAULT 0
bytes_earned integer DEFAULT 0
hints_used  integer DEFAULT 0
time_spent_seconds integer DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### xp_events
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES profiles(id)
event_type  text NOT NULL  -- 'exercise_complete','lesson_complete','unit_complete','streak','achievement'
xp_amount   integer NOT NULL
reference_id uuid   -- id del recurso relacionado
metadata    jsonb
created_at  timestamptz DEFAULT now()
```

### streaks
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id         uuid REFERENCES profiles(id) UNIQUE
current_streak  integer DEFAULT 0
longest_streak  integer DEFAULT 0
last_activity_date date
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### achievements
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug        text UNIQUE NOT NULL
name        text NOT NULL
description text NOT NULL
icon        text NOT NULL   -- emoji o URL
condition_type text NOT NULL  -- 'xp_total','lesson_count','streak','exercise_count', etc.
condition_value integer NOT NULL
xp_reward   integer DEFAULT 0
bytes_reward integer DEFAULT 10
rarity      text DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary'))
is_active   boolean DEFAULT true
created_at  timestamptz DEFAULT now()
```

### user_achievements
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id        uuid REFERENCES profiles(id)
achievement_id uuid REFERENCES achievements(id)
unlocked_at    timestamptz DEFAULT now()
UNIQUE(user_id, achievement_id)
```

### leaderboard (vista materializada actualizable)
```sql
-- Vista basada en profiles.xp
-- Se actualiza mediante trigger en xp_events
user_id     uuid
username    text
display_name text
avatar_url  text
xp          integer
level       integer
rank        integer  -- calculado
```

### notifications
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES profiles(id)
type        text NOT NULL  -- 'achievement','level_up','lesson_available','streak_reminder'
title       text NOT NULL
message     text
is_read     boolean DEFAULT false
metadata    jsonb
created_at  timestamptz DEFAULT now()
```

## Índices Principales

```sql
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_exercise_attempts_user ON exercise_attempts(user_id);
CREATE INDEX idx_exercise_attempts_exercise ON exercise_attempts(exercise_id);
CREATE INDEX idx_xp_events_user ON xp_events(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_exercises_lesson ON exercises(lesson_id, sort_order);
CREATE INDEX idx_lessons_unit ON lessons(unit_id, sort_order);
CREATE INDEX idx_units_course ON units(course_id, sort_order);
CREATE INDEX idx_courses_world ON courses(world_id, sort_order);
```

## Triggers

- `update_updated_at` — Actualizar `updated_at` en cada UPDATE
- `update_profile_xp` — Actualizar `profiles.xp` y `profiles.level` al insertar en `xp_events`
- `update_streak` — Actualizar streak al completar lección
- `check_achievements` — Verificar y desbloquear logros automáticamente
