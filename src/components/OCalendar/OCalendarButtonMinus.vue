<template>
  <div id="o-calendar-button-minus" class="flex flex-column">
    <Button
      icon="far fa-minus"
      :class="[
        'border-noround px-2',
        { 'border-top-left-rounded': borderLeftRounded },
        { 'border-bottom-left-rounded': borderLeftRounded }
      ]"
      @click="$emit('onAddDay', -1)"
    />
  </div>
</template>

<script>
export default {
  name: 'OCalendarButtonMinus',
  props: {
    borderLeftRounded: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
#o-calendar-button-minus {
  .border-top-left-rounded {
    border-top-right-radius: var(--border-radius) !important;
  }
  .border-bottom-left-rounded {
    border-top-right-radius: var(--border-radius) !important;
  }
}
</style>
