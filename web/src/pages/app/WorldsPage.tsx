import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Lock, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Byte } from '@/components/byte/Byte';
import { worldService } from '@/services/worldService';
import { courseService, type CourseMapData } from '@/services/courseService';
import { useAuthStore } from '@/stores/authStore';
import type { World, Course } from '@/types';
import { cn } from '@/lib/utils';

export default function WorldsPage() {
  const [searchParams] = useSearchParams();
  const worldId = searchParams.get('id');
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const [world, setWorld] = useState<World | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseMap, setCourseMap] = useState<CourseMapData | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!worldId || !profile) {
      navigate('/app/home');
      return;
    }

    const loadWorldData = async () => {
      try {
        // 1. Obtener mundo y su primer curso
        const courses = await worldService.getCoursesByWorld(worldId);
        if (courses.length === 0) throw new Error('No courses found for this world');
        
        const mainCourse = courses[0];
        setCourse(mainCourse);

        // También necesitamos los datos del mundo para los colores
        const worlds = await worldService.getWorlds();
        const currentWorld = worlds.find(w => w.id === worldId);
        if (currentWorld) setWorld(currentWorld);

        // 2. Obtener mapa (unidades y lecciones) y progreso
        const [mapData, progMap] = await Promise.all([
          courseService.getCourseMap(mainCourse.id),
          courseService.getUserProgressForCourse(profile.id, mainCourse.id)
        ]);

        setCourseMap(mapData);
        setProgressMap(progMap);
      } catch (err) {
        console.error(err);
        navigate('/app/home');
      } finally {
        setLoading(false);
      }
    };

    loadWorldData();
  }, [worldId, profile, navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Byte mood="thinking" size="xl" animate />
        <p className="text-[--text-secondary] mt-4 font-medium animate-pulse">Generando el mundo...</p>
      </div>
    );
  }

  if (!world || !course || !courseMap) return null;

  // Calculamos el offset horizontal para el efecto Zig-Zag
  const getZigZagOffset = (index: number) => {
    const cycle = index % 8;
    switch (cycle) {
      case 0: return 0;
      case 1: return 40;
      case 2: return 70;
      case 3: return 40;
      case 4: return 0;
      case 5: return -40;
      case 6: return -70;
      case 7: return -40;
      default: return 0;
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* HEADER DEL MUNDO */}
      <div 
        className="sticky top-0 z-10 px-6 py-4 flex items-center gap-4 mb-8 backdrop-blur-xl border-b border-white/5"
        style={{ 
          background: `linear-gradient(135deg, ${world.color_primary}20, ${world.color_secondary}10)`
        }}
      >
        <button 
          onClick={() => navigate('/app/home')}
          className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-white">{world.name}</h1>
          <p className="text-sm font-medium opacity-80" style={{ color: world.color_primary }}>
            {course.title}
          </p>
        </div>
      </div>

      {/* RENDERIZADO DE UNIDADES */}
      <div className="px-4 space-y-12">
        {courseMap.units.map((unit, unitIndex) => (
          <div key={unit.id} className="relative">
            {/* Cabecera de Unidad */}
            <div 
              className="px-6 py-5 rounded-2xl mb-8 sticky top-20 z-10 flex items-center justify-between shadow-xl"
              style={{ 
                background: `linear-gradient(135deg, ${world.color_primary}, ${world.color_secondary})`,
              }}
            >
              <div>
                <h2 className="text-xl font-black text-white mb-1">Unidad {unitIndex + 1}</h2>
                <p className="text-white/80 text-sm font-medium">{unit.title}</p>
              </div>
              <div className="text-4xl bg-white/20 p-3 rounded-xl">
                {unit.icon}
              </div>
            </div>

            {/* Camino de Lecciones (Zig-Zag) */}
            <div className="flex flex-col items-center py-4 space-y-8 relative">
              {unit.lessons.map((lesson, index) => {
                const progress = progressMap[lesson.id];
                const status = progress?.status || 'not_started';
                
                // Determinar si está desbloqueada: 
                // Por ahora, asumiremos que si es la primera lección de todo, está desbloqueada.
                // Idealmente, una lección se desbloquea si la anterior está completada.
                // Para simplificar la prueba, asumiremos que todas están accesibles, o
                // podemos calcular el estado en base al índice global.
                
                // Hack rápido para determinar bloqueo (para MVP)
                const isLocked = false; // TODO: Implementar lógica de bloqueo real

                const translateX = getZigZagOffset(index);
                
                return (
                  <div 
                    key={lesson.id} 
                    className="relative flex flex-col items-center group cursor-pointer"
                    style={{ transform: `translateX(${translateX}px)` }}
                    onClick={() => !isLocked && navigate(`/app/lesson/${lesson.id}`)}
                  >
                    {/* Tooltip (Title) */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[--bg-surface] border border-[--border-default] px-4 py-2 rounded-xl whitespace-nowrap z-20 pointer-events-none">
                      <p className="font-bold text-white text-sm">{lesson.title}</p>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[--bg-surface] border-b border-r border-[--border-default] rotate-45" />
                    </div>

                    {/* Nodo Circular */}
                    <div 
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-transform active:scale-95",
                        isLocked 
                          ? "bg-[--bg-surface] border-4 border-[--border-default]" 
                          : status === 'completed'
                            ? "border-b-[6px]" // Botón dorado
                            : "border-b-[6px]" // Botón primario
                      )}
                      style={{
                        backgroundColor: isLocked ? undefined : status === 'completed' ? '#facc15' : world.color_primary,
                        borderColor: isLocked ? undefined : status === 'completed' ? '#ca8a04' : world.color_secondary,
                      }}
                    >
                      {isLocked ? (
                        <Lock className="w-8 h-8 text-[--text-muted]" />
                      ) : status === 'completed' ? (
                        <Crown className="w-8 h-8 text-white drop-shadow-md" />
                      ) : (
                        <Star className="w-8 h-8 text-white drop-shadow-md" fill="white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
