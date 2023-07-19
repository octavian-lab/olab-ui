<template>
  <div
    :class="['field', { 'inline-field': inline }, generateResponsiveColumns()]"
    :data-multilanguage-key="setTranslateKeyAttribute('admin.dialog.field.', name)"
  >
    <label :for="name" class="font-bold" v-tooltip="generateTooltip()">
      <i class="fad fa-info-circle mr-2" v-if="tooltip" />
      <span :class="{ 'text-disabled': disabled }">
        {{ $translate(`admin.field.${name}`, label) }}
      </span>
      <span v-if="required" class="ml-1">*</span>
    </label>
    <div :id="name">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'OField',
  props: {
    name: { type: String, required: true },
    tooltip: { type: Boolean, default: () => false },
    label: { type: String, default: () => undefined },
    col: { type: [String, Object], default: () => '12' },
    required: { type: Boolean, default: () => false },
    inline: { type: Boolean, default: () => false },
    disabled: { type: Boolean, default: () => false }
  },
  methods: {
    setTranslateKeyAttribute(prefix, name) {
      return this.$translate(prefix + name, '', true)
        .replaceAll('-', '')
        .replaceAll(' ', '')
    },
    generateResponsiveColumns() {
      if (typeof this.col === 'string') return `col-${this.col}`
      let arr = []
      const breakpoints = []
      let tmp = 'col'
      for (let [key, val] of Object.entries(this.col)) {
        breakpoints.push(key)
        arr.push(`${tmp}-${key}-${val}`)
        tmp = ''
      }
      arr[0] = arr[0].replace(`-${breakpoints[0]}`, '')
      return arr
    },
    generateTooltip() {
      if (this.tooltip === true) {
        return {
          value: this.$translate(`admin.filter.tooltip.${this.name}`)
        }
      }
    }
  }
}
</script>
