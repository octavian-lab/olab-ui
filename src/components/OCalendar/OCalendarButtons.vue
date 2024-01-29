<template>
  <div id="o-calendar-buttons" class="flex flex-column">
    <Button
      icon="fad fa-angle-up"
      :class="['border-noround px-2', { 'border-top-right-rounded': borderRightRounded }]"
      @click="$emit('onAddDay', 1)"
    />
    <Button
      icon="fad fa-angle-down"
      :class="['border-noround px-2', { 'border-bottom-right-rounded': borderRightRounded }]"
      @click="$emit('onAddDay', -1)"
    />
  </div>
</template>

<script>
export default {
  name: 'OCalendarButtons',
  props: {
    borderRightRounded: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
#o-calendar-buttons {
  .border-top-right-rounded {
    border-top-right-radius: var(--border-radius) !important;
  }
  .border-bottom-right-rounded {
    border-bottom-right-radius: var(--border-radius) !important;
  }
}
</style>
