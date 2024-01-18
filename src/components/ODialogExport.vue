<template>
  <Dialog
    id="dialog-global-export"
    :dismissableMask="false"
    :style="{ width: '95vw' }"
    :visible="$modal.isVisible($options.name)"
    :breakpoints="{ '960px': '75vw', '640px': '95%' }"
    @update:visible="handleUpdateVisible()"
    position="top"
    modal
    :draggable="false"
  >
    <template #header>
      <div class="dialog-title">
        <i class="fad fa-arrow-down-to-line mr-3"></i>
        <span>{{ $translate('admin.generic.export') }}</span>
      </div>
    </template>
    <div class="grid formgrid fluid">
      <div class="field col-12">
        <OPageSettingApi
          v-if="useApi"
          :results="globalExportTemplates"
          @onUseTemplate="doUseTemplate($event)"
          @onEditTemplate="doEditTemplateApi($event)"
          @onDeleteTemplate="doDeleteTemplateApi($event)"
        />

        <OPageSettingStore
          v-if="!useApi"
          :results="globalExportTemplates"
          @onUseTemplate="doUseTemplate($event)"
          @onEditTemplate="doEditTemplateStore($event)"
          @onDeleteTemplate="doDeleteTemplateStore($event)"
        />
      </div>

      <div class="field col-12">
        <Panel :toggleable="true" v-model:collapsed="collapsed">
          <template #header>
            <div class="font-bold">
              <i class="fad fa-filters mr-2"></i>
              <span>{{ $translate('admin.generic.fields') }}</span>
            </div>
          </template>
          <template #icons>
            <Button
              class="mr-3 p-button-info"
              :label="$translate('admin.generic.select.all.fields')"
              :icon="checkFilters"
              :disabled="selectKeys.length === keys.length"
              @click="selectAllFilters()"
            />

            <Button
              v-if="useApi"
              :disabled="selectKeys.length === 0"
              class="mr-3 p-button-secondary"
              @click="doAddTemplateApi([...selectKeys], 0)"
              v-tooltip.bottom="$translate('admin.filter.store.template.global')"
            >
              <i class="fad fa-floppy-disk mr-2"></i>
              <i class="fad fa-globe"></i>
            </Button>
            <Button
              v-if="useApi"
              :disabled="selectKeys.length === 0"
              class="mr-3"
              @click="doAddTemplateApi([...selectKeys], 1)"
              v-tooltip.bottom="$translate('admin.filter.store.template.personal')"
              :loading="$loading.isLoading('add')"
            >
              <i class="fad fa-floppy-disk p-mr-2"></i>
              <i class="fad fa-user"></i>
            </Button>

            <Button
              v-if="!useApi"
              :disabled="selectKeys.length === 0 || globalExportTemplates.length >= 10"
              class="mr-3"
              icon="fad fa-floppy-disk"
              @click="doAddTemplateStore([...selectKeys])"
              v-tooltip.bottom="$translate('admin.filter.store.template')"
              :loading="$loading.isLoading('add')"
            />
            <Button
              class="p-button-danger mr-3"
              icon="fad fa-trash"
              :disabled="selectKeys.length === 0"
              @click="doDeleteFilters()"
              v-tooltip.bottom="$translate('admin.generic.remove.selected.fields')"
            />
          </template>
          <ToggleButton
            v-for="key in keys"
            :key="key"
            v-model="buttonSwitch[key.label]"
            :onLabel="translator === true ? checkTranslate(key.label) : key.label"
            :offLabel="translator === true ? checkTranslate(key.label) : key.label"
            onIcon="fad fa-circle-check"
            offIcon="fad fa-circle-xmark"
            @change="toggleButtonPush(key.label)"
            class="m-1"
            style="width: auto"
          />
        </Panel>
      </div>
      <div v-if="previewData.length > 0" class="field col-12">
        <DataTable
          :value="previewData"
          responsiveLayout="scroll"
          :rows="displayedRows"
          :reorderableColumns="true"
          @columnReorder="columnReorder($event)"
          :key="selectKeys.length"
          stripedRows
        >
          <template #header>
            <div class="font-bold flex align-items-center">
              <i class="fad fa-magnifying-glass mr-2" />
              <span>{{ $translate('admin.generic.preview') }}</span>
            </div>
          </template>
          <Column
            v-for="key in selectKeys"
            :field="key"
            :key="key"
            :header="translator === true ? checkTranslate(key) : key"
            bodyClass="cx"
          >
            <template #body="el">
              {{ el.data[key] !== null && el.data[key] !== '' ? el.data[key] : '-' }}
            </template>
          </Column>
        </DataTable>
      </div>
      <div v-if="selectKeys.length === 0" class="field col-12 align-self-center">
        <OLottie />
        <div class="col-12 text-center font-bold">
          {{ $translate('admin.generic.no.select.export.column') }}
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        v-if="exportMode === 'all' || exportMode === 'json'"
        icon="fad fa-brackets-curly"
        :label="$translate('admin.generic.export.json')"
        :disabled="disabled"
        @click="showPrevieworExport('JSON')"
      />
      <Button
        v-if="exportMode === 'all' || exportMode === 'csv'"
        icon="fad fa-file-csv"
        :label="$translate('admin.generic.export.csv')"
        :disabled="disabled"
        @click="showPrevieworExport('CSV')"
      />
      <Button
        v-if="exportMode === 'all' || exportMode === 'xls'"
        icon="fad fa-file-spreadsheet"
        :label="$translate('admin.generic.export.xls')"
        :disabled="disabled"
        @click="showPrevieworExport('XLS')"
      />
    </template>
  </Dialog>
</template>
<script>
import common from '@/assets/lottie/common-search.json'
import { utils, writeFileXLSX } from 'xlsx'
import { useSettingsStore } from '@/store/settings.js'
import OPageSettingApi from '@/components/OPageSettingApi.vue'
import OPageSettingStore from '@/components/OPageSettingStore.vue'

export default {
  name: 'ODialogExport',
  components: { OPageSettingApi, OPageSettingStore },
  provide() {
    return {
      checkTranslate: this.checkTranslate
    }
  },
  props: {
    useApi: { type: Boolean, default: () => false },
    exportFilename: {
      type: String,
      default: () => ''
    },
    exportMode: { type: String, default: () => 'all' },
    translator: { type: Boolean, default: () => true }
  },
  data() {
    return {
      API: null,
      useSettingsStore: useSettingsStore(),
      displayedRows: 10,
      selectKeys: [],
      buttonSwitch: {},
      selectColumnsData: [],
      globalExportTemplates: [],
      templateEditCheck: null,
      templateEditValue: null,
      collapsed: true,
      lottie: { common }
    }
  },
  watch: {
    '$modal.id': {
      handler(modalId) {
        // Modal ID sarà sempre lowercase. + check se ci sono defaultExportKeys
        if (modalId === this.$options.name.toLowerCase() && this.$modal.data.defaultExportKeys) {
          this.preValorizeDefaultFilters()
        }
      },
      immediate: true
    },
    buttonSwitch: {
      handler() {
        if (this.$modal.id) this.showPrevieworExport('preview')
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    disabled() {
      return this.selectColumnsData.length <= 0
    },
    exportFilenameComp() {
      if (!this.exportFilename) return `${this.currentPageName}-export`
      return this.exportFilename
    },
    keys() {
      let ret = []
      if (this.$modal.data.processed != null && this.$modal.data.processed.length > 0) {
        ret = this.calcKeys(this.$modal.data.processed[0])
      }
      return ret
    },
    checkFilters() {
      if (this.selectKeys.length === this.keys.length) {
        return 'fad fa-check-double'
      } else {
        return 'fad fa-check'
      }
    },
    previewData() {
      if (this.selectColumnsData.length > 0) {
        return [...this.selectColumnsData].splice(0, this.displayedRows)
      } else {
        return []
      }
    }
  },
  methods: {
    handleUpdateVisible() {
      this.doDeleteFilters()
      this.$modal.close()
    },
    checkTranslate(key) {
      const label = this.$modal.data.translatedLabel.find((el) => el.key === key)
      if (label) {
        return label.value
      }
      const translated = this.$translate(`decode.field.${key}`)
      if (translated.includes('--') || translated.includes('decode')) {
        return key
      }
      return translated
    },
    selectAllFilters() {
      this.collapsed = false
      for (const key of this.keys) {
        const index = this.selectKeys.indexOf(key.label)
        if (index === -1) {
          this.selectKeys.push(key.label)
          Object.entries(this.buttonSwitch).map((bSwitch) => {
            if (bSwitch[0].includes(key.label)) {
              this.buttonSwitch[key.label] = true
            }
          })
        }
      }
    },
    preValorizeDefaultFilters() {
      for (const defaultExportKey of this.$modal.data.defaultExportKeys) {
        for (const key of this.keys) {
          if (defaultExportKey === key.label) {
            this.selectKeys.push(defaultExportKey)
            Object.entries(this.buttonSwitch).map((bSwitch) => {
              if (bSwitch[0].includes(defaultExportKey)) {
                this.buttonSwitch[defaultExportKey] = true
              }
            })
          }
        }
      }
    },
    doDeleteFilters() {
      this.selectKeys = []
      this.buttonSwitch = {}
      this.selectColumnsData = []
      this.collapsed = true
    },
    doUseTemplate(template) {
      this.collapsed = false
      this.selectKeys = JSON.parse(JSON.stringify(template))
      this.showPrevieworExport('preview')

      for (const key of Object.keys(this.buttonSwitch)) {
        const temp = this.selectKeys.find((el) => el === key)

        if (temp) {
          this.buttonSwitch[key] = true
        } else {
          this.buttonSwitch[key] = false
        }
      }

      this.toast('success', 'use.export')
    },
    async doSearchTemplateApi() {
      this.$loading.start('search')
      try {
        const { data } = await this.API.pagesetting.search({
          key: this.$modal.data.key,
          type: this.$modal.data.type
        })
        data.data.forEach((el) => {
          el.value = JSON.parse(el.value)
        })
        this.globalExportTemplates = data.data
      } catch (e) {
        console.log(e)
      } finally {
        this.$loading.stop('search')
      }
    },
    async doAddTemplateApi(template, mode) {
      this.$loading.start('add')
      const json = {
        key: this.$modal.data.key,
        name: `${this.$modal.data.key} - ${this.globalExportTemplates.length}`,
        value: JSON.stringify(template),
        mode: mode,
        type: this.$modal.data.type
      }

      try {
        await this.API.pagesetting.add(json)
        await this.doSearchTemplateApi()
        this.toast('success', 'add.export')
      } catch (e) {
        console.log(e)
        if (e.response.status !== 401) {
          this.toast('error', e)
        }
      } finally {
        this.$loading.stop('add')
      }
    },
    doAddTemplateStore(template) {
      try {
        this.useSettingsStore.saveGlobalExportTemplates({
          page: this.currentPageName,
          value: template
        })
      } catch (e) {
        this.toast('error', 'add.template.store.limit.reached')
        console.log(e)
      }
    },
    async doEditTemplateApi({ data, name, mode }) {
      this.$loading.start('edit')
      const json = {
        name: name,
        mode: mode
      }

      try {
        await this.API.pagesetting.edit(data.id, json)
        await this.doSearchTemplateApi()
        this.toast('success', 'edit.export')
      } catch (e) {
        console.log(e)
        if (e.response.status !== 401) {
          this.toast('error', e)
        }
      } finally {
        this.$loading.stop('edit')
      }
    },
    doEditTemplateStore({ index, name }) {
      this.useSettingsStore.updateGlobalExportTemplates({
        page: this.currentPageName,
        index,
        value: name
      })
    },
    async doDeleteTemplateApi(id) {
      this.$loading.start('delete')
      try {
        await this.API.pagesetting.delete(id)
        await this.doSearchTemplateApi()
        this.toast('success', 'delete.export')
      } catch (e) {
        console.log(e)
        if (e.response.status !== 401) {
          this.toast('error', e)
        }
      } finally {
        this.$loading.stop('delete')
      }
    },
    doDeleteTemplateStore(index) {
      this.useSettingsStore.deleteGlobalExportTemplates({
        page: this.currentPageName,
        index
      })
    },
    toggleButtonPush(key) {
      if (!this.selectKeys.includes(key)) {
        this.selectKeys.push(key)
      } else {
        this.selectKeys = this.selectKeys.filter((el) => el !== key)
      }
    },
    constructTagsArray(event, value) {
      if (event === 'add') {
        Object.entries(this.buttonSwitch).map((bSwitch) => {
          value.forEach((el) => {
            if (bSwitch[0].includes(el)) {
              this.buttonSwitch[el] = true
              if (!this.selectKeys.includes(el)) {
                this.selectKeys.push(el)
              }
            }
          })
        })
        if (!this.selectKeys.includes(value.at(-1))) {
          this.selectKeys.push(value.at(-1))
        }
      }
      if (event === 'remove') {
        Object.entries(this.buttonSwitch).map((el) => {
          if (el[0] === value.at(-1)) this.buttonSwitch[value[0]] = false
        })
        this.selectKeys = this.selectKeys.filter((el) => el !== value[0])
      }
    },
    calcKeys(el) {
      const ret = []
      for (const key of Object.keys(el)) {
        const currValue = el[key]
        if (typeof currValue === 'object' && currValue !== null && !currValue.length) {
          const tmp = this.calcKeys(currValue)
          for (const keyDeep of tmp) {
            ret.push({
              label: key + '.' + keyDeep.value,
              value: key + '.' + keyDeep.value
            })
            const setKey = key + '.' + keyDeep.value
            this.buttonSwitch[setKey] = false
          }
        } else {
          ret.push({ label: key, value: key })
          this.buttonSwitch[key] = false
        }
      }
      return ret
    },
    columnReorder(event) {
      const temp = this.selectKeys[event.dragIndex]
      this.selectKeys.splice(event.dragIndex, 1)
      this.selectKeys.splice(event.dropIndex, 0, temp)

      const copySelectColumnsData = [...this.selectColumnsData]

      for (let i = 0; i < this.selectColumnsData.length; i++) {
        this.selectColumnsData[i] = {}
        for (let j = 0; j < this.selectKeys.length; j++) {
          this.selectColumnsData[i][this.selectKeys[j]] =
            copySelectColumnsData[i][this.selectKeys[j]]
        }
      }
    },
    checkExportType(type, key, value) {
      switch (type) {
        case 'preview':
        case 'CSV':
        case 'XLS':
          return this.handlerTypeExport(key, value)
        case 'JSON':
          return value
      }
    },
    toast(severity, name, label = undefined, duration = 2700) {
      let detail
      if (typeof name === 'string') {
        detail = this.$translate(`admin.toast.message.${name.toLowerCase()}`, label)
      } else {
        // CASE DELL'ERROR CHE PASSA L'ERROR MESSAGE DAL BACKEND
        if (name.response) {
          detail = `${name.response.data.code} - ${name.response.data.message}`
        } else {
          detail = this.$translate('admin.generic.error')
        }
      }
      this.$toast.add({
        severity: severity,
        summary: this.$translate(`admin.toast.${severity}.title`),
        detail: detail,
        life: duration
      })
    },
    handlerTypeExport(key, value) {
      switch (key) {
        case 'fromDate':
        case 'dateHistory':
        case 'dateOpen':
        case 'lastLogin':
        case 'birthDay':
        case 'start':
        case 'stop':
        case 'toDate':
        case 'dateExecution':
        case 'dateReserve':
        case 'dateConfirm':
          return this.$filters.asDate(value)
        case 'idLicensee':
          return this.$store.getters.getLicenseeDescription(value)
        case 'idSkin':
        case 'idSite':
          return this.$store.getters.getSkinDescription(value)
        case 'status':
          return this.$translate(`decode.limit.status.${value}`)
        case 'value':
          return this.$translate(`decode.self.exclusion.period.${value}`)
        case 'amount':
          return this.$filters.asAmount(value)
        default:
          return value
      }
    },
    calcObj(obj, keysPath) {
      let ret = { ...obj }
      for (let i = 1; i < keysPath.length; i++) {
        ret = ret[keysPath[i]]
      }
      return {
        value: ret,
        key: keysPath[keysPath.length - 1]
      }
    },
    async showPrevieworExport(type) {
      this.selectColumnsData = []
      const dataProcessed =
        type === 'preview'
          ? [...this.$modal.data.processed].splice(0, this.displayedRows)
          : this.$modal.data.processed
      await dataProcessed.forEach((processedData) => {
        const b = {}
        for (const [key, value] of Object.entries(processedData)) {
          for (const selectedkey of this.selectKeys) {
            if (typeof value === 'object' && key === selectedkey.split('.')[0]) {
              const { key: objKey, value: objValue } = this.calcObj(
                { ...value },
                selectedkey.split('.')
              )
              b[selectedkey] = this.checkExportType(type, objKey, objValue)
            }
            if (key == selectedkey) {
              b[key] = this.checkExportType(type, key, value)
            }
          }
        }
        this.selectColumnsData.push(b)
      })

      switch (type) {
        case 'CSV':
          this.doExportCSV()
          break
        case 'JSON':
          this.doExportJSON()
          break
        case 'XLS':
          this.doExportXLS()
          break
      }
    },
    doExportJSON() {
      const data = JSON.stringify(this.selectColumnsData)
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL || window.webkitURL
      const link = url.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = this.exportFilenameComp + '.json'
      a.href = link
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      this.toast('success', 'export.completed')
    },
    doExportCSV() {
      let csv = '\ufeff'
      const t = this.translator === true ? this.checkTranslate : (el) => el
      this.selectKeys.forEach((key) => {
        csv += t(key).replaceAll(' ', '') + ';'
      })
      csv += '\n'
      this.selectColumnsData.forEach((el) => {
        this.selectKeys.forEach((key) => {
          const value = el[key] === '' || el[key] == null ? '-' : el[key]
          csv += `"${value}"` + ';'
        })
        csv += '\n'
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL || window.webkitURL
      const link = url.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = this.exportFilenameComp + '.csv'
      a.href = link
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      this.toast('success', 'export.completed')
    },
    doExportXLS() {
      const array = []
      this.selectColumnsData.forEach((element) => {
        const obj = {}

        this.selectKeys.forEach((key) => {
          obj[this.checkTranslate(key)] = element[key]
        })

        array.push(obj)
      })
      const ws = utils.json_to_sheet(array)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Data')
      writeFileXLSX(wb, this.exportFilenameComp + '.xlsx')
      this.toast('success', 'export.completed')
    }
  },
  created() {
    if (this.useApi) {
      const site = localStorage.getItem('site')
      import(`../api/${site}/index.js`).then((module) => {
        this.API = module.default
        this.doSearchTemplateApi({ key: this.$modal.data.key, type: this.$modal.data.type })
      })
    }
  },
  mounted() {
    if (!this.useApi) {
      this.globalExportTemplates = this.useSettingsStore.getGlobalExportTemplates(
        this.currentPageName
      )
    }
  }
}
</script>
<style lang="scss">
#dialog-global-export {
  .p-panel {
    .p-panel-header {
      .p-panel-icons {
        align-items: normal;
      }
    }
  }

  .p-fluid {
    .p-button {
      width: auto;
    }

    .p-selectbutton.p-buttonset {
      .p-button {
        display: block;
      }
    }
  }
}
</style>
