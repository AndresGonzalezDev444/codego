import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Map, BookOpen, Trophy, BarChart2, User,
  ChevronRight, LogOut, Settings, Zap, Gem, Sparkles
} from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore, levelToXP } from '@/stores/progressStore';
import { useUIStore } from '@/stores/uiStore';
import { useHeartRegeneration } from '@/hooks/useHeartRegeneration';
import { ProgressBar } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/app/home', label: 'Inicio', icon: Home },
  { path: '/app/map', label: 'Mapa', icon: Map },
  { path: '/app/worlds', label: 'Cursos', icon: BookOpen },
  { path: '/app/achievements', label: 'Logros', icon: Trophy },
  { path: '/app/leaderboard', label: 'Ranking', icon: BarChart2 },
  { path: '/app/profile', label: 'Perfil', icon: User },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { profile, reset: resetAuth } = useAuthStore();
  const { xp, level, bytes, streak } = useProgressStore();
  const { sidebarOpen, byteMood } = useUIStore();
  const { formattedTime } = useHeartRegeneration();

  const currentLevelXP = levelToXP(level);
  const nextLevelXP = levelToXP(level + 1);

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    resetAuth();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="hidden lg:flex flex-col shrink-0 h-screen overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0e1525 0%, #0a0e1a 100%)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-5 py-5 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold text-lg">&lt;/&gt;</span>
              <span className="text-white font-black text-xl tracking-tight">
                Code<span className="text-violet-400">Go</span>
                <span className="text-cyan-400">!</span>
              </span>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Navegación principal">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group',
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                      : 'text-[--text-secondary] hover:bg-[--bg-elevated] hover:text-white border border-transparent'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-4.5 h-4.5 shrink-0',
                        isActive ? 'text-cyan-400' : 'text-[--text-muted] group-hover:text-white'
                      )}
                    />
                    <span className="font-medium">{label}</span>
                    {isActive && (
                      <ChevronRight className="ml-auto w-3.5 h-3.5 text-cyan-400/70" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Byte + Stats en la parte inferior */}
          <div className="p-4 border-t border-white/5 space-y-3">
            {!profile?.is_plus && (
              <div 
                onClick={() => { navigate('/app/plus'); setSidebarOpen(false); }}
                className="group cursor-pointer rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-3 hover:border-yellow-500/40 transition-colors flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-yellow-400 flex items-center gap-1">
                    CodeGo! Plus <Sparkles className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-[--text-muted]">Vidas infinitas y más</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-3 h-3 text-yellow-400" />
                </div>
              </div>
            )}

            {/* Mini Byte con mood */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => { navigate('/app/profile'); setSidebarOpen(false); }}
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer transition-transform hover:scale-105 border-2",
                  profile?.is_plus ? "border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500/20 to-orange-500/20" : "bg-[--bg-surface] border-transparent"
                )}
              >
                <Byte mood={byteMood} size="xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {profile?.display_name ?? profile?.username ?? 'Explorador'}
                </p>
                <p className="text-xs text-cyan-400">Nivel {level}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[--text-muted] group-hover:text-white transition-colors" />
            </div>

            {/* XP bar */}
            <ProgressBar
              value={xp - currentLevelXP}
              max={nextLevelXP - currentLevelXP}
              label={`XP · ${xp}`}
              variant="gradient"
              size="xs"
            />

            {/* Stats rápidos */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-orange-400">
                <span>🔥</span>
                <span className="font-semibold">{streak.current_streak}</span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <span className="font-semibold text-[10px]">❤️</span>
                <span className="font-semibold">{profile?.is_plus ? '∞' : (profile?.hearts ?? 5)}</span>
                {!profile?.is_plus && formattedTime && <span className="text-[10px] ml-0.5 opacity-80">{formattedTime}</span>}
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Zap className="w-3 h-3" />
                <span className="font-semibold">{xp}</span>
              </div>
              <div className="flex items-center gap-1 text-violet-400">
                <Gem className="w-3 h-3" />
                <span className="font-semibold">{bytes}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/app/settings')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-[--text-muted] hover:text-white hover:bg-[--bg-elevated] transition-all"
                aria-label="Configuración"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Config</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-[--text-muted] hover:text-red-400 hover:bg-red-500/10 transition-all"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
