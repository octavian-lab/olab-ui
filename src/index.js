// import { createApp } from 'vue'
// import PrimeVue from 'primevue/config'
// import Tag from 'primevue/tag'
//
// const app = createApp({})
// app.use(PrimeVue)
// app.component('Tag', Tag)
//
import OList from '@/components/OList.vue'

export default {
  install: (app, options) => {
    app.component('OList', OList)
  }
}

export { OList }
