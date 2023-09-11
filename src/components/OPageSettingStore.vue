<template>
  <component
    :is="mode === 'export' ? 'Panel' : 'div'"
    :toggleable="mode === 'export' ? true : false"
    :collapsed="mode === 'export' ? true : false"
  >
    <template v-if="mode === 'export'" #header>
      <div class="font-bold">
        <i class="fad fa-floppy-disk-circle-arrow-right mr-2"></i>
        <span>{{ $translate('admin.title.stored.export') }}</span>
      </div>
    </template>

    <div v-if="mode === 'filter'">
      <div class="mb-3 flex align-items-center">
        <i class="fad fa-triangle-exclamation text-warning fa-xl mr-2" />
        <span v-if="mode === 'export'" class="font-bold">
          {{ $translate('admin.global.page.setting.export.warning.text') }}
        </span>
        <span v-if="mode === 'filter'" class="font-bold">
          {{ $translate('admin.global.page.setting.filter.warning.text') }}
        </span>
      </div>
      <div class="mb-3 flex align-items-center">
        <i class="fad fa-circle-info fa-xl mr-2" />
        <span v-if="mode === 'export'">
          {{ $translate('admin.global.page.setting.export.info.text') }}
        </span>
        <span v-if="mode === 'filter'">
          {{ $translate('admin.global.page.setting.filter.info.text') }}
        </span>
      </div>
    </div>

    <DataTable :value="results" v-model:expandedRows="expandedRows">
      <template #empty>
        <div class="col-12 cx font-bold">
          {{ $translate('admin.generic.empty.results') }}
        </div>
      </template>

      <template v-if="mode === 'filter'" #header>
        <div class="flex justify-content-between align-items-center">
          <i class="ml-3 fad fa-floppy-disk-circle-arrow-right fa-3x" />

          <Button
            :disabled="$modal.data.list >= 10"
            icon="fad fa-plus-circle"
            :label="$translate('admin.filter.action.save.last.query')"
            @click="$emit('onAddTemplate')"
          />
        </div>
      </template>

      <template v-if="mode === 'filter'" #expansion="data">
        <div class="flex justify-content-between align-items-center">
          <div class="font-bold px-3">{{ $translate('admin.generic.value') }}</div>
          <div class="px-3">{{ data.data.value }}</div>
        </div>
      </template>

      <Column v-if="mode === 'filter'" expander class="w-3 text-center" />
      <Column field="label" :header="$translate('admin.generic.label')">
        <template #body="{ index, data }">
          <div v-if="$modal.data.templateEditCheck !== index" class="font-bold">
            {{ data.label }}
          </div>
          <InputText
            v-else-if="$modal.data.templateEditCheck === index"
            v-model="$modal.data.templateEditName"
            :placeholder="$translate('admin.generic.enter.label')"
          />
        </template>
      </Column>
      <Column v-if="mode === 'export'" field="value" :header="$translate('admin.generic.value')">
        <template #body="{ data }">
          <div v-if="mode === 'export'">
            <span v-for="(el, i) in data.value" :key="i">
              {{ `${checkTranslate(el)}; ` }}
            </span>
          </div>
          <div v-if="mode === 'filter'">
            {{ data.value }}
          </div>
        </template>
      </Column>
      <Column
        field="dateCreated"
        :header="$translate('admin.generic.date.created')"
        headerClass="cx"
        bodyClass="cx"
      >
        <template #body="{ data }">
          {{ data.dateCreated ? $filters.asDate(data.dateCreated) : '-' }}
        </template>
      </Column>
      <Column :header="$translate('admin.generic.operations')" headerClass="w-10" bodyClass="w-10">
        <template #body="{ index, data }">
          <div v-if="$modal.data.templateEditCheck !== index">
            <SplitButton
              icon="fad fa-arrow-down"
              class="p-button-sm mr-3"
              :label="$translate('admin.generic.action.use')"
              @click="$emit('onUseTemplate', data.value)"
              :model="[
                {
                  label: $translate('admin.generic.action.edit'),
                  icon: 'fad fa-edit',
                  command: () => {
                    doHandleEditTemplate(index, data.label)
                  }
                },
                {
                  label: $translate('admin.generic.action.delete'),
                  icon: 'fad fa-trash',
                  command: () => {
                    $emit('onDeleteTemplate', data.id)
                  }
                }
              ]"
            />
          </div>

          <div v-else-if="$modal.data.templateEditCheck === index">
            <Button
              icon="fad fa-save"
              class="p-button-sm mr-3"
              :label="$translate('admin.generic.action.save')"
              :disabled="!$modal.data.templateEditName"
              @click="doHandleEditTemplate(index, undefined, 'edit')"
            />
            <Button
              icon="fad fa-xmark"
              class="p-button-danger p-button-sm p-button-outlined"
              @click="doHandleEditTemplate()"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </component>
</template>

<script>
export default {
  name: 'OPageSettingStore',
  inject: {
    checkTranslate: { default: undefined }
  },
  props: {
    mode: { type: String, default: () => 'export' },
    results: { type: Array, default: () => [] }
  },
  data() {
    return {
      expandedRows: []
    }
  },
  methods: {
    doHandleEditTemplate(index, label, mode) {
      if (mode === 'edit') {
        this.$emit('onEditTemplate', { index, name: this.$modal.data.templateEditName })
        this.$modal.data.templateEditCheck = null
        this.$modal.data.templateEditName = null
        return
      }

      if (typeof index !== 'number') {
        this.$modal.data.templateEditCheck = null
        this.$modal.data.templateEditName = null
        return
      }

      this.$modal.data.templateEditCheck = index
      this.$modal.data.templateEditName = label
    }
  }
}
</script>
