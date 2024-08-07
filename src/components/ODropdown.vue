<template>
  <Dropdown
    :show-clear="handleShowClear()"
    :filter="results.length > 2"
    option-value="value"
    option-label="label"
    :options="results"
    :placeholder="$translate('admin.generic.dropdown.placeholder')"
    :autoFilterFocus="true"
  >
    <template #value="el" v-if="icons.length > 0">
      <div>
        <span v-if="el.icon" class="icon">
          <i :class="el.icon"></i>
        </span>
        <span>{{ el.label }}</span>
      </div>
    </template>
    <template #value="el" v-if="options === 'languages' || generateLanguageList">
      <span v-html="valuesCalcLanguages(el)" v-if="el.value != null"></span>
      <span v-else> {{ el.placeholder }} </span>
    </template>
    <template #option="{ option }" v-if="icons.length > 0">
      <div>
        <span v-if="option.icon" class="icon">
          <i :class="option.icon"></i>
        </span>
        <span>{{ option.label }}</span>
      </div>
    </template>
    <template #option="{ option }" v-if="options === 'languages' || generateLanguageList">
      <span v-html="optionCalcLanguages(option)"></span>
    </template>
  </Dropdown>
</template>

<script>
export default {
  name: 'ODropdown',
  data() {
    return {
      results: this.options
    }
  },
  props: {
    addZeroVal: { type: Boolean, required: false, default: false },
    autoUpdateSkins: { type: Number, required: false },
    options: { type: [Array, String], required: true },
    showClear: { type: Boolean, default: () => true },
    prependValueOnLabel: { type: Boolean, default: () => true },
    translator: { type: String, default: () => null },
    icons: { type: Array, default: () => [] },
    generateLanguageList: { type: Boolean, default: () => false }
  },
  watch: {
    options: {
      immediate: true,
      handler(val) {
        if (typeof this.options === 'string') {
          this.generateOptionsByType()
        } else {
          const prepend = this.generateLanguageList ? false : this.prependValueOnLabel
          this.results = this.elaborate(val, this.translator, prepend)
        }
      }
    },
    autoUpdateSkins: {
      immediate: true,
      handler(idLicensee) {
        if (idLicensee) {
          this.results = this.elaborate(
            this.generateSelects(
              this.$store.getters.getSkinsByLicensee(idLicensee),
              'id',
              'description'
            )
          )
          this.handleZeroVisibilityInList()
        }
      }
    }
  },
  methods: {
    handleShowClear() {
      if (Array.isArray(this.options) || typeof this.options === 'string') {
        // caso in cui le opzioni sono un array
        return this.showClear
      } else {
        // caso in cui hai le opzioni sono generate dai getters
        if (this.$store.getters.isAdminRoot) return true
        return this.results.length > 1
      }
    },
    handleZeroVisibilityInList() {
      if (this.$store.getters.info.idSkin || !this.addZeroVal) {
        return
      }
      switch (this.options) {
        case 'licensees':
          if (!this.$store.getters.isAdminRoot) {
            return
          } else {
            this.addOptionsZeroVal()
          }
          break
        case 'skins':
        case 'sites':
          this.addOptionsZeroVal()
          break
        case 'languages':
          this.addOptionsZeroVal('WW')
          break
        default:
          return
      }
    },
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
      for (let i = 0; i < data.length; i++) {
        const el = data[i]

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

        let icon = null
        if (this.icons.length > 0) {
          icon = this.icons[i]
        }

        ret.push({ label, value, icon })
      }
      return ret
    },
    addOptionsZeroVal(value = 0) {
      const OBJ = {
        label: '0 - Default',
        value
      }
      if (this.options === 'languages') {
        OBJ.label = this.$translate('admin.language.worldwide')
      }
      const index = this.results.findIndex((el) => el.value === OBJ.value)
      if (index === -1) this.results.unshift(OBJ)
    },
    valuesCalcLanguages({ value }) {
      let flag
      let description
      switch (value) {
        case 'WW':
          flag = "<i class='fad fa-globe fa-xl mx-2'></i>"
          description = this.$translate('admin.language.worldwide')
          break
        default:
          flag = `<img class="flag flag-${value?.toLowerCase()} mr-2" />`
          description = this.results.find((it) => it.value === value)?.label
          break
      }
      return `${flag}${description}`
    },
    optionCalcLanguages(option) {
      let img
      switch (option.value) {
        case 'WW':
          img = "<i class='fad fa-globe fa-xl mr-2'></i>"
          break
        default:
          img = `<img class="flag flag-${option.value.toLowerCase()} mr-2" />`
          break
      }
      return `${img}${option.label}`
    },
    generateOptionsByType() {
      let ret = []
      let prependValue = true
      switch (this.options) {
        case 'languages':
          ret = [...this.$store.getters[this.options]]
          prependValue = false
          break
        case 'licensees':
        case 'skins':
        case 'sites':
          ret = [...this.$store.getters[this.options]]
          break
      }
      this.results = this.elaborate(
        this.generateSelects(ret, 'id', 'description'),
        this.translator,
        prependValue
      )
      this.handleZeroVisibilityInList()
    }
  }
}
</script>

<style scoped>
.icon {
  margin-right: 0.5em;
}
</style>
