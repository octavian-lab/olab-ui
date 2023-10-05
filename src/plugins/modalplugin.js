import { reactive } from 'vue'

const modal = reactive({
  id: null,
  data: {},
  mode: null,
  step: 0,
  isVisible(id) {
    return this.id === id.toLowerCase()
  },
  open(id, data = {}, mode = null, step = 0) {
    this.id = id.toLowerCase()
    this.data = data
    this.mode = mode
    this.step = step
    console.info(
      `INFO: $modal.open() => you are trying to open a modal with a name: %c${id}`,
      'color:#0086b3'
    )
  },
  close() {
    this.id = null
    this.data = {}
    this.mode = null
    this.step = 0
  }
})

export default {
  install(app) {
    app.config.globalProperties.$modal = modal
  },
  modal
}
