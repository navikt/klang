import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    sourcemap: true,
  },
  base: 'https://cdn.nav.no/klage/klang',
  server: {
    port: 8064,
    proxy: {
      '/api': 'https://klage-dittnav-api.intern.dev.nav.no',
      '/person/innloggingsstatus/auth': 'https://innloggingsstatus.dev.nav.no',
    },
  },
})
