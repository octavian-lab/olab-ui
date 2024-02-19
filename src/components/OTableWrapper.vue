<template>
  <Panel
    @toggle="$emit('toggle')"
    :toggleable="toggleable"
    :collapsed="collapsed"
    :badge="badge"
    :tag="tag"
  >
    <template #header>
      <div class="font-bold flex align-items-center">
        <span class="mr-2">
          <i :class="`${icon} mr-2`" />
          {{ $translate(`admin.generic.${title}`) }}
        </span>
        <span v-if="text.exists">
          <component :is="text.type" :severity="severity">
            {{ text.message }}
          </component>
        </span>
      </div>
    </template>
    <slot />
  </Panel>
</template>
<script>
export default {
  name: 'OTableWrapper',
  data() {
    return {
      text: {
        exists: false,
        message: null,
        type: 'Badge'
      }
    }
  },
  props: {
    icon: { type: String, required: false, default: 'fad fa-square-poll-horizontal' },
    title: { type: String, required: false, default: 'results' },
    toggleable: { type: Boolean, required: false, default: true },
    collapsed: { type: Boolean, required: false, default: false },
    badge: { type: [String, Number], required: false, default: undefined },
    tag: { type: [String, Number], required: false, default: undefined },
    severity: { type: String, required: false, default: undefined }
  },
  methods: {
    checkBadgeTag() {
      if (this.badge || this.tag) {
        this.text.exists = true

        this.text.message = this.badge ? this.badge : this.tag
        this.text.type = this.badge ? 'Badge' : 'Tag'
      } else {
        this.text.exists = false
      }
    }
  },
  mounted() {
    this.checkBadgeTag()
  }
}
</script>
