<template>
  <div
    class="filter"
    @contextmenu="type === 'default' ? doToggleCtxMenu($event, name) : undefined"
    aria-haspopup="true"
    :data-multilanguage-key="setTranslateKeyAttribute('admin.filter.', name)"
    :data-required-field="required"
  >
    <span
      :class="generateFilterClass"
      @click="!isDesktop ? $refs['tooltip-ofilter'].toggle($event) : undefined"
      v-tooltip="generateTooltip()"
    >
      <i class="fad fa-info-circle mr-2" v-if="tooltip" />
      <span :class="{ 'text-disabled': disabled }">
        {{ $translate('admin.filter.' + name, label) }}
      </span>
      <span class="ml-2 font-bold" v-if="required">*</span>
      <OverlayPanel ref="tooltip-ofilter">
        {{ generateTooltip().value }}
      </OverlayPanel>
    </span>
    <Teleport
      :to="teleportFilter?.to"
      :disabled="teleportDisabled"
      v-if="teleportFilter?.isMounted"
    >
      <div
        @contextmenu="type === 'default' ? doToggleCtxMenu($event, name) : undefined"
        :class="{ 'filter-field': type !== 'join', 'filer-field-join': type === 'join' }"
        :data-name="name"
      >
        <slot />

        <Message v-if="isErrorActive && !collapsed" severity="warn">{{
          $translate('admin.generic.input.error')
        }}</Message>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { useSettingsStore } from '@/store/settings.js'
export default {
  name: 'OFilter',
  props: {
    name: { type: String, required: true },
    type: { type: String, default: () => 'default' },
    tooltip: { type: Boolean, default: () => false },
    label: { type: String, default: () => '' },
    disabled: { type: Boolean, default: () => false },
    required: { type: Boolean, default: () => false },
    isErrorActive: { type: Boolean, default: () => false }
  },
  inject: ['doToggleCtxMenu', 'teleportFilter', 'collapsed'],
  data() {
    return {
      useSettingsStore: useSettingsStore()
    }
  },
  watch: {
    collapsed: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (val === true) this.setPlaceholderToTeleportedFilter()
          else this.clearPlaceholderToTeleportedFilter()
        })
      }
    }
  },
  computed: {
    teleportDisabled() {
      if (!this.collapsed) return true
      return !this.useSettingsStore.getFastfilters[this.currentPageName]?.includes(this.name)
    },
    generateFilterClass() {
      const uppercaseCondition = this.$translate('admin.filter.' + this.name).startsWith('--')
      return ['filter-name', 'flex align-items-center', { 'text-uppercase': !uppercaseCondition }]
    }
  },
  methods: {
    setTranslateKeyAttribute(prefix, name) {
      return this.$translate(prefix + name, '', true)
        .replaceAll('-', '')
        .replaceAll(' ', '')
    },
    generateTooltip() {
      if (this.tooltip === true) {
        return {
          value: this.$translate(`admin.filter.tooltip.${this.name}`)
        }
      }
    },
    clearPlaceholderToTeleportedFilter() {
      const pGenerated = Array.from(document.querySelectorAll('.placeholder-generated'))
      for (let el of pGenerated) {
        el.classList.remove('placeholder-generated')
        el.placeholder = ''
      }
    },
    setPlaceholderToTeleportedFilter() {
      const container = document.querySelector('.dynamic-fastfilter-container')
      for (let el of Array.from(container.children)) {
        el.children[0].classList.add('placeholder-generated')
        el.children[0].placeholder = this.$translate(
          `admin.fastfilter.placeholder.${el.attributes['data-name'].value}`
        )
      }
    }
  }
}
</script>

<style lang="scss">
$borderColor: var(--surface-border);
.filter {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 2px solid $borderColor;
  height: 3.7rem;
  @media screen and (max-width: 1200px) {
    border-bottom: 0;
  }
  .filter-name {
    padding-left: 10px;
    @media screen and (max-width: 768px) {
      padding-left: 5px;
    }
  }
  .filter-field,
  .filer-field-join {
    padding-right: 10px;
    .p-inputgroup {
      height: 100%;
    }
    @media screen and (max-width: 768px) {
      padding-left: 5px;
    }
  }
  span {
    font-size: 0.87rem;
  }
  .p-multiselect-token {
    width: auto !important;
  }

  .filter-field {
    .p-message-warn {
      position: absolute;
      top: -3.8rem;
      right: 10px;
      z-index: 10;
      height: 3rem;
      display: flex;

      .p-message-wrapper {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
}
</style>
