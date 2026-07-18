import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Generate bundle analysis report
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      title: 'Frontend Bundle Analysis',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // ─── Build Optimization ───────────────────────────────────────────────────
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['redux', 'react-redux', '@reduxjs/toolkit'],
          'vendor-ui': ['lucide-react', 'recharts'],
          'vendor-http': ['axios'],
          'vendor-utils': ['date-fns', 'lodash'],
        },
      },
    },
    // Minify with esbuild (default) or terser
    minify: 'esbuild',
    // Generate source maps in production (can be disabled for smaller bundle)
    sourcemap: false,
    // Log file sizes
    reportCompressedSize: true,
    // Chunk size warning limit (in kb)
    chunkSizeWarningLimit: 500,
  },

  // ─── CSS Handling ─────────────────────────────────────────────────────────
  css: {
    postcss: './postcss.config.js',
  },
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
