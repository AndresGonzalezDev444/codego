import { motion } from 'framer-motion';
import { User, Flame, Zap, Gem, Calendar, Star, Crown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore, levelToXP } from '@/stores/progressStore';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { profile } = useAuthStore();
  const { xp, level, bytes, streak, achievements } = useProgressStore();

  if (!profile) return null;

  const currentLevelXP = levelToXP(level);
  const nextLevelXP = levelToXP(level + 1);
  const xpInLevel = xp - currentLevelXP;
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  
  const joinDate = new Date(profile.created_at).toLocaleDateString('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header Cover & Avatar */}
      <div className="relative mb-20">
        <div 
          className="h-48 rounded-3xl w-full bg-gradient-to-r from-cyan-900 to-violet-900 border border-white/10 overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-3xl border-4 border-[--bg-base] bg-cyan-900 overflow-hidden shadow-2xl shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-cyan-400">
                {profile.username.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="mb-2">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              {profile.display_name || profile.username}
              {profile.is_plus && (
                <span className="text-[10px] font-black uppercase text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-500/20 mb-1">
                  Plus
                </span>
              )}
            </h1>
            <p className="text-[--text-muted] font-medium flex items-center gap-2">
              @{profile.username} • <Calendar className="w-3 h-3" /> Se unió en {joinDate}
            </p>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <Link to="/app/settings" className="px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-xl text-white text-sm font-bold border border-white/10 transition-colors">
            Editar Perfil
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 px-4">
        {/* Columna Izquierda: Nivel y Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card variant="elevated" padding="md" className="border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {level}
                </div>
                <div>
                  <p className="text-xs text-[--text-muted] font-bold uppercase tracking-wider">Nivel Actual</p>
                  <p className="text-white font-black">{xp.toLocaleString()} XP Totales</p>
                </div>
              </div>
            </div>
            
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span className="text-cyan-400">{xpInLevel} XP</span>
              <span className="text-[--text-muted]">Faltan {xpForNextLevel - xpInLevel} XP</span>
            </div>
            <ProgressBar value={xpInLevel} max={xpForNextLevel} variant="cyan" />
          </Card>

          <Card variant="elevated" padding="md" className="space-y-4">
            <h3 className="font-bold text-white mb-2">Estadísticas</h3>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-3 text-orange-400">
                <Flame className="w-5 h-5" />
                <span className="font-bold text-sm">Racha Actual</span>
              </div>
              <span className="text-lg font-black text-white">{streak.current_streak} días</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <div className="flex items-center gap-3 text-violet-400">
                <Gem className="w-5 h-5" />
                <span className="font-bold text-sm">Bytes (Monedas)</span>
              </div>
              <span className="text-lg font-black text-white">{bytes}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-3 text-yellow-400">
                <Crown className="w-5 h-5" />
                <span className="font-bold text-sm">Logros</span>
              </div>
              <span className="text-lg font-black text-white">{achievements.length}</span>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Logros Destacados */}
        <div className="lg:col-span-2">
          <Card variant="elevated" padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" fill="currentColor" /> 
                Logros Desbloqueados
              </h2>
              <Link to="/app/achievements" className="text-sm font-bold text-cyan-400 hover:text-cyan-300">
                Ver todos
              </Link>
            </div>

            {achievements.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[--bg-base] border-2 border-[--border-default] flex items-center justify-center mx-auto mb-4 text-2xl grayscale opacity-50">
                  🏆
                </div>
                <h3 className="text-white font-bold mb-2">Aún no hay logros</h3>
                <p className="text-sm text-[--text-secondary] max-w-sm mx-auto">
                  Completa lecciones y mantén tu racha para empezar a ganar medallas exclusivas.
                </p>
                <Link to="/app/map" className="inline-block mt-4 text-sm font-bold text-cyan-400 px-4 py-2 bg-cyan-500/10 rounded-xl">
                  Ir a programar
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.slice(0, 6).map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border",
                      achievement.rarity === 'legendary' ? 'bg-orange-500/10 border-orange-500/30' :
                      achievement.rarity === 'epic' ? 'bg-purple-500/10 border-purple-500/30' :
                      achievement.rarity === 'rare' ? 'bg-cyan-500/10 border-cyan-500/30' :
                      'bg-[--bg-surface] border-[--border-default]'
                    )}
                  >
                    <div className="text-3xl shrink-0 drop-shadow-lg">{achievement.icon}</div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{achievement.name}</h4>
                      <p className="text-xs text-[--text-muted]">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
