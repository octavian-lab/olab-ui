// UTILITY IMPORT
import loadingplugin from '@/plugins/loadingplugin.js'
import modalplugin from '@/plugins/modalplugin.js'

// FILTERS IMPORT
import asDate from '@/filters/asDate.js'
import asAmount from '@/filters/asDate.js'
import toAmount from '@/filters/asDate.js'
import asHHmm from '@/filters/asDate.js'
import asPercentage from '@/filters/asDate.js'

// COMPONENTS IMPORT
import OList from './components/OList.vue'
import OCard from './components/OCard.vue'
import OCalendar from './components/OCalendar.vue'
import ODialog from './components/ODialog.vue'
import ODialogExport from './components/ODialogExport.vue'
import ODropdown from './components/ODropdown.vue'
import OTable from './components/OTable.vue'
import OField from './components/OField.vue'

export default {
  install: (app, options = {}) => {
    if (!options.fxTranslate) {
      console.warn('Please pass to the options a translate function')
    }
    app.use(loadingplugin)
    app.use(modalplugin)
    app.config.globalProperties.$translate = options.fxTranslate
    app.config.globalProperties.$filters = {
      asDate,
      asAmount,
      asHHmm,
      toAmount,
      asPercentage
    }
  }
}

export { OList, OCard, OCalendar, ODialog, ODropdown, OTable, ODialogExport, OField }
