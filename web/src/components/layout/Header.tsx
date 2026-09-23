import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Zap, Gem, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { xp, bytes, streak } = useProgressStore();
  const { profile } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (profile) {
      notificationService.getUserNotifications(profile.id)
        .then(setNotifications)
        .catch(console.error);
    }
  }, [profile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
    }
  };

  const markAllAsRead = async () => {
    if (profile && unreadCount > 0) {
      await notificationService.markAllAsRead(profile.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

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
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <span className="text-base">🔥</span>
          <span className="text-sm font-bold text-orange-400">{streak.current_streak}</span>
        </div>

        {/* XP */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400">{xp}</span>
        </div>

        {/* Bytes (moneda) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <Gem className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400">{bytes}</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[--text-muted] hover:text-white hover:bg-[--bg-elevated] transition-all"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[#0a0e1a] rounded-full" />
            )}
          </button>

          {/* Menú de Notificaciones */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 max-h-96 flex flex-col bg-[--bg-surface] border border-[--border-default] rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-[--border-default] flex items-center justify-between">
                  <h3 className="font-bold text-white">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3" /> Marcar leídas
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-[--text-muted]">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tienes notificaciones</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            "px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex gap-3",
                            !notification.is_read ? "bg-cyan-500/5" : ""
                          )}
                        >
                          <div className="mt-1 text-2xl shrink-0">
                            {notification.metadata?.icon || (notification.type === 'achievement' ? '🏆' : '👋')}
                          </div>
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={cn("text-sm font-bold", !notification.is_read ? "text-white" : "text-[--text-secondary]")}>
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-[--text-muted] mt-1">{notification.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
