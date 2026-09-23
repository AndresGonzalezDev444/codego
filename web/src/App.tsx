import { useEffect } from 'react';
import { AppRouter } from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { useUIStore } from '@/stores/uiStore';
import { progressService } from '@/services/progressService';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export default function App() {
  const { setUser, setProfile, setSession, setLoading } = useAuthStore();
  const { hydrate, reset: resetProgress } = useProgressStore();
  const { theme } = useUIStore();

  // Aplicar tema al montar
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  }, [theme]);

  // Inicializar auth session
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (mounted && profile) {
            setProfile(profile as Profile);
            // Load initial progress
            const progressData = await progressService.loadFullProgress(session.user.id);
            if (mounted && progressData.streak) {
              hydrate({ 
                xp: profile.xp, 
                level: profile.level, 
                bytes: profile.bytes,
                streak: progressData.streak,
                achievements: progressData.achievements
              });
            }
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Suscribirse a cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (mounted && profile) {
          setProfile(profile as Profile);
          const progressData = await progressService.loadFullProgress(session.user.id);
          if (mounted && progressData.streak) {
            hydrate({ 
              xp: profile.xp, 
              level: profile.level, 
              bytes: profile.bytes,
              streak: progressData.streak,
              achievements: progressData.achievements
            });
          }
        }
      } else {
        setProfile(null);
        resetProgress();
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setSession, setLoading]);

  return <AppRouter />;
}
