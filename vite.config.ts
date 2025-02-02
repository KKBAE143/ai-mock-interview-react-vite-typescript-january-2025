import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from 'vite';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: false,
      clientPort: 5173,
    },
    watch: {
      usePolling: false,
    },
    headers: {
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
    },
  },
  build: {
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          form: ['react-hook-form', '@hookform/resolvers', 'zod'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-progress', '@radix-ui/react-slot'],
        },
      },
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
      '@radix-ui/react-select'
    ],
  },
});
