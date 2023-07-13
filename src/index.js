import OLottie from '@/components/OLottie.vue'

export default {
  install: (app, options) => {
    app.component('OLottie', OLottie)
  }
}

export { OLottie }
