// STORE IMPORT
import { store } from '@/store/index.js'

// GLOBAL PLUGINS IMPORT
import loadingplugin from '@/plugins/loadingplugin.js'
import modalplugin from '@/plugins/modalplugin.js'
import functionmixin from '@/mixins/functionmixin.js'
import datemixin from '@/mixins/datemixin.js'

// USAGES IN JS FILES
const useFunctions =() => functionmixin.methods
const useModal = ()=> modalplugin.modal

// FILTERS IMPORT
import asDate from './filters/asDate.js'
import asAmount from './filters/asAmount.js'
import toAmount from './filters/toAmount.js'
import asHHmm from './filters/asHHmm.js'
import asPercentage from './filters/asPercentage.js'

// COMPONENTS IMPORT
import OField from './components/OField.vue'
import OFieldsContainer from './components/OFieldsContainer.vue'
import OCard from './components/OCard.vue'
import OCalendar from './components/OCalendar.vue'
import OChart from './components/OChart.vue'
import ODialog from './components/ODialog.vue'
import ODialogExport from './components/ODialogExport.vue'
import ODropdown from './components/ODropdown.vue'
import OList from './components/OList.vue'
import OLottie from './components/OLottie.vue'
import OTable from './components/OTable.vue'
import OFilter from './components/OFiltersPanel/OFilter.vue'
import OFiltersPanel from './components/OFiltersPanel/OFiltersPanel.vue'
import OPassword from './components/OPassword.vue'
import DropdownSmart from './components/ToRemove/DropdownSmart.vue'

export default {
  install: (app, options = {}) => {
    if (!options.fxTranslate) {
      console.warn('Please pass to the options a translate function: fxTranslate')
      return
    }
    if (!localStorage.getItem('site')) {
      console.warn(
        'Script with site name is missing, info here: https://wiki.octavianlab.com/it/devs/backoffice-agp'
      )
    }

    app.use(store())
    app.use(loadingplugin)
    app.use(modalplugin)

    app.mixin(functionmixin)
    app.mixin(datemixin)

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
  OChart,
  ODialog,
  ODropdown,
  OTable,
  ODialogExport,
  OField,
  OFieldsContainer,
  OLottie,
  OFilter,
  OFiltersPanel,
  OPassword,
  DropdownSmart,
  useModal,
  useFunctions
}
