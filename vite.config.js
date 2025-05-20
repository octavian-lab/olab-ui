import { defineConfig } from 'vite'
import { resolve } from 'pathe'
import vue from '@vitejs/plugin-vue'
import resolveRUP from '@rollup/plugin-node-resolve'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'OlabUI',
      fileName: 'olab-ui',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'vue',
        'primevue',
        'moment',
        'axios',
        'chart.js',
        'chart.js/helpers',
        'qrcode-vue3'
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('/components/')) {
            const match = id.split('/components/')[1]
            const name = match?.split('.')[0]
            return name?.toLowerCase()
          }
        },
        exports: 'named',
        globals: {
          vue: 'Vue',
          moment: 'moment',
          axios: 'axios',
          primevue: '$primevue',
          'chart.js': 'Chart',
          'chart.js/helpers': 'Chart.helpers',
          'qrcode-vue3': 'QRCode'
        }
      },
      plugins: [
        resolveRUP({
          moduleDirectories: ['node_modules']
        }),
        visualizer()
      ]
    }
  },
  resolve: {
    symlinks: false,
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
