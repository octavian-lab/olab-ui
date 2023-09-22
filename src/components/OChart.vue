<template>
  <PrimeChart :type="type" :data="dataSet" :options="optionsSet" :height="height" />
</template>

<script>
import PrimeChart from "primevue/chart";

import { Chart } from "chart.js";
import autocolors from "chartjs-plugin-autocolors";

Chart.register(autocolors);

export default {
  name: "Chart",
  components: { PrimeChart },
  props: {
    hasDataset:{
      type:Boolean,
      default: false
    },
    type: String,
    data: Array,
    labels: Array,
    options: Object,
    height: {
      type:[String,Number],
      default: 150
    }
  },
  data() {
    return {
      loading: null,
    };
  },
  computed: {
    dataSet() {
      if (!this.hasDataset) return {
        labels: this.labels,
        hoverOffset: 4,
        datasets: [
          {
            data: this.data,
          },
        ],
      };
      else return {
        labels: this.labels,
        hoverOffset: 4,
        datasets: this.data,
      };
    },
    optionsSet() {
      return this.options
          ? {
            ...this.options,
            plugins: {
              ...this.options.plugins,
              autocolors: {
                mode: "data",
              },
            },
          }
          : {
            plugins: {
              autocolors: {
                mode: "data",
              },
            },
          };
    },
  },
};
</script>

<style scoped lang="scss">
.p-chart {
  word-break: break-word;
}
</style>
