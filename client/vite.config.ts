import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const port = process.env.PORT || process.env.ALWAYSDATA_HTTPD_PORT || 3001; 
const host = process.env.HOST || process.env.ALWAYSDATA_HTTPD_IP || 'localhost'; 

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
