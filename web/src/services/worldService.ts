import { supabase } from '@/lib/supabase';
import type { World, Course } from '@/types';

export const worldService = {
  /**
   * Obtiene todos los mundos y su lenguaje asociado
   */
  async getWorlds(): Promise<World[]> {
    const { data, error } = await supabase
      .from('worlds')
      .select('*, language:languages(*)')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching worlds:', error);
      throw error;
    }

    return data as World[];
  },

  /**
   * Obtiene un mundo específico por slug con todos sus cursos
   */
  async getWorldBySlug(slug: string): Promise<World | null> {
    const { data, error } = await supabase
      .from('worlds')
      .select('*, courses(*), language:languages(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching world by slug:', error);
      throw error;
    }

    return data as World;
  },

  /**
   * Obtiene todos los cursos de un mundo
   */
  async getCoursesByWorld(worldId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('world_id', worldId)
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }

    return data as Course[];
  },
};
