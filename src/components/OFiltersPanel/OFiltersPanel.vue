<template>
  <Panel
    id="filters-panel"
    :toggleable="true"
    v-model:collapsed="collapsed"
    @toggle="onRememberUserChoice($event)"
  >
    <template #header>
      <div class="font-bold">
        <i :class="[icon, 'mr-2']" />
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
        <slot name="action">
          <OFiltersPanelBtnSearch
            :btnDisabled="btnDisabled"
            :requiredFilters="requiredFilters"
            :btnLoading="btnLoading"
            fastfilter
          />
        </slot>
      </div>
    </template>
    <template #icons>
      <Checkbox
        v-if="$slots['filters-join'] && joinSelectAll"
        v-model="joinSelectAllToggle"
        @change="joinSelectAllHandler()"
        binary
        class="mr-2"
        v-tooltip.left="$translate('admin.generic.join.filters.select.all')"
      />

      <Button
        v-if="showSaveQuery || $store.getters.isAdminRoot"
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
        <slot name="loading" v-if="$slots['loading'] && $loading.isLoading('search')" />
        <slot name="action" v-else>
          <OFiltersPanelBtnSearch
            :btnDisabled="btnDisabled"
            :requiredFilters="requiredFilters"
            :btnLoading="btnLoading"
            :requiredFieldsText="requiredFieldsText"
          />
        </slot>
      </div>
    </div>
    <ContextMenu ref="ctxmenu" :model="ctxMenuItems" />
    <ODialogStoredSearches
      @onUseTemplate="doUseTemplate"
      :useApi="useApi"
      v-if="
        (showSaveQuery || $store.getters.isAdminRoot) && $modal.isVisible('ODialogStoredSearches')
      "
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
    icon: { type: String, default: () => 'fad fa-filters' },
    panelClass: String,
    title: String,
    titleTranslated: String,
    btnLoading: Boolean,
    joinSelectAll: { type: Boolean, default: () => true },
    requiredFieldsText: {
      type: String,
      default: () => 'admin.filter.panel.compile.required.filters'
    }
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
      defaultQuery: JSON.parse(JSON.stringify(this.query)),
      teleportFilter: {
        to: '.dynamic-fastfilter-container',
        disabled: true,
        isMounted: false,
        name: null
      },
      joinSelectAllToggle: false
    }
  },
  watch: {
    query: {
      deep: true,
      immediate: true,
      handler(val) {
        // Abilito la checkbox "select all" se all'interno del panel sono tutte attive.
        this.toggleAutoSelectAll(val)

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
      let translation
      if (this.title) translation = this.title
      else translation = 'admin.generic.filters'

      if (
        this.collapsed &&
        this.showFastFilters &&
        !this.isTablet &&
        !this.isMobile &&
        !this.title
      ) {
        translation = 'admin.generic.fastfilters'
      }

      return this.$translate(translation, this.titleTranslated)
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
    toggleAutoSelectAll(val) {
      let checkboxes
      if (val.join != null) checkboxes = Object.entries(val.join)
      else checkboxes = Object.entries(val).filter(([key]) => key.includes('proj'))

      const checkboxActive = []
      for (let el of checkboxes) {
        if (el[1] === true) checkboxActive.push(el[1])
      }

      this.joinSelectAllToggle = checkboxes.length === checkboxActive.length
    },
    doUseTemplate(savedQuery) {
      for (let [key, val] of Object.entries(savedQuery)) {
        if (this.isDateZulu(val) && this.query[key]) {
          const date = this.query[key].toISOString()
          if (val === date) {
            continue
          }
        }
        this.query[key] = val
      }
      this.toast('success', 'use.search')
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
      this.joinSelectAllToggle = false
      for (let [key, val] of Object.entries(this.defaultQuery)) {
        this.query[key] = typeof val === 'object' ? JSON.parse(JSON.stringify(val)) : val
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
    },
    joinSelectAllHandler() {
      const joinKeys = new Set()
      let hasProjKey = false
      let hasJoinKey = false

      for (const key of Object.keys(this.query)) {
        if (key.includes('proj')) {
          hasProjKey = true
          joinKeys.add(key)
        }
        if (key === 'join') {
          hasJoinKey = true
          Object.keys(this.query.join).forEach((el) => joinKeys.add(el))
        }
      }

      if (hasProjKey) {
        joinKeys.forEach((key) => {
          this.query[key] = this.joinSelectAllToggle
        })
      }
      if (hasJoinKey) {
        joinKeys.forEach((key) => {
          this.query.join[key] = this.joinSelectAllToggle
        })
      }

      if (!this.joinSelectAllToggle) {
        this.doClearFilters()
      }
    },
    reorderDividedColumns() {
      const dividedColumns = document.querySelector('.divided-columns')
      const widthStyleDesktop = window.innerWidth > 1200
      if (dividedColumns?.children.length > 0) {
        for (const [index, el] of Array.from(dividedColumns.children).entries()) {
          if (widthStyleDesktop) {
            el.style = `order: ${index}`
            return
          }

          // Inverto pari e dispari da mobile e tablet.
          if (index % 2 === 0) el.className += ' flex-order-1'
          else el.className += ' flex-order-2'
        }
      }
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
    this.reorderDividedColumns()
  }
}
</script>

<style lang="scss">
$borderColor: var(--surface-border);
$defaultInputHeight: 2.6rem;
#filters-panel.p-panel {
  // OVERRIDE
  .p-panel-content {
    padding: 0;
  }
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
      background: var(--surface-ground);
    }
    .filter-name {
      padding-right: 5px;
      @media screen and (max-width: 1200px) {
        width: 43%;
      }
    }
    .filter-field {
      width: 33.3%;
      height: $defaultInputHeight;
      @media screen and (max-width: 1200px) {
        width: 57%;
      }
      .p-dropdown .p-inputtext {
        display: flex;
        align-items: center;
      }
      .p-inputnumber-button-group > .p-button {
        height: 100%;
      }
      .p-buttonset .p-button {
        width: 50%;
        height: 100%;
      }
      .p-component:first-child:not(
          .p-inputgroup,
          .p-slider,
          .p-calendar .p-chips-token,
          .p-checkbox,
          .p-inputswitch,
          .p-selectbutton .p-button
        ) {
        width: 100%;
        height: 100%;
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
    .filter {
      width: v-bind(colWidth);

      &:nth-child(odd) {
        border-right: 2px solid $borderColor;
        @media screen and (max-width: 1200px) {
          border-right: 0;
        }
      }
      &:nth-child(even) {
        background: transparent;
        .filter-name {
          @media screen and (max-width: 1200px) {
            padding-left: 5px;
          }
        }
      }
      @media screen and (min-width: 1201px) {
        &:nth-child(4n + 2),
        &:nth-child(4n + 3) {
          background: var(--surface-ground) !important;
        }
      }
      @media screen and (max-width: 1200px) {
        width: 100%;
        border-left: none !important;
        padding-right: 0 !important;
        &:nth-child(4n - 3),
        &:nth-child(4n - 2) {
          background: var(--surface-ground);
        }
      }

      .filter-name {
        padding-right: 5px;
        @media screen and (max-width: 1200px) {
          width: 43%;
        }
      }
      .filter-field {
        width: 55%;
        height: $defaultInputHeight;
        @media screen and (max-width: 1200px) {
          width: 57%;
        }
      }
    }
  }
  // STYLE CON PANNELLO JOIN FILTERS
  .joins-divided > .filter,
  .filters-join > .filter {
    @media screen and (min-width: 768px) {
      border-bottom: 2px solid $borderColor;
    }
  }
  .joins-divided {
    border-right: 2px solid $borderColor;
    @media screen and (max-width: 768px) {
      border-right: 0 !important;
    }
    .filter {
      .filter-name {
        padding-right: 5px;
        @media screen and (max-width: 1200px) {
          width: 43%;
        }
      }
      .filter-field {
        width: 55%;
        height: $defaultInputHeight;
        @media screen and (max-width: 1200px) {
          width: 57%;
        }
      }
    }
  }
  .filters-join {
    .filter {
      &:nth-child(odd) {
        background: var(--surface-ground) !important;
      }
      &:nth-child(even) {
        background: transparent !important;
      }
    }
    .filter-field {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  // FILTER FIELD FASTFILTER STYLE
  .filter.fastfilter {
    .filter-field {
      width: 90%;
      :first-child:not(
          .p-inputgroup,
          .p-calendar .p-chips-token,
          .p-checkbox,
          .p-inputswitch,
          .p-slider
        ) {
        width: 100%;
        height: 100%;
      }
    }
  }

  .h-fixed {
    height: 2.7rem;
  }
}
</style>
