<template>
  <Card ref="OCardRef" id="o-card" :class="{ 'h-full': fullHeight }">
    <template v-if="data.title" #title>
      <div ref="OCardTitleRef" class="cx o-card__title">
        <i v-if="mode === 'list' && data.icon" :class="`fad ${data.icon} mr-2`" />
        <span>{{ $translate(`${data.title}`) }}</span>
      </div>
    </template>
    <template #content>
      <slot name="content">
        <OList :items="data.items" :striped="striped" />
      </slot>
      <i
        v-if="mode === 'default' && data.icon"
        ref="OCardIconModeDefaultRef"
        :class="`fad ${data.icon} icon__mode-default`"
      />
    </template>
    <template v-if="$slots.footer !== undefined" #footer>
      <div class="'o-card__footer m-5'">
        <slot name="footer" />
      </div>
    </template>
  </Card>
</template>

<script>
import { nextTick } from 'vue'

export default {
  name: 'OCard',
  props: {
    mode: { type: String, default: () => 'list' }, // default, list
    data: { type: Object, required: true },
    fullHeight: { type: Boolean, default: () => true },
    striped: { Type: Boolean, default: () => true },
    // TUTTI I COLOR vanno da 1 a 9 (cdn File)
    borderColor: { Type: Number },
    titleColor: { Type: Number },
    contentColor: { Type: Number },
    textColor: { Type: Number }
  },
  mounted() {
    nextTick(() => {
      if (this.borderColor != null)
        this.$refs.OCardRef.$el.style.borderLeft = `0.375rem solid var(--special-color-${this.borderColor})`
      if (this.titleColor != null) {
        this.$refs.OCardTitleRef.style.backgroundColor = `var(--special-color-${this.titleColor})`
        this.$refs.OCardIconModeDefaultRef.style.color = `var(--special-color-${this.titleColor})`
      }
      if (this.contentColor != null)
        this.$refs.OCardRef.$el.style.backgroundColor = `var(--special-color-${this.contentColor})`
      if (this.textColor != null) {
        this.$refs.OCardRef.$el.style.color = `var(--special-color-${this.textColor}-darken)`
        this.$refs.OCardIconModeDefaultRef.style.opacity = '0.5'
      }
    })
  }
}
</script>

<style lang="scss">
#o-card {
  &.p-card {
    position: relative;
    overflow: hidden;
    padding: 0;
    .p-card-body {
      padding: 0;
    }
    .p-card-title {
      margin-bottom: 0;
    }
    .o-card__title {
      font-size: 1.25rem;
      font-weight: bold;
      padding: 1rem;
      text-align: center;
    }
    .p-card-content {
      padding: 0;
      .icon__mode-default {
        position: absolute;
        bottom: -1rem;
        right: -1.5rem;
        font-size: 6rem;
      }
    }
  }
}
</style>
