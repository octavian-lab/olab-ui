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

    <div class="mb-3 flex align-items-center">
      <i class="fad fa-circle-info fa-xl mr-2" />
      <span>
        {{ $translate('admin.global.page.setting.info.text') }}
      </span>
    </div>

    <DataTable
      :value="results"
      autoLayout
      :paginator="results.length > 9"
      :rows="10"
      :paginatorTemplate="getDtTemplate('paginator')"
      v-model:expandedRows="expandedRows"
      :loading="$loading.isLoading('search')"
      stripedRows
    >
      <template #empty>
        <div class="col-12 cx font-bold">
          {{ $translate('admin.generic.empty.results') }}
        </div>
      </template>

      <template v-if="mode === 'filter'" #header>
        <div class="flex justify-content-between align-items-center">
          <i class="ml-3 fad fa-floppy-disk-circle-arrow-right fa-3x" />

          <div>
            <Button
              class="mr-3 p-button-secondary"
              @click="$emit('onAddTemplate', 0)"
              v-tooltip.bottom="$translate('admin.filter.store.search.global')"
              :loading="$loading.isLoading('add')"
            >
              <i class="fad fa-floppy-disk mr-2"></i>
              <i class="fad fa-globe"></i>
            </Button>
            <Button
              class="mr-3"
              @click="$emit('onAddTemplate', 1)"
              v-tooltip.bottom="$translate('admin.filter.store.search.personal')"
              :loading="$loading.isLoading('add')"
            >
              <i class="fad fa-floppy-disk mr-2"></i>
              <i class="fad fa-user"></i>
            </Button>
          </div>
        </div>
      </template>

      <template v-if="mode === 'filter'" #expansion="data">
        <div class="flex justify-content-between align-items-center">
          <div class="font-bold px-3">{{ $translate('admin.generic.value') }}</div>
          <div class="px-3">{{ data.data.value }}</div>
        </div>
      </template>

      <Column v-if="mode === 'filter'" expander class="w-3 text-center" />
      <Column field="name" :header="$translate('admin.generic.name')" bodyClass="cx">
        <template #body="{ index, data }">
          <div v-if="$modal.data.templateEditCheck !== index" class="font-bold">
            {{ data.name }}
          </div>
          <InputText
            v-if="$modal.data.templateEditCheck === index"
            v-model="$modal.data.templateEditName"
            :placeholder="$translate('admin.generic.enter.name')"
            @keyup.enter="doHandleEditTemplate(index, data, 'edit')"
          />
        </template>
      </Column>
      <Column
        v-if="mode === 'export'"
        field="value"
        :header="$translate('admin.generic.value')"
        bodyClass="cx"
      >
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
        field="lastUpdate"
        :header="$translate('admin.generic.last.update')"
        headerClass="cx"
        bodyClass="cx"
      >
        <template #body="{ data }">
          {{ $filters.asDate(data.lastUpdate) }}
        </template>
      </Column>
      <Column field="author" :header="$translate('admin.generic.author')" bodyClass="cx" />
      <Column field="mode" :header="$translate('admin.field.type')" bodyClass="cx">
        <template #body="{ data, index }">
          <div v-if="$modal.data.templateEditCheck !== index" class="font-bold">
            <i
              v-if="data.mode === 0"
              v-tooltip.bottom="$translate('admin.field.type.global')"
              class="fad fa-globe fa-2xl"
            ></i>
            <i
              v-if="data.mode === 1"
              v-tooltip.bottom="$translate('admin.field.type.personal')"
              class="fad fa-user fa-2xl"
            ></i>
          </div>
          <SelectButton
            v-if="$modal.data.templateEditCheck === index"
            v-model="$modal.data.templateEditMode"
            :options="[0, 1]"
            aria-labelledby="basic"
          >
            <template #option="el">
              <i v-if="el.option === 0" class="fad fa-globe"></i>
              <i v-if="el.option === 1" class="fad fa-user"></i>
            </template>
          </SelectButton>
        </template>
      </Column>

      <Column
        :header="$translate('admin.generic.operations')"
        headerClass="w-10 cx"
        bodyClass="w-10 cx"
      >
        <template #body="{ index, data }">
          <div v-if="$modal.data.templateEditCheck !== index">
            <SplitButton
              icon="fas fa-arrow-down"
              class="p-button-sm mr-3"
              :label="$translate('admin.generic.action.use')"
              @click="$emit('onUseTemplate', data.value)"
              :model="[
                {
                  label: $translate('admin.generic.action.edit'),
                  icon: 'fad fa-edit',
                  command: () => {
                    doHandleEditTemplate(index, data)
                  }
                },
                {
                  label: $translate('admin.generic.action.delete'),
                  icon: 'fad fa-trash text-danger',
                  command: () => {
                    $emit('onDeleteTemplate', data.id)
                  },
                  loading: $loading.isLoading('delete')
                }
              ]"
            />
          </div>

          <div v-else-if="$modal.data.templateEditCheck === index" class="flex">
            <Button
              icon="fad fa-save"
              class="p-button-sm mr-3"
              :label="$translate('admin.generic.action.save')"
              :disabled="!$modal.data.templateEditName"
              @click="doHandleEditTemplate(index, data, 'edit')"
              :loading="$loading.isLoading('edit')"
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
  name: 'OPageSetting',
  inject: {
    checkTranslate: { default: () => undefined }
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
    doHandleEditTemplate(index, data, mode) {
      if (mode === 'edit') {
        this.$emit('onEditTemplate', {
          data,
          name: this.$modal.data.templateEditName,
          mode: this.$modal.data.templateEditMode
        })
        this.$modal.data.templateEditCheck = null
        this.$modal.data.templateEditName = null
        this.$modal.data.templateEditName = null
        return
      }

      if (typeof index !== 'number') {
        this.$modal.data.templateEditCheck = null
        this.$modal.data.templateEditName = null
        this.$modal.data.templateEditName = null
        return
      }

      this.$modal.data.templateEditCheck = index
      this.$modal.data.templateEditName = data.name
      this.$modal.data.templateEditMode = data.mode
    }
  }
}
</script>
