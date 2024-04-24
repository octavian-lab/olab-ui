<template>
  <Card id="o-card" :class="[{ 'h-full': fullHeight }, getCardClass()]">
    <template v-if="data.title" #title>
      <div :class="['o-card__title', getTitleClass()]">
        <span
          :class="[
            'o-card__title-container text-special-color',
            { 'bg-special-color': type === 3 }
          ]"
        >
          <span v-if="type === 3" class="o-card__title-fx"></span>

          <i v-if="data.icon" :class="`fad ${data.icon} mr-2`" />
          <span>{{ $translate(data.title) }}</span>
        </span>
      </div>
    </template>

    <template #content>
      <div class="o-card__content">
        <slot name="content">
          <OList :items="data.items" :striped="striped" :class="{ 'mt-2': data.title }" />
        </slot>
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
export default {
  name: 'OCard',
  props: {
    data: { type: Object, required: true },
    type: { type: Number, required: true },
    color: { type: Number, required: true },
    coloredTitle: { type: Boolean, default: () => true },
    fullHeight: { type: Boolean, default: () => true },
    striped: { type: Boolean, default: () => true }
  },
  data() {
    return {
      colorRef: `var(--special-color-${this.color})`,
      titleColorRef: this.coloredTitle ? `var(--special-color-${this.color}-darken)` : '#495057'
    }
  },
  methods: {
    getCardClass() {
      if (this.color === 0) return ''

      switch (this.type) {
        case 1:
        case 2:
        case 4:
          return 'border-special-color'
        case 3:
          return 'bg-special-color'
      }
    },
    getTitleClass() {
      if (this.color === 0) return ''

      switch (this.type) {
        case 1:
        case 3:
          return 'bg-special-color'
        case 2:
          return ''
        case 4:
          return 'bg-special-color-advanced'
      }
    }
  }
}
</script>

<style lang="scss">
#o-card {
  &.border-special-color {
    border-left: 0.375rem solid v-bind(colorRef);
  }
  &.bg-special-color {
    background-color: v-bind(colorRef);
  }
  & .bg-special-color {
    background-color: v-bind(colorRef);
  }
  & .bg-special-color-advanced {
    background: linear-gradient(180deg, v-bind(colorRef) 50%, transparent 50%);
  }
  & .text-special-color {
    color: v-bind(titleColorRef);
  }

  &.p-card {
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
    .o-card__title-fx {
      width: calc(100% + 0.75rem + 0.75rem);
      position: absolute;
      top: 50%;
      left: -0.75rem;
      transform: translateY(-50%);
      z-index: 1;
    }
    .o-card__title-fx::before {
      content: '';
      width: calc(0.75rem + 0.75rem);
      aspect-ratio: 1;
      position: absolute;
      top: 0;
      left: -0.75rem;
      z-index: 2;
      background: radial-gradient(
        circle,
        transparent calc((100% / 3) * 2),
        v-bind(colorRef) calc((100% / 3) * 2),
        v-bind(colorRef) 100%
      );
      clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
    }
    .o-card__title-fx::after {
      content: '';
      width: calc(0.75rem + 0.75rem);
      aspect-ratio: 1;
      position: absolute;
      top: 0;
      right: -0.75rem;
      z-index: 2;
      background: radial-gradient(
        circle,
        transparent calc((100% / 3) * 2),
        v-bind(colorRef) calc((100% / 3) * 2),
        v-bind(colorRef) 100%
      );
      clip-path: polygon(50% 0, 0 0, 0 50%, 50% 50%);
    }
  }
}
</style>
