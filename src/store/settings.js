import { defineStore } from 'pinia'
const STORE_TEMPLATE_LIMIT = 10

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    panels: {},
    fastfilters: {},
    responsiveTables: {},
    globalExportTemplates: {},
    searchTemplates: {}
  }),
  getters: {
    getFastfilters: (state) => {
      return state.fastfilters
    },
    getResponsiveTables: (state) => (page) => {
      if (!page) {
        console.warn('ALERT! -- page -- parameter is required')
        return
      }
      const tmp = state.responsiveTables[`responsive-table-${page}`]
      if (tmp) return tmp
      return undefined
    },
    getGlobalExportTemplates: (state) => (page) => {
      if (!page) {
        console.warn('ALERT! -- page -- parameter is required')
        return
      }
      const templates = state.globalExportTemplates[`global-export-templates-${page}`]
      if (!templates) {
        state.globalExportTemplates[`global-export-templates-${page}`] = []
      }
      return state.globalExportTemplates[`global-export-templates-${page}`]
    },
    getSearchTemplates: (state) => (page) => {
      if (!page) {
        console.warn('ALERT! -- page -- parameter is required')
        return
      }
      const templates = state.searchTemplates[`search-templates-${page}`]
      if (!templates) {
        state.searchTemplates[`search-templates-${page}`] = []
      }
      return state.searchTemplates[`search-templates-${page}`]
    },
    getStoredPanelByName: (state) => (page) => {
      if (!page) {
        console.warn('ALERT! -- page -- parameter is required')
        return
      }
      const tmp = state.panels[`panel-collapsed-${page}`]
      if (tmp) return tmp
      return false
    }
  },
  actions: {
    updateFastfilters({ page, value }) {
      if (!this.fastfilters[page]) this.fastfilters[page] = []
      // Se il filtro è gia presente alla fine esco
      if (this.fastfilters[page].includes(value)) {
        this.fastfilters[page] = this.fastfilters[page].filter((flt) => flt !== value)
        return
      }
      // Limito max 3 filtri rapidi
      if (this.fastfilters[page].length === 3) {
        this.fastfilters[page].pop()
      }
      // Inserimento element
      if (!this.fastfilters[page].includes(value)) {
        this.fastfilters[page].unshift(value)
      }
    },
    updateResponsiveTables({ page, value }) {
      this.responsiveTables[`responsive-table-${page}`] = value
    },
    saveGlobalExportTemplates({ page, value }) {
      const templates = this.globalExportTemplates[`global-export-templates-${page}`]
      if (templates.length < STORE_TEMPLATE_LIMIT) {
        const obj = {
          value: value,
          label: `${page} - ${templates.length}`,
          dateCreated: new Date()
        }
        this.globalExportTemplates[`global-export-templates-${page}`].push(obj)
      } else {
        throw new Error(
          `Template store limit reached, free up space by removing items. Limit: ${STORE_TEMPLATE_LIMIT}`
        )
      }
    },
    updateGlobalExportTemplates({ page, index, value }) {
      const templates = this.globalExportTemplates[`global-export-templates-${page}`]
      if (templates.length > 0) {
        this.globalExportTemplates[`global-export-templates-${page}`][index].label = value
      }
    },
    deleteGlobalExportTemplates({ page, index }) {
      const templates = this.globalExportTemplates[`global-export-templates-${page}`]
      if (templates.length > 0) {
        this.globalExportTemplates[`global-export-templates-${page}`].splice(index, 1)
      }
    },
    saveSearchTemplates({ page, value }) {
      const templates = this.searchTemplates[`search-templates-${page}`]
      if (templates.length < STORE_TEMPLATE_LIMIT) {
        const obj = {
          value: value,
          label: `${page} - ${templates.length}`,
          dateCreated: new Date()
        }
        this.searchTemplates[`search-templates-${page}`].push(obj)
      } else {
        throw new Error(
          `Template store limit reached, free up space by removing items. Limit: ${STORE_TEMPLATE_LIMIT}`
        )
      }
    },
    updateSearchTemplates({ page, index, value }) {
      const templates = this.searchTemplates[`search-templates-${page}`]
      if (templates.length > 0) {
        this.searchTemplates[`search-templates-${page}`][index].label = value
      }
    },
    deleteSearchTemplates({ page, index }) {
      const templates = this.searchTemplates[`search-templates-${page}`]
      if (templates.length > 0) {
        this.searchTemplates[`search-templates-${page}`].splice(index, 1)
      }
    },
    updateStoredPanels({ page, value }) {
      if (typeof value === 'boolean') {
        this.panels[`panel-collapsed-${page}`] = value
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: `olab-ui-${localStorage.getItem('site')}:settings`,
        storage: localStorage
      }
    ]
  }
})
