import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ByteMood, Toast } from '@/types';

interface UIState {
  theme: 'dark' | 'light' | 'system';
  sidebarOpen: boolean;
  toasts: Toast[];

  // Byte global
  byteMood: ByteMood;
  byteMessage: string | null;
  byteVisible: boolean;

  // Actions
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setByte: (mood: ByteMood, message?: string) => void;
  showByte: () => void;
  hideByte: () => void;
}

let toastIdCounter = 0;
let byteTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: true,
      toasts: [],
      byteMood: 'idle',
      byteMessage: null,
      byteVisible: true,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark') root.setAttribute('data-theme', 'dark');
        else if (theme === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      addToast: (toast) => {
        const id = `toast-${++toastIdCounter}`;
        const duration = toast.duration ?? 4000;
        set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
        if (duration > 0) {
          setTimeout(() => get().removeToast(id), duration);
        }
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setByte: (mood, message) => {
        set({ byteMood: mood, byteMessage: message ?? null });
        
        // Limpiar el timeout anterior si existe
        if (byteTimeoutId) clearTimeout(byteTimeoutId);
        
        // Si el nuevo mood no es idle, programar el regreso a idle tras 5 segundos
        if (mood !== 'idle') {
          byteTimeoutId = setTimeout(() => {
            set({ byteMood: 'idle', byteMessage: null });
            byteTimeoutId = null;
          }, 5000);
        }
      },

      showByte: () => set({ byteVisible: true }),
      hideByte: () => set({ byteVisible: false }),
    }),
    {
      name: 'codego-ui',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);
