import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/husky-puppy-trainer/',
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
  },
})
