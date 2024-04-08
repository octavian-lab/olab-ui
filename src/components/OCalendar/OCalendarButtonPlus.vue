<template>
  <div id="o-calendar-button-plus" class="flex flex-column">
    <Button
      icon="far fa-plus"
      :class="[
        'border-noround px-2',
        { 'border-top-right-rounded': borderRightRounded },
        { 'border-bottom-right-rounded': borderRightRounded }
      ]"
      @click="$emit('onAddDay', 1)"
    />
  </div>
</template>

<script>
export default {
  name: 'OCalendarButtonPlus',
  props: {
    borderRightRounded: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
#o-calendar-button-plus {
  .border-top-right-rounded {
    border-top-right-radius: var(--border-radius) !important;
  }
  .border-bottom-right-rounded {
    border-bottom-right-radius: var(--border-radius) !important;
  }
}
</style>
