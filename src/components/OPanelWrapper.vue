<template>
  <Panel :class="`mt-${mt}`">
    <template #header>
      <div class="w-100 font-bold flex align-items-center justify-content-between">
        <div class="flex align-items-center">
          <slot name="img" />
          <div class="mr-2">
            <i v-if="!$slots.img" :class="`${icon} mr-2`" />
            <span>{{ isTranslated ? title : $translate(`admin.generic.${title}`) }}</span>
          </div>
          <slot name="badge" />
        </div>
        <div class="flex align-items-center">
          <slot name="actions" />
        </div>
      </div>
    </template>
    <slot />
  </Panel>
</template>
<script>
export default {
  name: 'OPanelWrapper',
  props: {
    icon: { type: String, required: false, default: 'fad fa-square-poll-horizontal' },
    mt: { type: Number, required: false, default: 5 },
    title: { type: String, required: false, default: 'results' },
    isTranslated: { type: Boolean, required: false, default: false }
  }
}
</script>
