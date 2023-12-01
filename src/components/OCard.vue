<template>
  <Card ref="OCardRef" id="o-card" :class="{ 'h-full': fullHeight }">
    <template v-if="data.title" #title>
      <div ref="OCardTitleRef" class="o-card__title">
        <span ref="OCardTitleContainerRef" class="o-card__title-container">
          <span
            v-if="styleAdvanced"
            ref="OCardStyleAdvancedRef"
            class="o-card__style-advanced"
          ></span>

          <i v-if="mode === 'list' && data.icon" :class="`fad ${data.icon} mr-2`" />
          <span>{{ $translate(`${data.title}`) }}</span>
        </span>
      </div>
    </template>
    <template #content>
      <div class="o-card__content">
        <slot name="content">
          <OList :items="data.items" :striped="striped" class="mt-2" />
        </slot>
        <i
          v-if="mode === 'default' && data.icon"
          ref="OCardIconModeDefaultRef"
          :class="`fad ${data.icon} icon__mode-default`"
        />
      </div>
    </template>
    <template v-if="$slots.footer !== undefined" #footer>
      <div class="o-card__footer">
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
    striped: { Type: Boolean, default: () => true }, // OList only
    styleAdvanced: { Type: Boolean, default: () => false },
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
        if (this.styleAdvanced) {
          this.$refs.OCardTitleRef.style.background = `linear-gradient(180deg, var(--special-color-${this.titleColor}) 50%, rgba(255, 255, 255, 1) 50%)`
          this.$refs.OCardTitleContainerRef.style.backgroundColor = `var(--special-color-${this.titleColor})`
          this.$refs.OCardStyleAdvancedRef.style.backgroundColor = `var(--special-color-${this.titleColor})`
        } else {
          this.$refs.OCardTitleRef.style.backgroundColor = `var(--special-color-${this.titleColor})`
        }
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
      text-align: center;
    }
    .o-card__title {
      font-size: 1.25rem;
      font-weight: bold;
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
    .p-card-footer {
      padding: 1rem;
    }

    .o-card__title-container {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 0 0 0.75rem 0.75rem;
      position: relative;
    }
    .o-card__title-container i,
    .o-card__title-container span:not(.o-card__style-advanced) {
      position: relative;
      z-index: 3;
    }
    .o-card__style-advanced {
      width: calc(100% + 0.75rem + 0.75rem);
      height: calc(0.75rem + 0.75rem);
      position: absolute;
      top: 50%;
      left: -0.75rem;
      transform: translateY(-50%);
      z-index: 1;
    }
    .o-card__style-advanced::before {
      content: '';
      width: calc(0.75rem + 0.75rem);
      aspect-ratio: 1;
      background-color: #ffffff;
      border-radius: 0 50% 0 0;
      position: absolute;
      top: 0.75rem;
      left: -0.75rem;
      z-index: 2;
    }
    .o-card__style-advanced::after {
      content: '';
      width: calc(0.75rem + 0.75rem);
      aspect-ratio: 1;
      background-color: #ffffff;
      border-radius: 50% 0 0 0;
      position: absolute;
      top: 0.75rem;
      right: -0.75rem;
      z-index: 2;
    }
  }
}
</style>
