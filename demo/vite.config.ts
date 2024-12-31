import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['!**/node_modules/habit-contribution-calendar/**']
    }
  },
  optimizeDeps: {
    include: ['habit-contribution-calendar']
  }
}); 