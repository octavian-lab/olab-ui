<template>
  <div v-if="dynamicColumns" class="flex justify-content-between mb-2">
    <MultiSelect
      @change="onToggle($event)"
      v-model="selectedColumns"
      class="w-100 dx"
      display="chip"
      :options="dynamicColumns"
      optionLabel="header"
      :placeholder="$translate('select.columns.to.show')"
    >
      <template #chip="el">{{ $translate(el.value.header) }}</template>
      <template #option="el"> {{ $translate(el.option.header) }}</template>
    </MultiSelect>
  </div>

  <DataTable
    id="o-table"
    :value="value"
    v-model:expandedRows="expandedRows"
    v-model:filters="filters"
    paginator-position="both"
    :rows="$attrs.rows || 50"
    :currentPageReportTemplate="getDtTemplate('currentPageReport')"
    :paginatorTemplate="getDtTemplate('paginator')"
    class="p-datatable-sm p-datatable-striped dt-text-responsive"
    ref="dt"
    :stateStorage="storeSession ? 'session' : undefined"
    :stateKey="storeSession ? `octavianlab-${site}:datatable-state` : undefined"
    :filterDisplay="filters ? 'row' : null"
    showGridlines
    removableSort
    autoLayout
    :paginator="paginator && value?.length > 0"
    :loading="loading || $loading.isLoading('search')"
    :rowsPerPageOptions="$attrs.rowsPerPageOptions || rowsPerPageOptions"
    :responsiveLayout="refResponsiveLayout"
    sortMode="multiple"
    v-bind="$attrs"
    :dataKey="value && value.length > 0 && value[0].id ? 'id' : undefined"
    :key="refResponsiveLayout"
    :editMode="$attrs.editMode"
  >
    <template #header v-if="hasHeader">
      <div
        :class="[
          'header-container',
          name || icon || $slots['table-header'] ? 'justify-content-between' : 'justify-content-end'
        ]"
      >
        <slot name="table-header" />
        <div class="table-title" v-if="name || icon">
          <i v-if="icon" :class="`fad ${icon} mr-3 fa-lg`"></i>
          <span v-if="name">
            {{ $translate(`admin.table.title.${name.toLowerCase()}`, label) }}
          </span>
        </div>
        <div class="button-container">
          <slot name="header-buttons" />
          <Button
            v-if="exportable"
            class="hidden md:inline-flex p-button-outlined ml-2"
            :class="headerButtonsStyle"
            icon="fad fa-external-link"
            :label="$translate('admin.generic.action.export')"
            @click="doExport()"
            :disabled="!value?.length"
          />
          <Button
            v-if="!isDesktop && showHandleResponsiveLayout"
            class="p-button-sm p-button-secondary ml-2"
            :class="headerButtonsStyle"
            :label="$translate('admin.generic.view')"
            :icon="`fad ${handlerResponsiveLayout('icon', refResponsiveLayout)}`"
            @click="handlerResponsiveLayout('handle', refResponsiveLayout)"
          />
        </div>
      </div>
    </template>
    <template #loading>
      <div class="font-bold text-center">
        {{ $translate('admin.generic.loading') }}
      </div>
    </template>
    <template #empty>
      <div class="grid grid-nogutter text-center">
        <OLottie v-if="showLottie" :name="lottieName" />
        <div class="col-12 my-2 text-center font-bold">
          {{ $translate('admin.generic.empty.results') }}
        </div>
      </div>
    </template>
    <Column
      :selectionMode="selectionMode === true ? 'multiple' : selectionMode"
      headerStyle="width: 3rem;"
      v-if="selectionMode"
    ></Column>
    <Column :expander="expander" v-if="expander" class="w-3 text-center" />
    <template v-if="$slots['table-expansion']" #expansion="el">
      <slot name="table-expansion" :data="el.data" :index="el.index" />
    </template>
    <ColumnGroup type="header" v-if="$slots['column-group']">
      <slot name="column-group" />
    </ColumnGroup>
    <slot name="content" />
    <ODialogExport
      v-if="$modal.isVisible('ODialogExport') && exportable"
      :results="valueCopy"
      :useApi="useApi"
      :exportFilename="$attrs.exportFilename"
      :exportMode="exportMode"
      :currencyInExport="currencyInExport"
      :hideSavedExport="hideSavedExport"
      :hideButtonAmountInteger="hideButtonAmountInteger"
      translator
    />
  </DataTable>
</template>
<script>
import { useSettingsStore } from '@/store/settings.js'

export default {
  name: 'OTable',
  props: {
    showLottie: { type: Boolean, default: () => true },
    useApi: { type: Boolean, default: () => false },
    storeSession: { type: Boolean, default: () => false },
    exportMode: { type: String, default: () => 'all' },
    exportable: { type: Boolean, default: () => false },
    defaultExportKeys: { type: Array, default: () => [] },
    lottieName: { type: String, default: () => null },
    name: { type: String, default: () => null },
    label: { type: String, default: () => '' },
    icon: { type: String, default: () => null },
    dynamicColumns: { type: Array, default: () => null },
    translator: { type: Boolean, default: () => true },
    currencyKey: { type: String },
    currencyInExport: { type: Boolean, default: () => true },
    hideSavedExport: { type: Boolean, default: () => false },
    hideButtonAmountInteger: { type: Boolean, default: () => false },
    value: { type: Array, required: true },
    paginator: { type: Boolean, default: () => true },
    loading: { type: Boolean },
    rowsPerPageOptions: { type: Array, default: () => [50, 100, 250, 500] },
    responsiveLayout: { type: String, default: () => 'stack' },
    showHandleResponsiveLayout: { type: Boolean, default: () => true },
    filtersModel: { type: Object, default: () => null },
    selectionMode: { type: [String, Boolean], default: () => false },
    headerButtonsStyle: { type: String, default: () => '' }
  },
  data() {
    return {
      useSettingsStore: useSettingsStore(),
      refResponsiveLayout: this.responsiveLayout,
      table: { resultsLimit: 20 },
      expandedRows: [],
      lottie: null,
      filters: this.filtersModel ? { ...this.filtersModel } : null,
      selectedColumns: [],
      valueCopy: null
    }
  },
  computed: {
    expander() {
      return !!this.$slots['table-expansion']
    },
    hasHeader() {
      return (
        this.name ||
        this.icon ||
        this.exportable ||
        !!this.$slots['table-header'] ||
        !!this.$slots['header-buttons'] ||
        (this.showHandleResponsiveLayout && !this.isDesktop)
      )
    }
  },
  methods: {
    onToggle({ value }) {
      this.selectedColumns = this.dynamicColumns.filter((col) => value.includes(col))
      this.$emit('onColumnSelect', { value: this.selectedColumns })
      this.useSettingsStore.updateDynamicColumns({
        page: this.currentPageName,
        value: this.selectedColumns.map((el) => ({ header: el.header }))
      })
    },
    doExport() {
      const currencyKey = this.currencyKey ? this.currencyKey.split('.') : undefined

      const processedData = this.$refs.dt?.processedData || []
      const columns = this.$refs.dt?.columns || []
      const exportKeys = this.defaultExportKeys.length
        ? this.defaultExportKeys
        : columns.filter((el) => el?.props?.field).map((el) => el.props.field)

      this.$modal.open('ODialogExport', {
        processed: processedData,
        defaultExportKeys: exportKeys,
        key: this.currentPageName,
        type: 0,
        translatedLabel: this.getTranslatedLabel(columns),
        amountCurrencyMap: currencyKey
          ? this.getAmountCurrencyMap(currencyKey, processedData)
          : undefined,
        results: this.valueCopy
      })
    },
    getTranslatedLabel(columns = []) {
      // missing expansion labels and columns without field props, but we use the translator before export
      return columns
        .filter((el) => el.props.field)
        .map((el) => ({ key: el.props.field, value: el.props.header }))
    },
    getAmountCurrencyMap(currencyKey, processedData) {
      return processedData.map((el) => {
        let currency
        if (currencyKey.length === 1) currency = el[currencyKey[0]]
        if (currencyKey.length === 2) currency = el[currencyKey[0]][currencyKey[1]]
        return currency
      })
    },
    handlerResponsiveLayout(type, value) {
      const newValue = value === 'stack' ? 'scroll' : 'stack'
      if (type === 'handle') {
        this.refResponsiveLayout = newValue
        this.useSettingsStore.updateResponsiveTables({
          page: this.currentPageName,
          value: newValue
        })
      } else if (type === 'icon') {
        return value === 'stack' ? 'fa-chart-bar' : 'fa-arrows-left-right-to-line'
      }
    },
    handlerDymanicColumns() {
      if (!this.dynamicColumns) return

      const tmp = this.useSettingsStore.getDynamicColumns(this.currentPageName)
      this.selectedColumns = tmp
        ? tmp.map((el) => this.dynamicColumns.find((it) => it.header === el.header)).filter(Boolean)
        : this.dynamicColumns.filter((el) => el.selected === true)

      this.$emit('onColumnSelect', { value: this.selectedColumns })
    }
  },
  created() {
    this.handlerDymanicColumns()
  },
  mounted() {
    if (!this.isDesktop && this.showHandleResponsiveLayout) {
      const responsiveTable = this.useSettingsStore.getResponsiveTables(this.currentPageName)
      if (responsiveTable) {
        this.refResponsiveLayout = responsiveTable
      }
    }
    // copia immutabile dei dati per export
    this.valueCopy = [...this.value]
  }
}
</script>

<style lang="scss">
#o-table {
  &.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(.p-datatable-tbody)
    .p-datatable-tbody
    > tr
    > td {
    border-width: 1px;
    &:has(.p-column-title) {
      @media screen and (max-width: 991px) {
        width: 100% !important;
      }
    }
  }
  .header-container {
    position: relative;
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: end;
    flex-wrap: wrap;
    row-gap: 0.5rem;
  }

  .table-title {
    display: flex;
    align-items: center;
    font-weight: bolder;
    font-size: 1.3rem;
  }
}
</style>
