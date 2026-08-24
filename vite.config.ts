/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  base: '/the-other-users/',
  plugins: [
    react(),
    {
      name: 'spa-404-fallback',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const indexHtml = path.join(distDir, 'index.html');
        const notFoundHtml = path.join(distDir, '404.html');
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, notFoundHtml);
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@content': path.resolve(__dirname, './src/content'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 20000,
    hookTimeout: 20000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
