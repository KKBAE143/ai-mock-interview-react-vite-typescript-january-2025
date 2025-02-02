import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
    host: true,
    hmr: {
      timeout: 5000,
      overlay: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      '@hookform/resolvers/zod', 
      'zustand', 
      '@radix-ui/react-checkbox', 
      '@radix-ui/react-toast', 
      '@radix-ui/react-progress', 
      '@radix-ui/react-select',
      'axios'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-select', '@radix-ui/react-slider', '@radix-ui/react-switch', '@radix-ui/react-tabs'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
  preview: {
    port: 5174,
    strictPort: false
  }
});
