import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
  server: {
    // Enable source maps in development mode
    port: 5175,
    sourcemap: true,
  },
})
