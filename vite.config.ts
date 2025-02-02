import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  define: {
    // This is needed for Clerk to work properly
    global: "globalThis",
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@google/generative-ai']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-icons', '@radix-ui/react-slot'],
          'utils-vendor': ['clsx', 'tailwind-merge']
        }
      }
    },
  },
  preview: {
    port: 5174,
    strictPort: false
  }
});
