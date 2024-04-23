<template>
  <div :id="buttonId" class="flex flex-column">
    <Button :icon="icon" :class="buttonClasses" @click="emitAddDay" />
  </div>
</template>

<script>
export default {
  name: 'OCalendarCustomButtons',
  props: {
    borderRounded: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      required: true
    }
  },
  computed: {
    buttonId() {
      return `o-calendar-button-${this.direction}`
    },
    icon() {
      return `far fa-${this.direction === 'minus' ? 'minus' : 'plus'}`
    },
    buttonClasses() {
      return [
        'border-noround px-2',
        { 'border-top-left-rounded': this.borderRounded && this.direction === 'minus' },
        { 'border-bottom-left-rounded': this.borderRounded && this.direction === 'minus' },
        { 'border-top-right-rounded': this.borderRounded && this.direction === 'plus' },
        { 'border-bottom-right-rounded': this.borderRounded && this.direction === 'plus' }
      ]
    }
  },
  methods: {
    emitAddDay() {
      const value = this.direction === 'minus' ? -1 : 1
      this.$emit('onAddDay', value)
    }
  }
}
</script>

<style scoped lang="scss">
#o-calendar-button-minus {
  .border-top-left-rounded {
    border-top-left-radius: var(--border-radius) !important;
  }
  .border-bottom-left-rounded {
    border-bottom-left-radius: var(--border-radius) !important;
  }
}

#o-calendar-button-plus {
  .border-top-right-rounded {
    border-top-right-radius: var(--border-radius) !important;
  }
  .border-bottom-right-rounded {
    border-bottom-right-radius: var(--border-radius) !important;
  }
}
</style>
