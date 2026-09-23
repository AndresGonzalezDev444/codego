import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { progressService } from '@/services/progressService';

const REGEN_TIME_MS = 5 * 60 * 1000; // 5 minutos por corazón

export function useHeartRegeneration() {
  const { profile, updateHearts } = useAuthStore();
  const [timeToNextHeart, setTimeToNextHeart] = useState<number | null>(null);

  useEffect(() => {
    if (!profile) return;
    
    // Si tenemos 5 corazones, no regeneramos
    if ((profile.hearts ?? 5) >= 5) {
      setTimeToNextHeart(null);
      return;
    }

    if (!profile.last_heart_regen_at) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const lastRegen = new Date(profile.last_heart_regen_at!).getTime();
      
      const elapsedMs = now - lastRegen;
      
      // Cuántos corazones se han regenerado desde la última vez
      const heartsRegenerated = Math.floor(elapsedMs / REGEN_TIME_MS);
      
      if (heartsRegenerated > 0) {
        const newHearts = Math.min(5, (profile.hearts ?? 0) + heartsRegenerated);
        const newLastRegen = new Date(lastRegen + (heartsRegenerated * REGEN_TIME_MS)).toISOString();
        
        // Actualizamos estado local
        updateHearts(heartsRegenerated, newLastRegen);
        // Podríamos forzar actualización en Supabase aquí si quisiéramos, 
        // pero generalmente basta con mantenerlo en sincronía local 
        // o hacerlo silencioso.
        progressService.updateHearts(profile.id, newHearts);
        // Nota: Idealmente updateHearts en el store actualizaría también el last_heart_regen_at local.
      } else {
        // Calcular tiempo restante para el próximo corazón
        const msToNext = REGEN_TIME_MS - (elapsedMs % REGEN_TIME_MS);
        setTimeToNextHeart(msToNext);
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [profile, updateHearts]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeToNextHeart,
    formattedTime: timeToNextHeart ? formatTime(timeToNextHeart) : null
  };
}
