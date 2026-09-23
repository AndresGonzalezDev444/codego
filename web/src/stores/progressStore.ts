import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Achievement, Streak } from '@/types';

interface ProgressState {
  xp: number;
  level: number;
  bytes: number;
  streak: Streak;
  achievements: Achievement[];
  completedLessons: string[];
  lastActivity: string | null;

  // Actions
  addXP: (amount: number) => void;
  addBytes: (amount: number) => void;
  setLevel: (level: number) => void;
  setStreak: (streak: Streak) => void;
  addAchievement: (achievement: Achievement) => void;
  markLessonComplete: (lessonId: string) => void;
  setLastActivity: (date: string) => void;
  hydrate: (data: Partial<ProgressState>) => void;
  reset: () => void;
}

// Cálculo de nivel basado en XP
export function xpToLevel(xp: number): number {
  // Curva cuadrática: level = floor(1 + sqrt(xp / 50))
  return Math.floor(1 + Math.sqrt(xp / 50));
}

export function levelToXP(level: number): number {
  return Math.pow(level - 1, 2) * 50;
}

const initialStreak: Streak = {
  current_streak: 0,
  longest_streak: 0,
  last_activity_date: undefined,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      bytes: 0,
      streak: initialStreak,
      achievements: [],
      completedLessons: [],
      lastActivity: null,

      addXP: (amount) =>
        set((s) => {
          const newXP = s.xp + amount;
          const newLevel = xpToLevel(newXP);
          return { xp: newXP, level: newLevel };
        }),

      addBytes: (amount) => set((s) => ({ bytes: s.bytes + amount })),

      setLevel: (level) => set({ level }),

      setStreak: (streak) => set({ streak }),

      addAchievement: (achievement) =>
        set((s) => {
          if (s.achievements.find((a) => a.id === achievement.id)) return s;
          return { achievements: [...s.achievements, achievement] };
        }),

      markLessonComplete: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),

      setLastActivity: (date) => set({ lastActivity: date }),

      hydrate: (data) => set((s) => ({ ...s, ...data })),

      reset: () =>
        set({
          xp: 0,
          level: 1,
          bytes: 0,
          streak: initialStreak,
          achievements: [],
          completedLessons: [],
          lastActivity: null,
        }),
    }),
    {
      name: 'codego-progress',
    }
  )
);
