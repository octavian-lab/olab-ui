// STORE IMPORT
import { store } from '@/store/index.js'

// GLOBAL PLUGINS IMPORT
import loadingplugin from '@/plugins/loadingplugin.js'
import modalplugin from '@/plugins/modalplugin.js'
import functionsplugin from '@/plugins/functionsplugin.js'

// FILTERS IMPORT
import asDate from './filters/asDate.js'
import asAmount from './filters/asDate.js'
import toAmount from './filters/asDate.js'
import asHHmm from './filters/asDate.js'
import asPercentage from './filters/asDate.js'

// COMPONENTS IMPORT
import OField from './components/OField.vue'
import OFieldsContainer from "./components/OFieldsContainer.vue";
import OCard from './components/OCard.vue'
import OCalendar from './components/OCalendar.vue'
import ODialog from './components/ODialog.vue'
import ODialogExport from './components/ODialogExport.vue'
import ODropdown from './components/ODropdown.vue'
import OList from './components/OList.vue'
import OLottie from './components/OLottie.vue'
import OTable from './components/OTable.vue'
import OFilter from './components/OFiltersPanel/OFilter.vue'
import OFiltersPanel from './components/OFiltersPanel/OFiltersPanel.vue'

export default {
  install: (app, options = {}) => {
    if (!options.fxTranslate) {
      console.warn('Please pass to the options a translate function: fxTranslate')
      return
    }
    if (!options.site) {
      console.warn('Please pass to the options a site name: site')
    }
    if (!localStorage.getItem('site')) {
      console.warn('Script with site name is missing, info here: https://wiki.octavianlab.com/it/devs/backoffice-agp')
    }

    app.use(store())
    app.use(functionsplugin, { site: options.site, fxTranslate: options.fxTranslate })
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

export {
  OList,
  OCard,
  OCalendar,
  ODialog,
  ODropdown,
  OTable,
  ODialogExport,
  OField,
  OFieldsContainer,
  OLottie,
  OFilter,
  OFiltersPanel,
}
