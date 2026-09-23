import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Zap, Gem, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { xp, bytes, streak } = useProgressStore();
  const { profile } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 lg:px-6"
      style={{
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-[--bg-elevated] transition-all"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo mobile */}
      <div className="lg:hidden flex items-center gap-1">
        <span className="text-cyan-400 font-bold">&lt;/&gt;</span>
        <span className="text-white font-black">
          Code<span className="text-violet-400">Go</span><span className="text-cyan-400">!</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 hidden sm:block max-w-xs">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search-input"
              initial={{ opacity: 0, width: '40px' }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: '40px' }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
                placeholder="Buscar lecciones..."
                className={cn(
                  'w-full pl-9 pr-4 py-2 text-sm rounded-xl',
                  'bg-[--bg-elevated] border border-[--border-default]',
                  'text-white placeholder:text-[--text-muted]',
                  'focus:outline-none focus:border-cyan-500/50'
                )}
              />
            </motion.div>
          ) : (
            <motion.button
              key="search-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-[--bg-elevated] transition-all"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-2">
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <span className="text-base">🔥</span>
          <span className="text-sm font-bold text-orange-400">{streak.current_streak}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400">{xp}</span>
        </div>

        {/* Bytes (moneda) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <Gem className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400">{bytes}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-[--bg-elevated] transition-all"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {/* Indicador */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-2 pl-1"
          aria-label="Ver perfil"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-500/40 bg-[--bg-elevated] flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-cyan-400">
                {(profile?.display_name ?? profile?.username ?? 'U')[0].toUpperCase()}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-[--text-muted] hidden lg:block" />
        </button>
      </div>
    </header>
  );
}
