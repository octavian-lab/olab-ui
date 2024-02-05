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
    options: { type: [Array, String], required: true }
  },
  data() {
    return {
      results: Array.isArray(this.options) ? this.options : []
    }
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.results = this.elaborate(val, this.translator, this.prependValueOnLabel)
        }
      }
    }
  },
  methods: {
    elaborate(data, translatePrefix, prependValueOnLabel = true) {
      let ret = []
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
    },
    getOptionsList() {
      let ret = []
      switch (this.options) {
        case 'skins':
          ret = [...this.$store.getters.skins]
          break
        case 'licensees':
          ret = [...this.$store.getters.licensees]
          break
        case 'platforms':
          if (this.$store.getters.info.idLicensee) {
            ret = [...this.$store.getters.platformsByLicensee]
          } else {
            ret = [...this.$store.getters.platforms]
          }
          break
        case 'languages':
          ret = [...this.$store.getters.languages]
          break
      }
      this.results = this.generateSelects(ret, 'id', 'description')
    }
  },
  mounted() {
    if (typeof this.options === 'string') {
      this.getOptionsList()
    }
  }
}
</script>
