<template>
  <Dialog
    id="dialog-search"
    :dismissableMask="false"
    modal
    :style="{ width: useApi ? '900px' : '700px' }"
    :visible="$modal.isVisible($options.name)"
    :breakpoints="{ '960px': '75vw', '640px': '95%' }"
    @update:visible="$modal.close()"
  >
    <template #header>
      <div class="dialog-title">
        <i class="fad fa-floppy-disk-circle-arrow-right mr-3" />
        <span>{{ $translate('admin.title.stored.searches') }}</span>
      </div>
    </template>
    <div class="p-grid">
      <div class="col-12 mt-3">
        <OPageSettingApi
          v-if="useApi"
          mode="filter"
          :results="$modal.data.list"
          @onUseTemplate="$emit('onUseTemplate', $event)"
          @onAddTemplate="doAddTemplateApi($event)"
          @onEditTemplate="doEditTemplateApi($event)"
          @onDeleteTemplate="doDeleteTemplateApi($event)"
        />

        <OPageSettingStore
          v-if="!useApi"
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
import { useSettingsStore } from '@/store/settings.js'
import OPageSettingApi from '@/components/OPageSettingApi.vue'
import OPageSettingStore from '@/components/OPageSettingStore.vue'

export default {
  name: 'ODialogStoredSearches',
  components: { OPageSettingApi, OPageSettingStore },
  inject: ['query'],
  props: {
    useApi: { type: Boolean, default: () => false }
  },
  data() {
    return {
      useSettingsStore: useSettingsStore(),
      API: null
    }
  },
  methods: {
    async doSearchTemplate() {
      try {
        const { data } = await this.API.pagesetting.search({
          key: this.$modal.data.key,
          type: this.$modal.data.type
        })
        data.data.forEach((el) => {
          el.value = JSON.parse(el.value)
        })
        this.$modal.data.list = data.data
      } catch (e) {
        this.toast('error', e)
        console.log(e)
      }
    },
    async doAddTemplateApi(mode) {
      const json = {
        key: this.$modal.data.key,
        name: `${this.$modal.data.key} - ${this.$modal.data.list.length}`,
        value: JSON.stringify(this.query),
        mode: mode,
        type: this.$modal.data.type
      }

      try {
        await this.API.pagesetting.add(json)
        await this.doSearchTemplate()
        this.toast('success', 'add.search')
      } catch (e) {
        this.toast('error', e)
        console.log(e)
      }
    },
    doAddTemplateStore() {
      this.useSettingsStore.saveSearchTemplates({
        page: this.currentPageName,
        value: this.query
      })
    },
    async doEditTemplateApi({ data, name, mode }) {
      const json = {
        name: name,
        mode: mode
      }

      try {
        await this.API.pagesetting.edit(data.id, json)
        await this.doSearchTemplate()
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
      })
    },
    async doDeleteTemplateApi(id) {
      try {
        await this.API.pagesetting.delete(id)
        await this.doSearchTemplate()
        this.toast('success', 'delete.search')
      } catch (e) {
        this.toast('error', e)
        console.log(e)
      }
    },
    doDeleteTemplateStore(index) {
      this.useSettingsStore.deleteSearchTemplates({
        page: this.currentPageName,
        index
      })
    }
  },
  created() {
    if (this.useApi) {
      const site = localStorage.getItem('site')
      import(`../../api/${site}/index.js`).then((module) => {
        this.API = module.default
        this.doSearchTemplate({ key: this.$modal.data.key, type: this.$modal.data.type })
      })
    }
  },
  mounted() {
    if (!this.useApi) {
      this.$modal.data.list = this.useSettingsStore.getSearchTemplates(this.currentPageName)
    }
  }
}
</script>
<style scoped>
:deep(.p-datatable) .p-datatable-footer {
  padding: 0.5rem;
}
</style>
