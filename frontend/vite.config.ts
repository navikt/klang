import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: 'https://cdn.nav.no/klage/klang',
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 8064,
    proxy: {
      '/api': {
        target: 'https://klage.intern.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
      '/frontend-log': {
        target: 'https://klage.intern.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
      '/oauth2': {
        target: 'https://klage.intern.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
      '/collect': {
        target: 'https://klage.intern.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
      '/collect-auto': {
        target: 'https://klage.intern.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
      '/person/innloggingsstatus/auth': {
        target: 'https://innloggingsstatus.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
      '/feature-toggle': {
        target: 'https://klage.intern.dev.nav.no',
        changeOrigin: true,
        headers: { Origin: 'https://klage.intern.dev.nav.no' },
      },
    },
  },
});
