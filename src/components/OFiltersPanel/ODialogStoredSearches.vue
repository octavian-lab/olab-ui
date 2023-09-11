<template>
    <Dialog
        id="dialog-search"
        :dismissableMask="false"
        modal
        :style="{ width: api ? '900px' : '700px' }"
        :visible="$modal.isVisible($options.name)"
        :breakpoints="{ '960px': '75vw', '640px': '95%' }"
        @update:visible="$modal.close()"
    >
        <template #header>
            <div class="dialog-title">
                <i class="fad fa-floppy-disk-circle-arrow-right mr-3" />
                <span>{{ $translate("admin.title.stored.searches") }}</span>
            </div>
        </template>
        <div class="p-grid">
            <div class="col-12 mt-3">
                <OPageSettingApi
                    v-if="api"
                    mode="filter"
                    :results="$modal.data.list"
                    @onUseTemplate="$emit('onUseTemplate', $event)"
                    @onAddTemplate="doAddTemplateApi($event)"
                    @onEditTemplate="doEditTemplateApi($event)"
                    @onDeleteTemplate="doDeleteTemplateApi($event)"
                />

                <OPageSettingStore
                    v-if="!api"
                    mode="filter"
                    :results="$modal.data.list"
                    @onUseTemplate="$emit('onUseTemplate', $event)"
                    @onAddTemplate="doAddTemplateStore()"
                    @onEditTemplate="doEditTemplateStore($event)"
                    @onDeleteTemplate="doDeleteTemplateStore($event)"
                />
            </div>
        </div>
    </Dialog>
</template>

<script>
import { useSettingsStore } from "@/store/settings.js";
import OPageSettingApi from "@/components/OPageSettingApi.vue";
import OPageSettingStore from "@/components/OPageSettingStore.vue";
export default {
    name: "ODialogStoredSearches",
    components: { OPageSettingApi, OPageSettingStore },
    inject: {
        query: { default: undefined },
        doSearchTemplate: { default: undefined },
        doAddTemplate: { default: undefined },
        doEditTemplate: { default: undefined },
        doDeleteTemplate: { default: undefined }
    },
    props: {
        api: { type: Boolean, default: () => false },
    },
    data() {
        return {
            useSettingsStore: useSettingsStore(),
        };
    },
    methods: {
        async doAddTemplateApi(mode) {
            try {
                await this.doAddTemplate(this.query, mode)
                this.$modal.data.list = await this.doSearchTemplate({ key: this.$modal.data.key, type: this.$modal.data.type })
                this.toast('success', 'add.search')
            } catch (e) {
                this.toast('error', e)
                console.log(e)
            }
        },
        doAddTemplateStore() {
            this.useSettingsStore.saveSearchTemplates({
                page: this.currentPageName,
                value: this.query,
            });
        },
        async doEditTemplateApi({ data, name, mode }) {
            const json = {
                name: name,
                mode: mode
            }

            try {
                await this.doEditTemplate(data.id, json)
                this.$modal.data.list = await this.doSearchTemplate({ key: this.$modal.data.key, type: this.$modal.data.type })
                this.toast('success', 'edit.search')
            } catch (e) {
                this.toast('error', e)
                console.log(e)
            }
        },
        doEditTemplateStore({ index, name }) {
            this.useSettingsStore.updateSearchTemplates({
                page: this.currentPageName,
                index,
                value: name
            });
        },
        async doDeleteTemplateApi(id) {
            try {
                await this.doDeleteTemplate(id)
                this.$modal.data.list = await this.doSearchTemplate({ key: this.$modal.data.key, type: this.$modal.data.type })
                this.toast('success', 'delete.export')
            } catch (e) {
                this.toast('error', e)
                console.log(e)
            }
        },
        doDeleteTemplateStore(index) {
            this.useSettingsStore.deleteSearchTemplates({
                page: this.currentPageName,
                index
            });
        },
    },
    async mounted() {
        if (this.api) {
            this.$modal.data.list = await this.doSearchTemplate({ key: this.$modal.data.key, type: this.$modal.data.type });
        }
        if (!this.api) {
            this.$modal.data.list = this.useSettingsStore.getSearchTemplates(this.currentPageName)
        }
    }
};
</script>
<style scoped>
:deep(.p-datatable) .p-datatable-footer {
    padding: 0.5rem;
}
</style>
