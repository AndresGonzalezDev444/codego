import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer';
          }
          if (id.includes('node_modules/@codemirror') || id.includes('node_modules/codemirror')) {
            return 'codemirror';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
        },
      },
    },
  },
})
