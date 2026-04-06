import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true // Permet d'accéder au serveur via ton IP locale (utile pour tester avec ton téléphone)
  }
})