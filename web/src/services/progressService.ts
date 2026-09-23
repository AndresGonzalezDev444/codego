import { supabase } from '@/lib/supabase';
import type { Streak, Achievement } from '@/types';

export const progressService = {
  /**
   * Obtiene la racha actual del usuario
   */
  async getStreak(userId: string): Promise<Streak | null> {
    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching streak:', error);
      throw error;
    }

    return data as Streak;
  },

  /**
   * Obtiene los logros desbloqueados por el usuario
   */
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }

    // Aplanamos el resultado para devolver un array de Achievements
    return data.map((row: any) => ({
      ...row.achievement,
      unlocked_at: row.unlocked_at
    })) as Achievement[];
  },
  
  /**
   * Inicializa un perfil vacío en progress store
   */
  async loadFullProgress(userId: string) {
    const [streak, achievements] = await Promise.all([
      this.getStreak(userId).catch(() => null),
      this.getUserAchievements(userId).catch(() => []),
    ]);
    
    return { streak, achievements };
  },

  /**
   * Actualiza los corazones del usuario en la base de datos
   */
  async updateHearts(userId: string, newHearts: number) {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        hearts: newHearts,
        // Solo actualizar el timer si estamos bajando de 5 corazones
        ...(newHearts < 5 ? { last_heart_regen_at: new Date().toISOString() } : {})
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating hearts:', error);
      throw error;
    }
  },

  /**
   * Marca una lección como completada, otorga XP y revisa logros
   */
  async completeLesson(userId: string, lessonId: string, xpReward: number = 20, bytesReward: number = 5) {
    // 1. Marcar lección como completada
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        score: 100
      }, { onConflict: 'user_id,lesson_id' });

    if (progressError) throw progressError;

    // 2. Otorgar XP y Bytes mediante evento
    const { error: xpError } = await supabase
      .from('xp_events')
      .insert({
        user_id: userId,
        event_type: 'lesson_completed',
        xp_amount: xpReward,
        metadata: { lesson_id: lessonId, bytes_earned: bytesReward }
      });

    if (xpError) throw xpError;
    
    // También tenemos que actualizar los bytes directamente en el profile porque el trigger solo actualiza XP
    const { error: bytesError } = await supabase.rpc('increment_bytes', { 
      user_id_param: userId, 
      amount: bytesReward 
    });

    // Si el RPC falla (porque no lo hemos creado), hacemos un update clásico
    if (bytesError) {
      const { data: profile } = await supabase.from('profiles').select('bytes').eq('id', userId).single();
      if (profile) {
        await supabase.from('profiles').update({ bytes: (profile.bytes || 0) + bytesReward }).eq('id', userId);
      }
    }

    // 3. Revisar Logros
    await this.checkAndUnlockAchievements(userId);
  },

  /**
   * Evalúa las condiciones y desbloquea logros
   */
  async checkAndUnlockAchievements(userId: string) {
    // Obtener perfil actual y stats
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!profile) return;

    // Obtener cantidad de lecciones completadas
    const { count: lessonsCompleted } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Obtener logros que el usuario NO tiene aún
    const userAchievements = await this.getUserAchievements(userId);
    const userAchievementIds = userAchievements.map(a => a.id);
    
    const { data: allAchievements } = await supabase.from('achievements').select('*');
    if (!allAchievements) return;

    const achievementsToUnlock: any[] = [];
    const newXpEvents: any[] = [];
    const newNotifications: any[] = [];
    let bytesToGive = 0;

    for (const achievement of allAchievements) {
      if (userAchievementIds.includes(achievement.id)) continue;

      let meetsCondition = false;
      
      switch (achievement.condition_type) {
        case 'lessons_completed':
          meetsCondition = (lessonsCompleted || 0) >= achievement.condition_value;
          break;
        case 'level_reached':
          meetsCondition = profile.level >= achievement.condition_value;
          break;
        case 'streak_days':
          meetsCondition = profile.streak_days >= achievement.condition_value;
          break;
      }

      if (meetsCondition) {
        achievementsToUnlock.push({
          user_id: userId,
          achievement_id: achievement.id
        });
        
        if (achievement.xp_reward > 0) {
          newXpEvents.push({
            user_id: userId,
            event_type: 'achievement_unlocked',
            xp_amount: achievement.xp_reward,
            metadata: { achievement_id: achievement.id }
          });
        }
        
        newNotifications.push({
          user_id: userId,
          type: 'achievement',
          title: '¡Logro Desbloqueado!',
          message: `Has conseguido: ${achievement.name}. +${achievement.xp_reward} XP`,
          metadata: { achievement_id: achievement.id, icon: achievement.icon }
        });
        
        bytesToGive += (achievement.bytes_reward || 0);
      }
    }

    // Si hay logros por desbloquear, los insertamos
    if (achievementsToUnlock.length > 0) {
      await supabase.from('user_achievements').insert(achievementsToUnlock);
      if (newXpEvents.length > 0) {
        await supabase.from('xp_events').insert(newXpEvents);
      }
      if (newNotifications.length > 0) {
        await supabase.from('notifications').insert(newNotifications);
      }
      if (bytesToGive > 0) {
        await supabase.from('profiles').update({ bytes: (profile.bytes || 0) + bytesToGive }).eq('id', userId);
      }
    }
  }
};
