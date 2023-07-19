<template>
  <Dropdown
    :show-clear="showClear"
    optionValue="value"
    optionLabel="label"
    :options="results"
    :placeholder="$translate('admin.generic.dropdown.placeholder')"
  />
</template>
<script>
export default {
  name: 'ODropdown',
  props: {
    translator: { type: String, default: () => null },
    prependValueOnLabel: { type: Boolean, default: () => true },
    showClear: { type: Boolean, default: () => true },
    options: { type: Array, required: true }
  },
  data() {
    return {
      results: this.options
    }
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        this.results = this.elaborate(val, this.translator, this.prependValueOnLabel)
      }
    }
  },
  methods: {
    elaborate(data, translatePrefix, prependValueOnLabel = true) {
      let ret = []
      if (!Array.isArray(data)) {
        console.warn('Traduzione impossibile non è un array o è un array vuoto: ', ret)
        return ret
      }
      if (data.length === 0) return ret
      let behaviourSimple = true
      if (typeof data[0] === 'object') {
        behaviourSimple = false
      }
      for (let el of data) {
        let label = el.label
        let value = null
        if (behaviourSimple) {
          value = el
        } else {
          value = el.value
        }
        if (translatePrefix) {
          label = this.$translate(translatePrefix + '.' + value)
        }
        if (prependValueOnLabel) {
          label = value + ' - ' + label
        }
        ret.push({ label, value })
      }
      return ret
    }
  }
}
</script>
