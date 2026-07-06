import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base works both on GitHub Pages (/Mikita-Portfolio/) and Railway (/)
  base: './',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
});
