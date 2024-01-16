/// Vite config
import { defineConfig } from 'vite';
import { version } from './package.json';

// Plugins
import vue from '@vitejs/plugin-vue';

// Export config
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src/'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
