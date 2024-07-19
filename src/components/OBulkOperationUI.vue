<template>
  <Teleport to="body">
    <div class="overlay">
      <OLottie :name="lottieName" :loop="false" :height="350" />
      <span class="font-bold mb-1 text-2xl">
        {{ $translate('admin.generic.please.wait') }}...
      </span>
      <ProgressBar mode="indeterminate" />
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'OBulkOperationUI',
  emits: ['onHideBulk'],
  props: {
    lottieName: { type: String, default: () => 'g-translate' },
    serviceName: { type: String, required: true },
    serviceFunction: { type: String, required: true },
    items: { type: Array, required: true },
    api: { type: Object, required: true }
  },
  methods: {
    doBulkOperation(object) {
      if (!this.items.length > 0) {
        this.$emit('onHideBulk')
        return
      }
      let currentIndex = this.items.findIndex((item) => item.id === object.id)
      const nextIndex = ++currentIndex
      return this.api[`${this.serviceName}`]
        [`${this.serviceFunction}`](object)
        .then(() => {
          if (this.items[nextIndex]) {
            this.doBulkOperation(this.items[nextIndex])
          } else {
            this.$loading.stop('bulk')
            this.$emit('onHideBulk')
            this.toast('success', `${this.serviceFunction}.${this.serviceName}`)
          }
        })
        .catch((e) => {
          console.log(e)
          this.toast('error', e)
          if (this.items[nextIndex]) {
            this.doBulkOperation(this.items[nextIndex])
          } else {
            this.$loading.stop('bulk')
            this.$emit('onHideBulk')
          }
        })
    }
  },
  unmounted() {
    document.body.style.removeProperty('overflow-y')
  },
  created() {
    this.$loading.start('bulk')
    this.doBulkOperation(this.items[0])
    document.body.style.overflowY = 'hidden'
  }
}
</script>

<style scoped>
.overlay {
  z-index: 9999999999999;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 8rem;
  color: var(--primary-color);
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
