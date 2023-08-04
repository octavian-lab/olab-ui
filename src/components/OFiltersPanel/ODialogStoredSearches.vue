<template>
    <Dialog
        :dismissableMask="false"
        modal
        :style="{ width: '700px' }"
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
            <div class="col-12 flex align-items-center">
                <i class="fad fa-triangle-exclamation text-warning fa-xl mr-2" />
                <span class="font-bold ml-2">
                    {{ $translate("admin.filter.stored.searches.warning") }}.
                </span>
            </div>
            <div class="col-12 flex justify-content-between align-items-center">
                <i class="fad fa-circle-info fa-xl mr-2" />
                <span class="ml-2">
                    {{ $translate("admin.filter.stored.searches.info") }}
                </span>
            </div>
            <div class="col-12 mt-3">
                <DataTable
                    striped-rows
                    removable-sort
                    class="p-datatable-sm"
                    :value="$modal.data.list"
                >
                    <template #header>
                        <div class="flex justify-content-between">
                            <i class="ml-3 fad fa-floppy-disk-circle-arrow-right fa-3x" />
                            <Button
                                icon="fad fa-plus-circle"
                                @click="doSaveSelectedQuery()"
                                :disabled="maxLimitReached"
                                :label="
                                    $translate('admin.filter.action.save.last.query')
                                "
                            />
                        </div>
                    </template>
                    <template #empty>
                        <div class="p-3 text-center">
                            <span class="font-bold">{{
                                $translate("admin.filter.stored.searches.empty")
                            }}</span>
                        </div>
                    </template>
                    <Column
                        :header="$translate('admin.generic.label')"
                        field="label"
                        sortable
                        body-class="pl-5 w-40"
                    >
                        <template #body="el">
                            <InputText
                                ref="newLabel"
                                @keyup.enter="doHandleEdit({ label: savedSearch.newLabel }, true)"
                                v-model="savedSearch.newLabel"
                                class="animate__animated animate__fadeIn animate__fast"
                                v-if="savedSearch.selected === el.data.id"
                            />
                            <div
                                class="font-bold text-lg animate__animated animate__fadeIn animate__fast"
                                v-else
                            >
                                {{ el.data.label }}
                            </div>
                        </template>
                    </Column>
                    <Column
                        :header="$translate('admin.generic.date.created')"
                        sortable
                        field="dateCreated"
                        body-class="text-center"
                    >
                        <template #body="el">
                            <span>
                                {{
                                    el.data.dateCreated ? $filters.asDate(el.data.dateCreated) : "-"
                                }}
                            </span>
                        </template>
                    </Column>
                    <Column
                        :header="$translate('admin.generic.operations')"
                        body-class="w-25"
                    >
                        <template #body="{ data }">
                            <div
                                class="flex justify-content-evenly"
                                v-if="savedSearch.selected === data.id"
                            >
                                <Button
                                    icon="fad fa-save"
                                    class="p-button-sm"
                                    :label="$translate('admin.generic.action.save')"
                                    @click="doHandleEdit({ label: savedSearch.newLabel }, true)"
                                />
                                <Button
                                    icon="fad fa-xmark"
                                    class="p-button-danger p-button-sm p-button-outlined"
                                    @click="doHandleEdit(data)"
                                />
                            </div>
                            <div class="flex justify-content-evenly" v-else>
                                <Button
                                    icon="fas fa-arrow-up"
                                    class="p-button-outlined p-button-sm"
                                    :label="$translate('admin.generic.action.use')"
                                    @click="doHandleUse(data.value)"
                                />
                                <Button
                                    icon="fad fa-edit"
                                    class="p-button-sm"
                                    @click="doHandleEdit(data)"
                                    v-tooltip.bottom="{
                                        value: $translate('admin.action.edit.label'),
                                    }"
                                />
                                <Button
                                    icon="fad fa-trash"
                                    class="p-button-danger p-button-sm"
                                    @click="doHandleDelete(data)"
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Dialog>
</template>

<script>
import { useQueryStore } from "@/store/query.js";
export default {
    name: "ODialogStoredSearches",
    emits: ["onUseSavedQuery"],
    inject: ["query"],
    data() {
        return {
            useQueryStore: useQueryStore(),
            savedSearch: {
                selected: null,
                newLabel: "",
            },
        };
    },
    computed: {
        maxLimitReached() {
            return this.$modal.data.list.length >= 10;
        },
    },
    methods: {
        doHandleDelete(data) {
            this.useQueryStore.deleteQueryPerPage({ page: this.$route.path.replaceAll("/", ""), id: data.id });
            this.$toast.add({
                severity: "success",
                summary: this.$translate("admin.generic.operation.completed"),
                detail: this.$translate("admin.filter.stored.search.deleted"),
                life: 900,
            });
        },
        doHandleUse(savedQuery) {
            this.$emit("onUseSavedQuery", savedQuery);
        },
        doSaveSelectedQuery() {
            if (this.maxLimitReached) {
                this.$toast.add({
                    severity: "info",
                    summary: this.$translate("admin.toast.info"),
                    detail: this.$translate(
                        "admin.filter.stored.search.max.limit.reached"
                    ),
                    life: 900,
                });
                return;
            }
            this.useQueryStore.saveQueryPerPage({
                page: this.$route.path.replaceAll("/", ""),
                value: this.query,
            });
        },
        doHandleEdit(data, saveEdit) {
            if (saveEdit) {
                this.useQueryStore.updateQuerySearchName({
                    page: this.$route.path.replaceAll("/", ""),
                    id: this.savedSearch.selected,
                    newLabel: data.label,
                });
                this.savedSearch.selected = null;
                return;
            }

            if (this.savedSearch.selected !== data.id) {
                this.savedSearch.selected = data.id;
                this.savedSearch.newLabel = data.label;

                this.$nextTick(() => {
                    this.$refs.newLabel.$el.focus();
                });
            } else {
                this.savedSearch.selected = null;
            }
        },
    },
};
</script>
<style scoped>
:deep(.p-datatable) .p-datatable-footer {
    padding: 0.5rem;
}
</style>
