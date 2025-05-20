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
import axios from 'axios'
export default {
  name: 'OLottie',
  props: {
    name: { type: String, default: () => undefined },
    height: { type: [Number, String], default: () => 190 },
    width: { type: [Number, String], default: () => '100%' }
  },
  data() {
    return {
      cdnLottiePath: 'https://cdn.octavianlab.com/v3/bo/common/lottie/',
      lottie: null
    }
  },
  async created() {
    try {
      const lottieName = this.name.startsWith('/') ? this.name.replace('/', '') : this.name
      const { data } = await axios.get(this.cdnLottiePath + lottieName + '.json')
      this.lottie = data
    } catch (e) {
      this.lottie = common
      console.info(
        `OLottie: "${this.name}" => a default lottie was inserted since it was not present in the assets/lottie folder.`
      )
    }
  }
}
</script>
