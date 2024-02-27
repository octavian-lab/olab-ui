<template>
  <Panel class="mt-5">
    <template #header>
      <div class="font-bold flex align-items-center">
        <span class="mr-2">
          <i :class="`${icon} mr-2`" />
          {{ $translate(`admin.generic.${title}`) }}
        </span>
        <slot name="badge-tag" />
      </div>
    </template>
    <slot />
  </Panel>
</template>
<script>
export default {
  name: 'OTableWrapper',
  props: {
    icon: { type: String, required: false, default: 'fad fa-square-poll-horizontal' },
    title: { type: String, required: false, default: 'results' },
    badge: { type: [String, Number], required: false, default: undefined },
    tag: { type: [String, Number], required: false, default: undefined },
    severity: { type: String, required: false, default: undefined }
  }
}
</script>
