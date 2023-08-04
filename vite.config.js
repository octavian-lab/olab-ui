import { defineConfig } from 'vite'
import { resolve } from 'pathe'
import vue from '@vitejs/plugin-vue'
import resolveRUP from '@rollup/plugin-node-resolve'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'OlabUI',
      fileName: 'olab-ui',
      formats: ['es', 'cjs', 'umd', 'iife']
    },
    rollupOptions: {
      external: ['vue', 'primevue', 'moment'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          moment: 'moment',
          primevue: '$primevue',
        }
      },
      plugins: [resolveRUP({
        moduleDirectories: ['node_modules']
      })]
    }
  },
  resolve: {
    symlinks: false,
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})