<template>
  <Dialog
    id="o-dialog"
    modal
    :dismissableMask="false"
    :style="style"
    :visible="$modal.isVisible(name.toLowerCase())"
    @update:visible="handleClose()"
    :breakpoints="breakpoints"
  >
    <template #header>
      <slot name="header">
        <div class="dialog-title">
          <i :class="['mr-3', icon]" />
          <span>{{ generateTitle() }}</span>
        </div>
      </slot>
    </template>
    <OFieldsContainer :showRequiredText="false" :striped="false">
      <slot />
    </OFieldsContainer>
    <template #footer v-if="$slots.footer || $slots['footer-top']">
      <slot name="footer-top" />
      <div
        :class="[
          'flex align-items-center',
          showRequiredText ? 'justify-content-between' : 'justify-content-end'
        ]"
      >
        <div class="footer-left-content">
          <Tag v-if="hasIdentifier" class="flex justify-content-start w-fit">
            {{ getCustomLabel() }}:
            <span class="ml-2"> #{{ modalIdentifier }}</span>
          </Tag>
          <small class="ml-1" v-if="showRequiredText">
            {{ $translate('admin.dialog.text.required') }}
          </small>
        </div>
        <slot name="footer" />
      </div>
    </template>
  </Dialog>
</template>

<script>
export default {
  name: 'ODialog',
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    identifier: { type: String, default: () => 'id' },
    showRequiredText: { type: Boolean, default: () => true },
    icon: { type: String, default: () => '' },
    breakpoints: {
      type: Object,
      default: () => {
        return { '960px': '75vw', '640px': '95%' }
      }
    },
    style: {
      type: Object,
      default: () => {
        return { width: '500px' }
      }
    }
  },
  data() {
    return {
      modalIdentifier: null
    }
  },
  watch: {
    '$modal.id': {
      immediate: true,
      handler(dialogOpenLabel) {
        if (dialogOpenLabel) {
          if (this.identifier.includes('.')) {
            const firstResource = this.identifier.split('.')[0]
            const secondResource = this.identifier.split('.')[1]
            this.modalIdentifier = this.$modal.data[firstResource][secondResource]
          } else this.modalIdentifier = this.$modal.data[this.identifier]
        }
      }
    }
  },
  computed: {
    hasIdentifier() {
      return (
        (this.$modal.mode !== 'add' &&
          this.$modal.data[this.identifier] != null &&
          this.modalIdentifier != null) ||
        (this.$modal.mode !== 'add' &&
          this.$modal.mode === 'clone' &&
          this.$modal.data[this.identifier] != null &&
          this.modalIdentifier != null)
      )
    }
  },
  methods: {
    handleClose() {
      this.$modal.close()
      this.$emit('close')
    },
    getCustomLabel() {
      // Edit label
      let ret = this.$translate('admin.dialog.editing.id')
      // Clone label
      if (this.$modal.mode === 'clone') {
        ret = this.$translate('admin.dialog.cloning.field')
      }
      // Custom label
      if (this.$modal.mode != null && this.$modal.mode !== 'clone') {
        ret = this.$translate(`admin.dialog.${this.$modal.mode}.field`)
      }
      return ret
    },
    generateTitle() {
      let ret = `admin.dialog.title.${this.name.toLowerCase()}`
      if (this.$modal.mode != null) ret += `.${this.$modal.mode}`
      return this.$translate(ret, this.label)
    }
  },
  unmounted() {
    this.$modal.close()
  }
}
</script>
<style>
#o-dialog #o-fields-container .o-field .o-field__value {
  width: 50%;
}
#o-dialog .footer-left-content {
  width: fit-content;
  text-align: left;
}
</style>
