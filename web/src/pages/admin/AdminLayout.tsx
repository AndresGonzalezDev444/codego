import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Globe, BookOpen, ListChecks, Trophy, BarChart2 } from 'lucide-react';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[--bg-base]">
      <aside className="w-56 bg-[--bg-surface] border-r border-[--border-default] p-4 space-y-1">
        <div className="text-lg font-black text-white mb-6">
          <span className="text-cyan-400">&lt;/&gt;</span> Admin
        </div>
        {[
          { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/users', icon: Users, label: 'Usuarios' },
          { to: '/admin/worlds', icon: Globe, label: 'Mundos' },
          { to: '/admin/courses', icon: BookOpen, label: 'Cursos' },
          { to: '/admin/exercises', icon: ListChecks, label: 'Ejercicios' },
          { to: '/admin/achievements', icon: Trophy, label: 'Logros' },
          { to: '/admin/statistics', icon: BarChart2, label: 'Estadísticas' },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-[--text-secondary] hover:bg-[--bg-elevated] hover:text-white border border-transparent'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
