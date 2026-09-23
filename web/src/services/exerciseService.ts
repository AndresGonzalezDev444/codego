import { supabase } from '@/lib/supabase';
import type { Lesson, Exercise } from '@/types';

export interface LessonData extends Lesson {
  exercises: (Exercise & { 
    options: any[]; 
    tests: any[]; 
    hints: any[]; 
  })[];
}

export const exerciseService = {
  /**
   * Obtiene todos los datos de una lección (teoría, ejercicios, opciones, tests, hints)
   */
  async getLessonData(lessonId: string): Promise<LessonData> {
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError) throw lessonError;

    // Obtener los ejercicios de la lección
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select(`
        *,
        options:exercise_options(*),
        tests:exercise_tests(*),
        hints(*)
      `)
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true });

    if (exercisesError) throw exercisesError;

    // Ordenar opciones y tests internamente
    const sortedExercises = exercises.map(ex => ({
      ...ex,
      options: ex.options.sort((a: any, b: any) => a.sort_order - b.sort_order),
      tests: ex.tests.sort((a: any, b: any) => a.sort_order - b.sort_order),
      hints: ex.hints.sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));

    return {
      ...lesson,
      exercises: sortedExercises
    } as LessonData;
  },

  /**
   * Registra un intento de ejercicio
   */
  async recordAttempt(
    userId: string, 
    exerciseId: string, 
    isCorrect: boolean, 
    userAnswer: any, 
    xpEarned: number, 
    bytesEarned: number,
    hintsUsed: number = 0,
    timeSpentSeconds: number = 0
  ) {
    const { error } = await supabase
      .from('exercise_attempts')
      .insert({
        user_id: userId,
        exercise_id: exerciseId,
        is_correct: isCorrect,
        user_answer: userAnswer,
        xp_earned: xpEarned,
        bytes_earned: bytesEarned,
        hints_used: hintsUsed,
        time_spent_seconds: timeSpentSeconds
      });

    if (error) console.error('Error recording attempt:', error);
  },

  /**
   * Marca una lección como completada y otorga XP de la lección
   */
  async completeLesson(userId: string, lessonId: string, totalScore: number) {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        score: totalScore,
        completed_at: new Date().toISOString(),
        last_attempt_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });

    if (error) throw error;
  }
};
