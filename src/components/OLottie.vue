<template>
  <Vue3Lottie
    v-if="lottie?.layers.length > 0"
    :animationData="lottie"
    :height="height"
    :width="width"
  />
</template>

<script>
import { Vue3Lottie } from 'vue3-lottie'
export default {
  name: 'OLottie',
  components: { Vue3Lottie },
  props: {
    name: { type: String, default: () => undefined },
    height: { type: [Number, String], default: () => 190 },
    width: { type: [Number, String], default: () => '100%' }
  },
  data() {
    return {
      lottie: undefined
    }
  },
  methods: {
    getDynamicLottie(lottieName) {
      return require(`@/assets/lottie/${lottieName}.json`)
    }
  },
  created() {
    const commonLottie = 'common-search'
    try {
      this.lottie = this.getDynamicLottie(this.name)
    } catch (e) {
      console.info(
        `OLottie: "${this.name}" => a default lottie was inserted since it was not present in the assets/lottie folder.`
      )
      this.lottie = this.getDynamicLottie(commonLottie)
    }
  }
}
</script>