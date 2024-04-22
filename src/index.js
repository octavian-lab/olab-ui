// STORE IMPORT
import { store } from '@/store/index.js'

// GLOBAL PLUGINS IMPORT
import loadingplugin from '@/plugins/loadingplugin.js'
import modalplugin from '@/plugins/modalplugin.js'
import functionmixin from '@/mixins/functionmixin.js'
import datemixin from '@/mixins/datemixin.js'

// USAGES IN JS FILES
const useFunctions = () => functionmixin.methods
const useModal = () => modalplugin.modal

const useLoading = () => loadingplugin.loading

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
import OCalendar from './components/OCalendar/OCalendar.vue'
import OChart from './components/OChart.vue'
import ODialog from './components/ODialog.vue'
import ODialogExport from './components/ODialogExport.vue'
import ODialogOTP from './components/ODialogOTP.vue'
import ODropdown from './components/ODropdown.vue'
import OPanelWrapper from './components/OPanelWrapper.vue'
import OInputOTP from './components/OInputOTP.vue'
import OList from './components/OList.vue'
import OLottie from './components/OLottie.vue'
import OTable from './components/OTable.vue'
import OFilter from './components/OFiltersPanel/OFilter.vue'
import OFiltersPanel from './components/OFiltersPanel/OFiltersPanel.vue'
import OPassword from './components/OPassword.vue'
import ODraggable from '@/components/ODraggable.vue'
import OProgressBar from '@/components/OProgressBar.vue'

export default {
  install: (app, options = { installMixins: true }) => {
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

    // Aggiunta protezione mixins in conflitto con portal-v3 ( da fixare a breve )
    if (options.installMixins === true) {
      app.mixin(functionmixin)
      app.mixin(datemixin)
    }

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
  OCard,
  OCalendar,
  OChart,
  ODialog,
  ODropdown,
  OPanelWrapper,
  OTable,
  ODialogExport,
  OInputOTP,
  ODialogOTP,
  OField,
  OFieldsContainer,
  OList,
  OLottie,
  OFilter,
  OFiltersPanel,
  OPassword,
  ODraggable,
  OProgressBar,
  useLoading,
  useModal,
  useFunctions
}
