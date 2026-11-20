import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração mínima — sem overengineering (princípio YAGNI, Aula 09).
export default defineConfig({
  // No GitHub Pages o app fica em /<nome-do-repo>/. O workflow de deploy define
  // VITE_BASE; localmente o padrão '/' continua valendo.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Testes unitários (Vitest). jsdom simula o localStorage do navegador.
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/services/**'],
      exclude: ['src/**/*.test.{js,jsx}'],
    },
  },
});
