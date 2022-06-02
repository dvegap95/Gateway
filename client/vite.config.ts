import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT || '3001'; 
const host = process.env.HOST || 'localhost'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/api': {
           target: `http://${host}:${port}`,
           changeOrigin: true,
           secure: false,      
       }
  }
  }
})
