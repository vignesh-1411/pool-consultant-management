

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000', // Your FastAPI backend
//         changeOrigin: true
//       }
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'public'), // Add this line
  server: {
    host: true,
    port: 5173,
    open: true // Automatically open browser
  }
})