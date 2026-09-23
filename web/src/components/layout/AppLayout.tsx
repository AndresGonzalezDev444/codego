import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '@/components/ui/Toast';

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[--bg-base]">
      {/* Sidebar — visible en desktop */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-20 lg:pb-0"
          role="main"
        >
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — visible en mobile */}
      <BottomNav />

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}
