import { defineStore } from "pinia";

export const useQueryStore = defineStore(`olab-ui-${localStorage.getItem('site')}:query`, {
    state: () => ({
        saved: {}
    }),
    getters: {
        getQueryPerPage: (state) => (page) => {
            const tmp = state.saved[page];
            if (tmp) return tmp;
            return [];
        },
        getQuery: (state) => (resource) => {
            if (state[resource]) {
                return state[resource];
            }
        },
    },
    actions: {
        updateQuerySearchName({ page, id, newLabel }) {
            const el = this.saved[page].find((el) => el.id === id);
            if (el) el.label = newLabel;
        },
        saveQueryPerPage({ page, value, label = page }) {
            // Inizializzo con array vuoto in caso non sia mai stato aggiunto nulla.
            if (!this.saved[page]) this.saved[page] = [];

            const querySearch = {
                id: new Date().getTime(),
                label,
                value: { ...value },
                dateCreated: new Date(),
            };

            // Check  label già esistente
            const sameLabelArray = this.saved[page].filter((item) => item.label.startsWith(label));
            if (sameLabelArray.length > 0) {
                querySearch.label = `${label} - ${sameLabelArray.length}`;
            }

            // Push object lavorato
            this.saved[page].push(querySearch);
        },
        deleteQueryPerPage({ page, id }) {
            this.saved[page] = this.saved[page].filter((el) => el.id !== id);
        },
        updateQuery({ resource, id }) {
            this.state[resource] = id;
        },
        deleteQuery(resource) {
            this.state[resource] = undefined;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: `olab-ui-${localStorage.getItem('site')}:query`,
                storage: localStorage,
            },
        ],
    },
});