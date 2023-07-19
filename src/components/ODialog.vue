<template>
  <Dialog
    id="o-dialog"
    modal
    :dismissableMask="false"
    :style="style"
    :visible="$modal.isVisible(name.toLowerCase())"
    @update:visible="$modal.close()"
    :breakpoints="breakpoints"
  >
    <template #header>
      <div class="dialog-title">
        <i :class="['mr-3', icon]" />
        <span>{{ generateTitle() }}</span>
      </div>
    </template>
    <div class="grid formgrid p-fluid">
      <slot />
    </div>
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
            {{ getCloneOrEditLabel() }}:
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
    '$modal.id'(dialogOpenLabel) {
      if (dialogOpenLabel) {
        this.modalIdentifier = this.$modal.data[this.identifier]
      }
    }
  },
  computed: {
    hasIdentifier() {
      return (
        (!this.$modal.mode !== 'add' &&
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
    getCloneOrEditLabel() {
      let ret = this.$translate('admin.dialog.editing.id')
      if (this.$modal.mode === 'clone') {
        ret = this.$translate('admin.dialog.cloning.field')
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
