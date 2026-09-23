import { supabase } from '@/lib/supabase';
import type { Unit, Lesson } from '@/types';

export interface CourseMapData {
  units: (Unit & { lessons: Lesson[] })[];
}

const courseMapCache = new Map<string, CourseMapData>();

export const courseService = {
  /**
   * Obtiene la jerarquía completa de un curso: Unidades -> Lecciones
   */
  async getCourseMap(courseId: string): Promise<CourseMapData> {
    if (courseMapCache.has(courseId)) {
      return courseMapCache.get(courseId)!;
    }

    const { data, error } = await supabase
      .from('units')
      .select(`
        *,
        lessons (*)
      `)
      .eq('course_id', courseId)
      .eq('status', 'published')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching course map:', error);
      throw error;
    }

    // Asegurar que las lecciones dentro de cada unidad estén ordenadas
    const units = data.map((unit: any) => {
      if (unit.lessons) {
        unit.lessons.sort((a: Lesson, b: Lesson) => a.sort_order - b.sort_order);
      }
      return unit;
    });

    const result = { units };
    courseMapCache.set(courseId, result);
    return result;
  },

  /**
   * Obtiene el progreso del usuario para las lecciones de un curso
   */
  async getUserProgressForCourse(userId: string, courseId: string) {
    // Primero necesitamos obtener los IDs de todas las lecciones del curso
    const { data: unitsData, error: unitsError } = await supabase
      .from('units')
      .select('id')
      .eq('course_id', courseId);

    if (unitsError) throw unitsError;
    
    if (!unitsData || unitsData.length === 0) return {};

    const unitIds = unitsData.map(u => u.id);

    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .in('unit_id', unitIds);
      
    if (lessonsError) throw lessonsError;

    if (!lessonsData || lessonsData.length === 0) return {};

    const lessonIds = lessonsData.map(l => l.id);

    // Ahora buscamos el progreso del usuario para esas lecciones
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .in('lesson_id', lessonIds);

    if (progressError) throw progressError;

    // Convertimos a un diccionario { lesson_id: progress_data }
    const progressMap: Record<string, any> = {};
    if (progressData) {
      progressData.forEach(p => {
        progressMap[p.lesson_id] = p;
      });
    }

    return progressMap;
  }
};
