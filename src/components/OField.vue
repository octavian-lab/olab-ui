<template>
  <div
    :class="['field o-field', { 'inline-field mb-0': inline }, generateResponsiveColumns()]"
    :data-multilanguage-key="setTranslateKeyAttribute('admin.field.', name)"
  >
    <label
      :for="name"
      :class="['o-field__label', { 'mb-0': inline }]"
      @click="!isDesktop ? $refs['tooltip-ofield'].toggle($event) : undefined"
      v-tooltip="generateTooltip()"
    >
      <i class="fad fa-info-circle mr-2" v-if="tooltip" />
      <span :class="{ 'text-disabled': disabled }">
        {{ setName() }}
      </span>
      <span v-if="required" class="ml-1">*</span>
      <OverlayPanel ref="tooltip-ofield">
        {{ generateTooltip().value }}
      </OverlayPanel>
    </label>
    <div :id="name" :class="[{ 'o-field__value': inline }]">
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
    disabled: { type: Boolean, default: () => false },
    translatedLabel: { type: Boolean, default: () => false }
  },
  methods: {
    setName() {
      return !this.translatedLabel
        ? this.$translate(`admin.field.${this.name}`, this.label)
        : this.name
    },
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
          value: this.$translate(`admin.field.tooltip.${this.name}`)
        }
      }
    }
  }
}
</script>
