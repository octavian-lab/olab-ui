import { defineStore } from "pinia";

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        panels: {},
        fastfilters: {},
        responsiveTables: {},
        globalExportTemplates: {},
    }),
    getters: {
        getFastfilters: (state) => {
            return state.fastfilters;
        },
        getResponsiveTables: (state) => (page) => {
            if (!page) {
                console.warn("ALERT! -- page -- parameter is required");
                return;
            }
            const tmp = state.responsiveTables[`responsive-table-${page}`];
            if (tmp) return tmp;
            return undefined;
        },
        getGlobalExportTemplates: (state) => (page) => {
            if (!page) {
                console.warn("ALERT! -- page -- parameter is required");
                return;
            }
            return state.globalExportTemplates[`global-export-templates-${page}`];
        },
        getStoredPanelByName: (state) => (page) => {
            if (!page) {
                console.warn("ALERT! -- page -- parameter is required");
                return;
            }
            const tmp = state.panels[`panel-collapsed-${page}`];
            if (tmp) return tmp;
            return false;
        },
    },
    actions: {
        updateFastfilters({ page, value }) {
            if (!this.fastfilters[page]) this.fastfilters[page] = [];
            // Se il filtro è gia presente alla fine esco
            if (this.fastfilters[page].includes(value)) {
                this.fastfilters[page] = this.fastfilters[page].filter((flt) => flt !== value);
                return;
            }
            // Limito max 3 filtri rapidi
            if (this.fastfilters[page].length === 3) {
                this.fastfilters[page].pop();
            }
            // Inserimento element
            if (!this.fastfilters[page].includes(value)) {
                this.fastfilters[page].unshift(value);
            }
        },
        updateResponsiveTables({ page, value }) {
            this.responsiveTables[`responsive-table-${page}`] = value;
        },
        saveGlobalExportTemplates({ page, value }) {
            let templates = this.globalExportTemplates[`global-export-templates-${page}`];
            if (!templates) {
                this.globalExportTemplates[`global-export-templates-${page}`] = [];
            }
            templates = this.globalExportTemplates[`global-export-templates-${page}`];
            if (templates.length < 10) {
                const obj = {
                    value: value,
                    label: `${page} - ${templates.length}`,
                };
                this.globalExportTemplates[`global-export-templates-${page}`].push(obj);
            }
        },
        updateGlobalExportTemplates({ page, index, value }) {
            const templates = this.globalExportTemplates[`global-export-templates-${page}`];
            if (templates?.length > 0) {
                this.globalExportTemplates[`global-export-templates-${page}`][index].label = value;
            }
        },
        deleteGlobalExportTemplates({ page, index }) {
            const templates = this.globalExportTemplates[`global-export-templates-${page}`];
            if (templates?.length > 0) {
                this.globalExportTemplates[`global-export-templates-${page}`].splice(index, 1);
            }
        },
        updateStoredPanels({ page, value }) {
            if (typeof value === "boolean") {
                this.panels[`panel-collapsed-${page}`] = value;
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: `olab-ui-${localStorage.getItem('site')}:settings`,
                storage: localStorage,
            },
        ],
    },
});