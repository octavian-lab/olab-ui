import { reactive } from 'vue'

const loading = reactive({
  arr: [],
  start(label = new Date().getTime()) {
    this.arr.push(label)
    return label
  },
  stopAll() {
    this.arr = []
  },
  stop(label) {
    if (!label) {
      this.arr.pop()
      return
    }
    this.arr = this.arr.filter((el) => el !== label)
  },
  isLoading(label) {
    return this.arr.includes(label)
  },
  // Controlla se un qualsiasi loading è presente nell'array.
  isLoadingLength() {
    return this.arr.length > 0
  }
})

export default {
  install(app) {
    app.config.globalProperties.$loading = loading
  },
  loading
}
