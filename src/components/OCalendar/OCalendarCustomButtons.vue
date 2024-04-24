<template>
  <div id="o-calendar-custom-button" class="flex flex-column">
    <Button :icon="icon()" :class="buttonClasses" @click="emitChangeDay" />
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
    buttonClasses() {
      return [
        'border-noround px-2',
        {
          'border-top-left-rounded border-bottom-left-rounded':
            this.borderRounded && this.direction === 'minus'
        },
        {
          'border-top-right-rounded border-bottom-right-rounded':
            this.borderRounded && this.direction === 'plus'
        }
      ]
    }
  },
  methods: {
    emitChangeDay() {
      const value = this.direction === 'minus' ? -1 : 1
      this.$emit('onChangeDay', value)
    },
    icon() {
      return `far fa-${this.direction}`
    }
  }
}
</script>

<style scoped lang="scss">
#o-calendar-custom-button {
  .border-top-left-rounded {
    border-top-left-radius: var(--border-radius) !important;
  }
  .border-bottom-left-rounded {
    border-bottom-left-radius: var(--border-radius) !important;
  }
  .border-top-right-rounded {
    border-top-right-radius: var(--border-radius) !important;
  }
  .border-bottom-right-rounded {
    border-bottom-right-radius: var(--border-radius) !important;
  }
}
</style>
