<template>
  <Vue3Lottie
    v-if="lottie?.layers?.length > 0"
    ref="lottieRef"
    :animationData="lottie"
    :height="height"
    :width="width"
  />
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import common from '@/assets/lottie/common-search.json'
import axios from 'axios'

// Props
const props = defineProps({
  name: { type: String, default: undefined },
  height: { type: [Number, String], default: 190 },
  width: { type: [Number, String], default: '100%' }
})

// Refs e costanti
const cdnLottiePath = 'https://cdn.octavianlab.com/v3/bo/common/lottie/'
const lottie = ref(null)
const lottieRef = ref(null)

// Fetch animazione al mount
onMounted(async () => {
  try {
    const lottieName = props.name?.startsWith('/') ? props.name.replace('/', '') : props.name

    const { data } = await axios.get(`${cdnLottiePath}${lottieName}.json`)
    lottie.value = data
  } catch (e) {
    lottie.value = common
    console.info(
      `OLottie: "${props.name}" => a default lottie was inserted since it was not present in the assets/lottie folder.`
    )
  }
})

// Pulizia all'unmount
onBeforeUnmount(() => {
  try {
    const lottie = lottieRef.value
    if (lottie && typeof lottie.destroy === 'function') {
      lottie.destroy()
      console.info('OLottie: animazione distrutta con successo')
    }
  } catch (e) {
    console.warn("OLottie: errore nella distruzione dell'animazione Lottie", e)
  }
})
</script>
