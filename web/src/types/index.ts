// ============================================
// CODEGO! — TIPOS GLOBALES TypeScript
// ============================================

// --- AUTH ---
export type UserRole = 'guest' | 'student' | 'admin' | 'instructor' | 'editor';

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  role: UserRole;
  xp: number;
  level: number;
  bytes: number;
  hearts: number;
  last_heart_regen_at?: string;
  is_plus?: boolean;
  streak_days: number;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
}

// --- CONTENIDO ---
export interface Language {
  id: string;
  slug: string;
  name: string;
  icon_url?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

export interface World {
  id: string;
  language_id: string;
  slug: string;
  name: string;
  description?: string;
  tagline?: string;
  image_url?: string;
  color_primary: string;
  color_secondary: string;
  is_locked: boolean;
  is_active: boolean;
  sort_order: number;
  language?: Language;
  courses?: Course[];
}

export interface Course {
  id: string;
  world_id: string;
  slug: string;
  title: string;
  description?: string;
  image_url?: string;
  xp_total: number;
  lesson_count: number;
  sort_order: number;
  status: ContentStatus;
  world?: World;
  units?: Unit[];
}

export interface Unit {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  icon?: string;
  sort_order: number;
  xp_reward: number;
  is_boss_battle: boolean;
  status: ContentStatus;
  course?: Course;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  description?: string;
  theory_content?: string;
  sort_order: number;
  xp_reward: number;
  bytes_reward: number;
  estimated_minutes: number;
  status: ContentStatus;
  unit?: Unit;
  exercises?: Exercise[];
}

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

// --- EJERCICIOS ---
export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'complete_code'
  | 'predict_output'
  | 'order_code'
  | 'find_bug'
  | 'matching'
  | 'code_lab'
  | 'challenge';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'boss';
export type ProgrammingLanguage = 'python' | 'javascript' | 'html' | 'css';

export interface Exercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  title?: string;
  instructions: string;
  code_snippet?: string;
  starter_code?: string;
  language?: ProgrammingLanguage;
  difficulty: Difficulty;
  xp_reward: number;
  bytes_reward: number;
  sort_order: number;
  status: ContentStatus;
  options?: ExerciseOption[];
  tests?: ExerciseTest[];
  hints?: Hint[];
}

export interface ExerciseOption {
  id: string;
  exercise_id: string;
  content: string;
  is_correct: boolean;
  explanation?: string;
  sort_order: number;
}

export interface ExerciseTest {
  id: string;
  exercise_id: string;
  description?: string;
  input_data?: unknown;
  expected_output: string;
  is_hidden: boolean;
  sort_order: number;
}

export interface Hint {
  id: string;
  exercise_id: string;
  content: string;
  level: 1 | 2 | 3;
  sort_order: number;
}

// --- PROGRESO ---
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: ProgressStatus;
  score: number;
  completed_at?: string;
  last_attempt_at?: string;
  attempts_count: number;
}

export interface ExerciseAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  user_answer: unknown;
  is_correct: boolean;
  xp_earned: number;
  bytes_earned: number;
  hints_used: number;
  time_spent_seconds: number;
  created_at: string;
}

export interface XpEvent {
  id: string;
  user_id: string;
  event_type: XpEventType;
  xp_amount: number;
  reference_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type XpEventType =
  | 'exercise_complete'
  | 'lesson_complete'
  | 'unit_complete'
  | 'streak'
  | 'achievement'
  | 'welcome_bonus';

// --- GAMIFICACIÓN ---
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
  xp_reward: number;
  bytes_reward: number;
  rarity: AchievementRarity;
  is_active: boolean;
  unlocked_at?: string; // si está en user_achievements
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  xp: number;
  level: number;
  rank: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export type NotificationType =
  | 'achievement'
  | 'level_up'
  | 'lesson_available'
  | 'streak_reminder'
  | 'return_reminder'
  | 'system'
  | 'reminder';

// --- BYTE ---
export type ByteMood =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'thinking'
  | 'confused'
  | 'excited'
  | 'celebrating'
  | 'angry'
  | 'sleeping'
  | 'tired'
  | 'encouraging'
  | 'proud'
  | 'surprised'
  | 'error'
  | 'welcome'
  | 'explorer';

export type ByteSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ByteMessage {
  mood: ByteMood;
  text: string;
}

// --- CODE RUNNER ---
export interface ExecutionRequest {
  language: ProgrammingLanguage;
  code: string;
  tests?: ExerciseTest[];
  timeout?: number;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  tests_passed?: number;
  tests_total?: number;
  test_results?: TestResult[];
  execution_time?: number;
}

export interface TestResult {
  description?: string;
  passed: boolean;
  expected: string;
  received: string;
}

// --- UI ---
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  component: React.ComponentType;
  props?: Record<string, unknown>;
}
