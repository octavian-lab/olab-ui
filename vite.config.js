// import { fileURLToPath, URL } from 'node:url'
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
      name: 'OlabUi',
      fileName: 'olab-ui',
      formats: ['es', 'cjs', 'umd', 'iife']
    },
    rollupOptions: {
      external: ['vue', 'primevue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          primevue: '$primevue'
        }
      },
      plugins: [resolveRUP()]
    }
  },
  resolve: {
    symlinks: false,
    alias: {
      '/@': resolve(__dirname, './src')
    }
  }
})
