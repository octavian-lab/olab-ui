<template>
  <Dialog
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
        <Panel :toggleable="true" :collapsed="true">
          <template #header>
            <div class="font-bold">
              <i class="fad fa-floppy-disk-circle-arrow-right mr-2"></i>
              <span>{{ $translate('admin.title.stored.export') }}</span>
            </div>
          </template>

          <div class="my-3">
            <i class="fad fa-circle-info fa-xl mr-2" />
            <span>
              {{ $translate('admin.title.stored.export.info.text') }}
            </span>
          </div>

          <DataTable :value="globalExportTemplates">
            <template #empty>
              <div class="col-12 cx font-bold">
                {{ $translate('admin.generic.empty.results') }}
              </div>
            </template>

            <Column :header="$translate('admin.generic.label')" headerClass="w-15" bodyClass="w-15">
              <template #body="{ index, data }">
                <div v-if="templateEditCheck !== index" class="font-bold">
                  {{ data.label }}
                </div>
                <InputText
                  v-else-if="templateEditCheck === index"
                  v-model="templateEditValue"
                  :placeholder="$translate('admin.generic.enter.label')"
                />
              </template>
            </Column>
            <Column :header="$translate('admin.generic.value')" field="value">
              <template #body="{ data }">
                <div>
                  <span v-for="(el, i) in data.value" :key="i">
                    {{ `${checkTraslate(el)}; ` }}
                  </span>
                </div>
              </template>
            </Column>
            <Column
              :header="$translate('admin.generic.operations')"
              headerClass="w-10"
              bodyClass="w-10"
            >
              <template #body="{ index, data }">
                <div v-if="templateEditCheck !== index" class="flex justify-content-center">
                  <Button
                    icon="fas fa-arrow-down"
                    class="p-button-outlined p-button-sm mr-3"
                    :label="$translate('admin.generic.action.use')"
                    @click="doUseTemplate(data.value)"
                  />
                  <Button
                    icon="fad fa-edit"
                    class="p-button-sm mr-3"
                    @click="doHandleEditTemplate(index, data.label)"
                    v-tooltip.bottom="$translate('admin.action.edit.label')"
                  />
                  <Button
                    icon="fad fa-trash"
                    class="p-button-danger p-button-sm"
                    @click="doDeleteTemplate(index)"
                  />
                </div>

                <div v-else-if="templateEditCheck === index" class="flex justify-content-center">
                  <Button
                    icon="fad fa-save"
                    class="p-button-sm mr-3"
                    :label="$translate('admin.generic.action.save')"
                    :disabled="!templateEditValue"
                    @click="doHandleEditTemplate(index)"
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
        </Panel>
      </div>

      <div class="field col-12">
        <Panel :toggleable="true" :collapsed="collapsed">
          <template #header>
            <div class="font-bold">
              <i class="fad fa-filters mr-2"></i>
              <span>{{ $translate('admin.generic.fields') }}</span>
            </div>
          </template>
          <template #icons>
            <Button
              class="mr-3"
              :label="$translate('admin.generic.select.all.fields')"
              :icon="checkFilters"
              :disabled="selectKeys.length === keys.length"
              @click="selectAllFilters()"
            />
            <Button
              class="mr-3"
              icon="fad fa-floppy-disk"
              :disabled="selectKeys.length === 0 || globalExportTemplates.length >= 10"
              @click="doSaveTemplate([...selectKeys])"
              v-tooltip.bottom="$translate('admin.filter.store.template')"
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
            :onLabel="checkTraslate(key.label)"
            :offLabel="checkTraslate(key.label)"
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
            :header="checkTraslate(key)"
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
        icon="fad fa-brackets-curly"
        :label="$translate('admin.generic.export.json')"
        :disabled="disabled"
        @click="showPrevieworExport('JSON')"
      />
      <Button
        icon="fad fa-file-csv"
        :label="$translate('admin.generic.export.csv')"
        :disabled="disabled"
        @click="showPrevieworExport('CSV')"
      />
      <Button
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

export default {
  name: 'ODialogExport',
  data() {
    return {
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
    '$modal.id'(modalId) {
      // Modal ID sarà sempre lowercase. + check se ci sono defaultExportKeys
      if (modalId === this.$options.name.toLowerCase() && this.$modal.data.defaultExportKeys) {
        this.preValorizeDefaultFilters()
      }
    },
    buttonSwitch: {
      handler() {
        if (this.$modal.id) this.showPrevieworExport('preview')
      },
      deep: true
    }
  },
  computed: {
    disabled() {
      return this.selectColumnsData.length <= 0
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
    checkTraslate(key) {
      if (`${this.$translate(`decode.field.${key}`)}`.includes('--')) {
        return key
      } else {
        return `${this.$translate(`decode.field.${key}`)}`
      }
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
    doSaveTemplate(template) {
      this.$store.dispatch('saveGlobalExportTemplates', {
        page: this.$route.path.replaceAll("/", ""),
        value: template
      })
      this.globalExportTemplates = this.$store.getters.globalExportTemplates(this.$route.path.replaceAll("/", ""))
    },
    doUseTemplate(template) {
      this.selectKeys = template
      this.showPrevieworExport('preview')

      for (const key of Object.keys(this.buttonSwitch)) {
        const temp = this.selectKeys.find((el) => el === key)

        if (temp) {
          this.buttonSwitch[key] = true
        } else {
          this.buttonSwitch[key] = false
        }
      }
    },
    doHandleEditTemplate(index, value) {
      if (typeof index !== 'number') {
        this.templateEditCheck = null
        this.templateEditValue = ''
        return
      }
      if (value) {
        this.templateEditCheck = index
        this.templateEditValue = value
        return
      }

      this.$store.dispatch('updateGlobalExportTemplates', {
        page: this.$route.path.replaceAll("/", ""),
        index,
        value: this.templateEditValue
      })

      this.globalExportTemplates = this.$store.getters.globalExportTemplates(this.$route.path.replaceAll("/", ""))
      this.templateEditCheck = null
      //this.templateEditValue = "";
    },
    doDeleteTemplate(index) {
      this.$store.dispatch('deleteGlobalExportTemplates', { page: this.$route.path.replaceAll("/", ""), index })
      this.globalExportTemplates = this.$store.getters.globalExportTemplates(this.$route.path.replaceAll("/", ""))
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
        if (typeof currValue === 'object' && currValue !== null) {
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
          return this.$filters.asDate(value)
        // case 'idLicensee': TODO
        //   return this.$store.getters.getLicenseeDescription(value)
        // case 'idSkin': TODO
        //   return this.$store.getters.getSkinDescription(value)
        case 'status':
          return this.$translate(`decode.limit.status.${value}`)
        case 'value':
          return this.$translate(`decode.self.exclusion.period.${value}`)
        case 'platformType':
          return `${value} - ${this.$translate(`decode.platform.type.${value}`)}`

        default:
          return value
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
              const object = { ...value }
              if (selectedkey.includes('.')) {
                for (const [key, value] of Object.entries(object)) {
                  if (key == selectedkey.split('.')[1]) {
                    b[selectedkey] = this.checkExportType(type, key, value)
                  }
                }
              }
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
      a.download = 'Customers.json'
      a.href = link
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      this.toast('success', 'export.completed')
    },
    doExportCSV() {
      let csv = '\ufeff'
      this.selectKeys.forEach((key) => {
        csv += this.checkTraslate(key).replaceAll(' ', '') + ';'
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
      a.download = 'Customers.csv'
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
          obj[this.checkTraslate(key)] = element[key]
        })

        array.push(obj)
      })
      const ws = utils.json_to_sheet(array)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Data')
      writeFileXLSX(wb, 'Customers.xlsx')
      this.toast('success', 'export.completed')
    },
  },
  created() {
    this.globalExportTemplates =
      this.$store.getters.globalExportTemplates(this.$route.path.replaceAll("/", "")) || []
  }
}
</script>
