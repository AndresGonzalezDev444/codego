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
  }
};
