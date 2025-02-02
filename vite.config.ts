import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      port: 5174,
      clientPort: 5174,
      timeout: 5000,
      overlay: true
    },
    headers: {
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=5',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    },
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
        }
      }
    }
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
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-checkbox', '@radix-ui/react-toast', '@radix-ui/react-progress', '@radix-ui/react-select']
        }
      }
    }
  },
  preview: {
    port: 5174,
    strictPort: false
  }
});
