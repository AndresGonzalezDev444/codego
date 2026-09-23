import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  updateHearts: (delta: number, newRegenTime?: string) => void;
  upgradeToPlus: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      session: null,
      loading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      updateHearts: (delta, newRegenTime) => set((state) => {
        if (!state.profile) return state;
        const newHearts = Math.max(0, Math.min(5, (state.profile.hearts || 0) + delta));
        return { 
          profile: { 
            ...state.profile, 
            hearts: newHearts,
            last_heart_regen_at: newRegenTime !== undefined ? newRegenTime : state.profile.last_heart_regen_at 
          } 
        };
      }),
      upgradeToPlus: () => set((state) => {
        if (!state.profile) return state;
        return { profile: { ...state.profile, is_plus: true, hearts: 5 } };
      }),
      reset: () => set({ user: null, profile: null, session: null, loading: false }),
    }),
    {
      name: 'codego-auth',
      partialize: (state) => ({ session: state.session }),
    }
  )
);
