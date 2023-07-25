<template>
  <Card id="o-card" :class="['m-1', { [`card-border-color-${borderColor}`]: borderColor }]">
    <template v-if="data.title" #title>
      <div class="cx card-title">
        <i v-if="data.icon" :class="`fad ${data.icon} mr-2`" />
        <span>{{ $translate(`${data.title}`) }}</span>
      </div>
    </template>
    <template #content>
      <div v-if="data.items" :class="[{ 'mb-5': $slots.content !== undefined }]">
        <OList :items="data.items" :striped="striped" />
      </div>
      <slot name="content" />
    </template>
    <template v-if="$slots.footer !== undefined" #footer>
      <slot name="footer" />
    </template>
  </Card>
</template>

<script>
export default {
  name: 'OCard',
  props: {
    data: { type: Object, required: true },
    borderColor: { Type: Number },
    striped: { Type: Boolean, default: () => true }
  },
  methods: {
    setIcon(value) {
      switch (value) {
        case true:
          return 'fa-circle-check text-success'
        case false:
          return 'fa-circle-xmark text-danger'
      }
    }
  }
}
</script>

<style lang="scss">
#o-card {
  .card-title {
    font-size: 1.125rem;
  }
  &.p-card {
    .p-card-content {
      padding: 0;
    }
  }
}

// SPECIAL COLORS
.card-border-color-1 {
  border-left: 3px solid var(--special-color-1);
}
.card-border-color-2 {
  border-left: 3px solid var(--special-color-2);
}
.card-border-color-3 {
  border-left: 3px solid var(--special-color-3);
}
.card-border-color-4 {
  border-left: 3px solid var(--special-color-4);
}
.card-border-color-5 {
  border-left: 3px solid var(--special-color-5);
}
.card-border-color-6 {
  border-left: 3px solid var(--special-color-6);
}
.card-border-color-7 {
  border-left: 3px solid var(--special-color-7);
}
.card-border-color-8 {
  border-left: 3px solid var(--special-color-8);
}
.card-border-color-9 {
  border-left: 3px solid var(--special-color-9);
}
</style>
