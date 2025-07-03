import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Add a polyfill for process.env
    'process.env': {},
    // Add a polyfill for process
    'process': {
      env: {},
      // Add any other process properties needed
      platform: 'browser'
    },
    // Add a polyfill for global
    'global': 'window'
  }
})
