import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Mikita-Portfolio/',
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
});
