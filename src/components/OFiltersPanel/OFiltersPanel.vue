<template>
  <Panel
    id="filters-panel"
    :toggleable="true"
    v-model:collapsed="collapsed"
    @toggle="onRememberUserChoice($event)"
  >
    <template #header>
      <div class="font-bold">
        <i class="fad fa-filters mr-2" />
        <span class="panel-title">{{ filtersTitle }}</span>
        <i
          class="fad fa-circle-info animate__animated animate__bounceIn ml-2"
          v-tooltip="$translate('admin.filter.fastfilter.tooltip')"
          :key="collapsed"
        />
      </div>
      <div class="fastfilter-box" v-show="showFastFilters && collapsed">
        <div
          class="dynamic-fastfilter-container animate__animated animate__fadeInUp animate__faster"
        />
        <OFiltersPanelBtnSearch
          :btnDisable="btnDisabled"
          :requiredFilters="requiredFilters"
          fastfilter
        />
      </div>
    </template>
    <template #icons>
      <Button
        v-if="$store.getters.isAdminRoot"
        class="mr-2"
        v-tooltip.left="{ value: $translate('admin.filter.memorize.search') }"
        icon="fad fa-floppy-disk fa-lg"
        @click="$modal.open('ODialogStoredSearches', { key: currentPageName, type: 1, list: [] })"
      />

      <Button
        class="clear-btn mr-2"
        @click="doClearFilters()"
        :icon="checkFilters"
        v-if="checkFilters?.includes('xmark')"
        :label="isMobile ? '' : $translate('admin.generic.clear.filters')"
      />
    </template>
    <div class="grid grid-nogutter overflow-hidden">
      <div :class="filtersContainerClass()">
        <slot name="filters" />
      </div>
      <div class="filters-join col-12 md:col-5" v-if="showJoins()">
        <slot name="filters-join" />
      </div>
      <div class="col-12 flex justify-content-center p-0 my-2 text-center h-fixed">
        <OFiltersPanelBtnSearch :btnDisable="btnDisabled" :requiredFilters="requiredFilters" />
      </div>
    </div>
    <ContextMenu ref="ctxmenu" :model="ctxMenuItems" />
    <ODialogStoredSearches
      v-if="$store.getters.isAdminRoot && $modal.isVisible('ODialogStoredSearches')"
      @onUseTemplate="doUseTemplate"
      :useApi="useApi"
    />
  </Panel>
</template>
<script>
import { computed } from 'vue'
import ODialogStoredSearches from './ODialogStoredSearches.vue'
import OFiltersPanelBtnSearch from './OFiltersPanelBtnSearch.vue'
import { useSettingsStore } from '@/store/settings.js'
export default {
  name: 'OFiltersPanel',
  components: { ODialogStoredSearches, OFiltersPanelBtnSearch },
  props: {
    useApi: { type: Boolean, default: () => false },
    btnDisabled: { type: Boolean, default: () => false },
    col: { type: [Number, String], default: () => 1 },
    showSaveQuery: { type: Boolean, default: () => true },
    panelClass: String
  },
  inject: {
    query: { default: undefined } // REQUIRED
  },
  provide() {
    return {
      doToggleCtxMenu: this.doToggleCtxMenu,
      teleportFilter: this.teleportFilter,
      collapsed: computed(() => this.collapsed)
    }
  },
  data() {
    return {
      useSettingsStore: useSettingsStore(),
      requiredFilters: [],
      page: this.currentPageName,
      collapsed: false,
      defaultQuery: { ...this.query },
      teleportFilter: {
        to: '.dynamic-fastfilter-container',
        disabled: true,
        isMounted: false,
        name: null
      }
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.requiredFilters = Array.from(document.querySelectorAll('.filter')).filter(
            (el) => el.attributes['data-required-field'].value === 'true'
          )
        })
      }
    }
  },
  computed: {
    ctxMenuItems() {
      let action = {}
      if (
        !this.useSettingsStore.getFastfilters[this.currentPageName]?.includes(
          this.teleportFilter.name
        )
      ) {
        action = { label: 'add', icon: 'fa-circle-plus text-success' }
      } else {
        action = { label: 'remove', icon: 'fa-trash text-danger' }
      }
      return [
        {
          label: this.$translate(`admin.action.${action.label}.fastfilters`),
          icon: `fad ${action.icon}`,
          command: () => {
            this.useSettingsStore.updateFastfilters({
              page: this.currentPageName,
              value: this.teleportFilter.name
            })
            this.$toast.add({
              severity: 'success',
              summary: this.$translate('admin.generic.operation.completed'),
              detail: this.$translate(`admin.toast.${action.label}.fastfilters`),
              life: 800
            })
          }
        }
      ]
    },
    showFastFilters() {
      return this.useSettingsStore.getFastfilters[this.currentPageName]?.length > 0
    },
    checkFilters() {
      let icon
      if (JSON.stringify(this.defaultQuery) !== JSON.stringify(this.query)) {
        icon = 'fad fa-filter-circle-xmark'
      }
      return icon
    },
    filtersTitle() {
      let translation = 'admin.generic.filters'
      if (this.collapsed && this.showFastFilters && !this.isTablet && !this.isMobile)
        translation = 'admin.generic.fastfilters'
      return this.$translate(translation)
    },
    colWidth() {
      const column = typeof this.col === 'string' ? +this.col : this.col
      switch (column) {
        case 2:
          return '50%'
        case 1:
        default:
          return '100%'
      }
    }
  },
  methods: {
    doUseTemplate(savedQuery) {
      this.toast('success', 'use.search')
      for (let [key, val] of Object.entries(savedQuery)) {
        this.query[key] = val
      }
      this.$toast.add({
        severity: 'success',
        summary: this.$translate('admin.generic.operation.completed'),
        detail: this.$translate('admin.filter.used.saved.search.successfully'),
        life: 1000
      })
      this.$modal.close()
    },
    // ATTENZIONE non scrivere codice commentato nella slot ( altrimenti showFastFilters diventerà true )
    showJoins() {
      if (this.$slots['filters-join']) return this.$slots['filters-join']().length > 0
      return false
    },
    doToggleCtxMenu(event, name) {
      this.teleportFilter.name = name
      this.$refs.ctxmenu.show(event)
    },
    doClearFilters() {
      // Reimposto i filtri allo stato iniziale.
      for (let [key, val] of Object.entries(this.defaultQuery)) {
        this.query[key] = val
      }
    },
    filtersContainerClass() {
      const column = typeof this.col === 'string' ? +this.col : this.col
      return [
        'col-12',
        { 'joins-divided md:col-7': this.showJoins() },
        { 'divided-columns': column > 1 }
      ]
    },
    onRememberUserChoice(e) {
      this.useSettingsStore.updateStoredPanels({
        page: this.currentPageName,
        value: e.value
      })
    }
  },
  created() {
    this.collapsed = this.useSettingsStore.getStoredPanelByName(this.currentPageName)
    if (this.query == null) {
      console.error(
        '-- ATTENTION -- -> You have to provide Query from the parent for the component to work properly'
      )
    }
  },
  mounted() {
    this.teleportFilter.isMounted = true
  }
}
</script>

<style lang="scss">
$borderColor: rgba(149, 148, 148, 0.19);
#filters-panel.p-panel {
  // FASTFILTER BOX
  .fastfilter-box,
  .dynamic-fastfilter-container {
    margin-right: 1rem;
    display: flex;
    justify-content: space-evenly;
    align-content: center;
    @media only screen and (max-width: 1200px) {
      display: none;
    }
    .filter-field,
    .filter-field > * {
      width: 16rem !important;
      margin-left: 1rem;
    }
    .filter.fastfilter {
      width: 16rem;
      padding: 0;
    }
    .p-dropdown,
    .p-inputtext {
      width: 16rem;
      height: 100%;
    }
    .p-button:not(.p-datepicker-trigger) {
      margin: 0 1rem;
      padding: 0 1rem;
    }
  }

  // FILTER FIELD DEFAULT STYLE
  .filter {
    &:nth-child(even) {
      background: var(--bluegray-100);
    }
    .filter-field {
      width: 33.3%;
      @media screen and (max-width: 1200px) {
        width: 57%;
      }
      :first-child:not(.p-inputgroup, .p-calendar .p-chips-token, .p-checkbox) {
        width: 100%;
      }
      :first-child#o-calendar .p-calendar {
        width: 100% !important;
      }
    }
  }
  // STYLE CON DIVIDED COLUMNS
  .divided-columns {
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    @media screen and (max-width: 1200px) {
      display: block;
    }
    .filter {
      width: v-bind(colWidth);
      &:nth-child(4n + 2),
      &:nth-child(4n + 3) {
        background: var(--bluegray-100) !important;
      }
      &:nth-child(even) {
        background: transparent;
        border-right: 2px solid $borderColor;
        .filter-name {
          @media screen and (max-width: 1200px) {
            padding-left: 5px;
          }
        }
      }
      @media screen and (max-width: 1200px) {
        width: 100%;
        border-left: none !important;
        padding-right: 0 !important;
      }
      .filter-field {
        width: 55%;
        @media screen and (max-width: 1200px) {
          width: 57%;
        }
      }
    }
  }
  // STYLE CON PANNELLO JOIN FILTERS
  .joins-divided {
    border-right: 2px solid $borderColor;
    @media screen and (max-width: 1200px) {
      border-right: none !important;
    }
    .filter {
      .filter-field {
        width: 55%;
        @media screen and (max-width: 1200px) {
          width: 57%;
        }
      }
    }
  }
  .filters-join {
    .filter {
      &:nth-child(odd) {
        background: var(--bluegray-100) !important;
      }
      &:nth-child(even) {
        background: transparent !important;
      }
    }
    .filter-field {
      text-align: right;
    }
  }

  // FILTER FIELD FASTFILTER STYLE
  .filter.fastfilter {
    .filter-field {
      width: 90%;
      :first-child:not(.p-inputgroup, .p-calendar .p-chips-token, .p-checkbox) {
        width: 100%;
      }
    }
  }

  .h-fixed {
    height: 2.7rem;
  }
}
</style>
