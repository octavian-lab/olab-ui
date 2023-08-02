<template>
  <Vue3Lottie
    v-if="lottie?.layers.length > 0"
    :animationData="lottie"
    :height="height"
    :width="width"
  />
</template>

<script>
import common from '@/assets/lottie/common-search.json'

export default {
  name: 'OLottie',
  props: {
    name: { type: String, default: () => undefined },
    height: { type: [Number, String], default: () => 190 },
    width: { type: [Number, String], default: () => '100%' }
  },
  data() {
    return {
      lottie: common
    }
  }
  // methods: { TODO
  //   async getDynamicLottie(lottieName) {
  //     return await import(`@/assets/lottie/${lottieName}.json`)
  //     // return this.$image(`@/assets/lottie/${lottieName}.json`) todo
  //   }
  // },
  // async created() {
  //   // const commonLottie = 'common-search'
  //   try {
  //     this.lottie = await this.getDynamicLottie(this.name)
  //     console.log(this.lottie, 'try')
  //   } catch (e) {
  //     console.info(
  //       `OLottie: "${this.name}" => a default lottie was inserted since it was not present in the assets/lottie folder.`
  //     )
  //     this.lottie = await this.getDynamicLottie(commonLottie)
  //     console.log(this.lottie, 'catcb')
  //   }
  // }
}
</script>
