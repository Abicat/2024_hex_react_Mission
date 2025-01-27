import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //編譯路徑
  base:process.env.NODE_ENV === 'production' ? '/2024_hex_react_Mission2/':'/',
  plugins: [react()],
})
