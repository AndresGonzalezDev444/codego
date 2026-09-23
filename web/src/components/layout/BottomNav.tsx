import { NavLink } from 'react-router-dom';
import { Globe, Swords, Trophy, ShoppingBag, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { path: '/app/worlds', label: 'Mundos', icon: Globe },
  { path: '/app/map', label: 'Misiones', icon: Swords },
  { path: '/app/achievements', label: 'Logros', icon: Trophy },
  { path: '/app/shop', label: 'Tienda', icon: ShoppingBag },
  { path: '/app/leaderboard', label: 'Ranking', icon: BarChart2 },
];

export function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: 'rgba(10, 14, 26, 0.95)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Navegación móvil"
    >
      {bottomNavItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-3 py-2.5 min-w-0 flex-1',
              'text-xs transition-all duration-150',
              isActive ? 'text-cyan-400' : 'text-[--text-muted]'
            )
          }
          aria-label={label}
        >
          {({ isActive }) => (
            <>
              <div className={cn('p-1.5 rounded-xl transition-all', isActive && 'bg-cyan-500/15')}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="truncate">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
