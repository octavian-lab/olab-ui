<template>
  <Dropdown
    :filter="results.length > 2"
    :show-clear="showClear"
    option-value="value"
    option-label="label"
    :options="results"
    :placeholder="$translate('admin.generic.dropdown.placeholder')"
  >
    <template #value="el" v-if="options === 'languages'">
      <span v-html="valuesCalc(el)" v-if="el.value != null"></span>
      <span v-else> {{ el.placeholder }} </span>
    </template>
    <template #option="el" v-if="options === 'languages'">
      <span v-html="optionCalc(el)"></span>
    </template>
  </Dropdown>
</template>

<script>
export default {
  name: 'ODropdown',
  data() {
    return {
      results: Array.isArray(this.options) ? this.options : [],
      type: null,
      languages: null,
      skins: null,
      licensee: null
    }
  },
  props: {
    addZeroVal: { type: Boolean, required: false, default: false },
    autoUpdateSkins: { type: Number, required: false },
    options: { type: [Array, String], required: true },
    prependValueOnLabel: { type: Boolean, default: () => false },
    showClear: { type: Boolean, default: () => true },
    translator: { type: String, default: () => null }
  },
  watch: {
    autoUpdateSkins: {
      immediate: true,
      handler(idLicensee) {
        this.licensee = idLicensee
        this.results = this.getOptionsList(this.type, this.prependValueOnLabel)
        // this.results = this.$store.getters.getSkinsByLicensee(idLicensee)
        this.handleZeroVisibilityInList()
        //
        if (this.results.length === 1) this.$emit('autoUpdate', this.results[0].value)
      }
    },
    options: {
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.results = this.elaborate(val, this.translator, this.prependValueOnLabel)
        } else {
          this.type = val
          this.results = this.getOptionsList(this.type, this.prependValueOnLabel)
          this.handleZeroVisibilityInList()
        }
      }
    }
  },
  methods: {
    handleZeroVisibilityInList() {
      if (this.$store.getters.info.idSkin || !this.addZeroVal) {
        return
      }
      switch (this.type) {
        case 'skins':
          this.results = this.handleSelects(this.results)
          break
        case 'sites':
          this.results = this.handleSelects(this.results)
          break
        case 'licensees':
          if (this.$store.getters.isAdminRoot) this.results = this.handleSelects(this.results)
          break
        case 'languages':
          this.results = this.handleSelects(this.results, 'WW')
          break
        case 'platforms':
          break
      }
    },

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
          label = `${value} - ${label}`
        }
        ret.push({ label, value })
      }
      return ret
    },
    getOptionsList(data, prependValueOnLabel = true) {
      const type = this.chooseDropdownType(data)
      const arr = this.generateSelects(type, 'id', 'description')
      const ret = arr.map((el) => ({
        label: prependValueOnLabel || data === 'languages' ? el.label : `${el.value} - ${el.label}`,
        value: el.value
      }))
      return ret
    },
    getWorldwideLabel() {
      return this.site === 'agp'
        ? this.$store.getters.translate('admin.language.worldwide')
        : this.$t('admin.language.worldwide')
    },

    handleSelects(arr, value = 0, label = '0 - Default') {
      if (this.type === 'languages') {
        label = this.getWorldwideLabel()
      }
      const arrCopy = arr.slice()
      const adminOption = { value: value, label: label }
      const index = arrCopy.findIndex((el) => el.value === adminOption.value)
      if (index === -1) arrCopy.unshift(adminOption)
      return arrCopy
    },

    valuesCalc(obj) {
      let value = obj.value
      let flag
      let description
      switch (value) {
        case 'WW':
          flag = "<i class='fad fa-globe fa-xl mr-2'></i>"
          break
        default:
          flag = `<img class="flag flag-${value?.toLowerCase()} mr-2" />`
          break
      }
      description =
        value === 'WW'
          ? this.getWorldwideLabel()
          : this.languages.find((it) => it.id === value)?.description
      return `${flag}${description}`
    },

    optionCalc(obj) {
      let option
      switch (obj.option.value) {
        case 'WW':
          const icon = "<i class='fad fa-globe fa-xl mr-2'></i>"
          option = `${icon}${obj.option.label}`
          break
        default:
          const img = `<img class="flag flag-${obj.option.value.toLowerCase()} mr-2" />`
          option = `${img}${obj.option.label}`
          break
      }
      return option
    },
    chooseDropdownType(data) {
      switch (data) {
        case 'skins':
          this.skins = [...this.$store.getters.skins]
          if (this.licensee) this.skins = this.$store.getters.getSkinsByLicensee(this.licensee)
          return this.skins
        case 'sites':
          this.skins = [...this.$store.getters.sites]
          if (this.licensee) this.skins = this.$store.getters.getSkinsByLicensee(this.licensee)
          return this.skins
        case 'licensees':
          return [...this.$store.getters.licensees]
        case 'platforms':
          if (this.$store.getters.info.idLicensee) {
            return [...this.$store.getters.platformsByLicensee]
          } else {
            return [...this.$store.getters.platforms]
          }
        case 'languages':
          this.languages = [...this.$store.getters.languages]
          return this.languages
        default:
          return []
      }
    }
  }
}
</script>
~~
