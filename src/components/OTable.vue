<template>
  <DataTable
    :value="value"
    paginator-position="both"
    :rows="50"
    :currentPageReportTemplate="getDtTemplate('currentPageReport')"
    :paginatorTemplate="getDtTemplate('paginator')"
    class="p-datatable-sm p-datatable-striped dt-text-responsive"
    ref="dt"
    :filterDisplay="filters ? 'row' : null"
    showGridlines
    removableSort
    autoLayout
    :paginator="paginator"
    :loading="loading || $loading.isLoading('search')"
    :rowClass="rowClass"
    v-model:expandedRows="expandedRows"
    :rowsPerPageOptions="rowsPerPageOptions"
    :responsiveLayout="refResponsiveLayout"
    sortMode="multiple"
    v-model:filters="filters"
    :key="refResponsiveLayout"
  >
    <template #header v-if="hasHeader">
      <div
        :class="[
          'header-container',
          name || icon || $slots['table-header'] ? 'p-jc-between' : 'p-jc-end'
        ]"
      >
        <slot name="table-header" />
        <div class="table-title" v-if="name || icon">
          <i v-if="icon" :class="`fad ${icon} p-mr-3 fa-lg`"></i>
          <span v-if="name">
            {{ $translate(`admin.table.title.${name.toLowerCase()}`, label) }}
          </span>
        </div>
        <div class="button-container">
          <slot name="header-buttons" />
          <Button
            v-if="exportable"
            class="p-d-none p-d-md-flex p-button-outlined p-ml-2"
            icon="fad fa-external-link"
            :label="$translate('admin.generic.action.export')"
            @click="doExport($event)"
          />
          <Button
            v-if="!$isDesktop && showHandleResponsiveLayout"
            class="p-ml-2"
            :icon="`fad ${handlerResponsiveLayout('icon', refResponsiveLayout)}`"
            v-tooltip.top="handlerResponsiveLayout('label', refResponsiveLayout)"
            @click="handlerResponsiveLayout('handle', refResponsiveLayout)"
          />
        </div>
      </div>
    </template>
    <template #loading>
      <div class="p-text-bold cx">
        {{ $translate('admin.generic.loading') }}
      </div>
    </template>
    <template #empty>
      <div class="p-grid cx">
        <!--        <OLottie :name="lottieName" />-->
        <div class="p-col-12 cx p-text-bold">
          {{ $translate('admin.generic.empty.results') }}
        </div>
      </div>
    </template>
    <Column
      :selectionMode="selectionMode === true ? 'multiple' : selectionMode"
      headerStyle="width: 3rem;"
      v-if="selectionMode"
    ></Column>
    <Column :expander="expander" v-if="expander" class="w-3 cx" />
    <template #expansion="el">
      <slot name="table-expansion" :data="el.data" :index="el.index" />
    </template>
    <ColumnGroup type="header" v-if="$slots['column-group']">
      <slot name="column-group" />
    </ColumnGroup>
    <slot name="content" />
    <DialogGlobalExport />
  </DataTable>
</template>
<script>
export default {
  name: 'OTable',
  props: {
    // PROPS OLAB
    exportable: {
      type: Boolean,
      default: () => false
    },
    defaultExportKeys: {
      type: Array,
      default: () => []
    },
    lottieName: {
      type: String,
      default: () => null
    },
    name: {
      type: String,
      default: () => null
    },
    label: {
      type: String,
      default: () => ''
    },
    icon: {
      type: String,
      default: () => null
    },
    // PROPS DI PRIMEVUE
    value: {
      type: Array,
      required: true
    },
    paginator: {
      type: Boolean,
      default: () => true
    },
    loading: {
      type: Boolean
    },
    rowClass: {
      type: Function,
      default: () => null
    },
    rowsPerPageOptions: {
      type: Array,
      default: () => [50, 100, 250, 500]
    },
    responsiveLayout: {
      type: String,
      default: () => 'stack'
    },
    showHandleResponsiveLayout: {
      type: Boolean,
      default: () => true
    },
    filtersModel: {
      type: Object,
      default: () => null
    },
    style: {
      type: String,
      default: () => null
    },
    selectionMode: {
      type: [String, Boolean],
      default: () => false
    }
  },
  data() {
    return {
      refResponsiveLayout: this.responsiveLayout,
      table: { resultsLimit: 20 },
      expandedRows: [],
      lottie: null,
      filters: this.filtersModel ? { ...this.filtersModel } : null
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
        (this.showHandleResponsiveLayout && !this.$isDesktop)
      )
    }
  },
  methods: {
    getDtTemplate(type) {
      switch (type) {
        case 'currentPageReport':
          return `
                 ${this.$translate('admin.generic.showing')} {first}
                 ${this.$translate('admin.generic.showing.to')} {last}
                 ${this.$translate('admin.generic.showing.of')} {totalRecords}`
        case 'paginator':
          return 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
      }
    },
    doExport() {
      const processedData = this.$refs.dt.processedData
      if (!this.$modal.id) {
        this.doPrepareExport(processedData, this.defaultExportKeys)
      }
    },
    handlerResponsiveLayout(type, value) {
      if (value === 'stack') {
        switch (type) {
          case 'handle':
            this.refResponsiveLayout = 'scroll'
            this.$store.dispatch('updateResponsiveTables', {
              page: this.currentPageName,
              value: 'scroll'
            })
            break
          case 'icon':
            return 'fa-chart-bar'
          case 'label':
            return 'Stack'
        }
      } else if (value === 'scroll') {
        switch (type) {
          case 'handle':
            this.refResponsiveLayout = 'stack'
            this.$store.dispatch('updateResponsiveTables', {
              page: this.currentPageName,
              value: 'stack'
            })
            break
          case 'icon':
            return 'fa-arrows-left-right-to-line'
          case 'label':
            return 'Scroll'
        }
      }
    }
  },
  mounted() {
    if (!this.$isDesktop && this.showHandleResponsiveLayout) {
      const responsiveTable = this.$store.getters.responsiveTables(this.currentPageName)
      if (responsiveTable) {
        this.refResponsiveLayout = responsiveTable
      }
    }
  }
}
</script>

<style scoped lang="scss">
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

//TODO: INSERIRE QUANDO ABBIAMO MERGE COMPLETO CON NUOVI PANEL
////  Border Color Override per tabelle
//.p-datatable .p-datatable-header,
//.p-datatable .p-datatable-thead > tr > th,
//.p-datatable .p-datatable-tbody > tr > td,
//.p-datatable .p-datatable-tfoot > tr > td{
//    border-color: #cbcbcb !important;
//}
//.p-datatable .p-datatable-thead > tr:last-child,
//.p-datatable .p-datatable-tbody > tr:last-child,
//.p-datatable .p-datatable-tfoot > tr:last-child,{
//    border-right-width: 0
//}
//.p-datatable > .p-paginator-top > .p-paginator{
//    border-radius: 0;
//    border: 1px solid #cbcbcb;
//    border-bottom-width: 0;
//    border-top-width: 0;
//}
//.p-datatable > .p-datatable-header ~ .p-paginator-top > .p-paginator{
//    border-top: 1px solid #cbcbcb;
//}
//.p-datatable > .p-datatable-header ~ .p-paginator-top > .p-paginator{
//    border-top: 1px solid #cbcbcb;
//}
</style>
