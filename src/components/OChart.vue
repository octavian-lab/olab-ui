<template>
  <PrimeChart :type="type" :data="dataSet" :options="optionsSet" :height="height" />
</template>

<script>
import PrimeChart from 'primevue/chart'
import { Chart, Colors } from 'chart.js'

Chart.register(Colors)

export default {
  name: 'Chart',
  components: { PrimeChart },
  props: {
    hasDataset: {
      type: Boolean,
      default: false
    },
    type: String,
    data: Array,
    labels: Array,
    options: Object,
    height: {
      type: [String, Number],
      default: 150
    }
  },
  data() {
    return {
      loading: null
    }
  },
  computed: {
    dataSet() {
      if (!this.hasDataset)
        return {
          labels: this.labels,
          hoverOffset: 4,
          datasets: [
            {
              data: this.data
            }
          ]
        }
      else
        return {
          labels: this.labels,
          hoverOffset: 4,
          datasets: this.data
        }
    },
    optionsSet() {
      return this.options
        ? {
            ...this.options,
            plugins: {
              ...this.options.plugins,
              colors: {
                forceOverride: true
              }
            }
          }
        : {
            plugins: {
              colors: {
                forceOverride: true
              }
            }
          }
    }
  }
}
</script>

<style scoped lang="scss">
.p-chart {
  word-break: break-word;
}
</style>
