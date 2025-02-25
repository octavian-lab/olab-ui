<template>
  <div id="o-calendar">
    <div v-if="!advanced" class="p-inputgroup">
      <OCalendarCustomButtons
        @onChangeDay="doChangeDay($event)"
        direction="minus"
        :borderRounded="borderRounded"
      />
      <Calendar
        class="w-100"
        v-model="modelValue"
        v-bind="getFilteredAttrs($attrs)"
        hide-on-date-time-select
        @show="setMidnight"
        :showTime="$attrs.showTime != null ? $attrs.showTime : true"
        :showButtonBar="true"
        :dateFormat="$attrs.dateFormat ? $attrs.dateFormat : 'dd/mm/yy'"
        icon="fad fa-calendar"
        :touch-u-i="isMobile"
        :placeholder="placeholder"
      />
      <OCalendarCustomButtons @onChangeDay="doChangeDay($event)" direction="plus" />
    </div>
    <div class="p-inputgroup" v-else>
      <!-- CALENDAR MOBILE: ( FATTO CON DROPDOWN PER MOTIVI DI SPAZIO SU MOBILE )  -->
      <Dropdown
        v-model="modelValue"
        v-if="!isDesktop && mode === 'default'"
        :options="translatedCalendarOptions"
        :showClear="unselectable"
        dataKey="value"
        option-label="label"
        :placeholder="$translate('admin.generic.select.date.type')"
      />
      <!--  CALENDAR DEFAULT: VISIBILE DA DESKTOP  -->
      <SelectButton
        v-else-if="isDesktop && mode === 'default'"
        :options="translatedCalendarOptions"
        v-model="modelValue"
        optionLabel="value"
        :allowempty="unselectable === true ? undefined : false"
      >
        <template #option="{ option }">
          <div class="font-sm">{{ option.label }}</div>
        </template>
      </SelectButton>
      <!-- CALENDAR DEFAULT: @CLICK MORE MONHTS -->
      <Dropdown
        v-else-if="mode === 'more-months' || mode === 'periods'"
        v-model="modelValue"
        :options="defaultDropdownOptions"
        optionLabel="label"
        option-value="value"
        :placeholder="$translate('admin.generic.select.period')"
      />
      <!-- CALENDAR DEFAULT: @CLICK RANGE -->
      <div v-if="mode === 'range'" class="p-inputgroup mr-2">
        <Calendar
          v-model="modelValue.date.from"
          class="animate__animated animate__fadeIn"
          :showTime="$attrs.showTime != null ? $attrs.showTime : true"
          :placeholder="$translate('admin.generic.from')"
          :dateFormat="$attrs.dateFormat != null ? $attrs.dateFormat : 'dd/mm/yy'"
          :view="$attrs.view != null ? $attrs.view : 'date'"
          icon="fad fa-calendar"
          hide-on-date-time-select
          :touch-u-i="!isDesktop"
        />
        <OCalendarButtons @onChangeDay="doChangeDay($event, 'from')" />
      </div>
      <div v-if="mode === 'range'" class="p-inputgroup">
        <Calendar
          class="animate__animated animate__fadeIn"
          v-model="modelValue.date.to"
          :showTime="$attrs.showTime != null ? $attrs.showTime : true"
          :placeholder="$translate('admin.generic.to')"
          :dateFormat="$attrs.dateFormat != null ? $attrs.dateFormat : 'dd/mm/yy'"
          :view="$attrs.view != null ? $attrs.view : 'date'"
          icon="fad fa-calendar"
          hide-on-date-time-select
          :touch-u-i="!isDesktop"
        />
        <OCalendarButtons :borderRightRounded="false" @onChangeDay="doChangeDay($event, 'to')" />
      </div>
      <span
        v-if="mode === 'range' || mode === 'more-months' || mode === 'periods'"
        @click="doReset"
        class="p-inputgroup-addon text-center pointer"
      >
        <i class="fad fa-trash text-danger w-fit" />
      </span>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Datemixin from '@/mixins/datemixin.js'
import OCalendarButtons from '@/components/OCalendar/OCalendarButtons.vue'
import OCalendarCustomButtons from '@/components/OCalendar/OCalendarCustomButtons.vue'

const siteName = localStorage.getItem('site')

export default {
  name: 'OCalendar',
  components: {
    OCalendarButtons,
    OCalendarCustomButtons
  },
  emits: ['update:from', 'update:to', 'update:modelValue'],
  props: {
    placeholder: { type: String, default: () => 'dd / mm / yy hh:mm' },
    unselectable: { type: Boolean, default: () => true },
    from: { type: [Date, Object, String], default: () => null },
    to: { type: [Date, Object, String], default: () => null },
    advanced: { type: Boolean, default: () => true },
    empty: { type: Boolean, default: () => false },
    filteredOptions: { type: Array, default: () => [] },
    borderRounded: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      startValue: 1,
      modelValue: null,
      selects: {
        calendarOptions: [],
        previousMonths: [],
        periods: []
      }
    }
  },
  watch: {
    extQuery(val) {
      if (this.advanced) {
        if (!val.from && !val.to) this.doReset()
        if (val && typeof val.from === 'string' && this.advanced) {
          if (this.modelValue && (this.modelValue.value === 3 || this.modelValue.value === 5))
            return
          this.modelValue = this.getNumberFromDate()
        }
      } else {
        this.modelValue = this.$filters.toJSDate(val)
      }
    },
    // Trasformazione da oggetto calendar smart a query per tutti i panels.
    modelValueCopy: {
      deep: true,
      handler(vmodel, oldVal) {
        if (!vmodel) {
          this.$emit('update:from', null)
          this.$emit('update:to', null)
          this.handleDateEmit()
          return
        }
        if (vmodel?.date != null && this.advanced) {
          this.handleObjectEmit(vmodel, oldVal)
          return
        }
        if (!this.advanced && (!oldVal || !this.compareDate(oldVal, vmodel, 'equal'))) {
          this.handleDateEmit(vmodel, oldVal)
        }
      }
    },
    mode(newMode) {
      if (['more-months'].includes(newMode) && this.defaultDropdownOptions.length > 0) {
        this.modelValue = this.defaultDropdownOptions[0].value
      }
    }
  },
  computed: {
    //sono obbligato a fare una copia del modelValue per il caso dell'oggetto, perchè anche utilizzando il deep nella watch
    //viene guardata la referenza quindi oldVal e newVal sono sempre uguali
    modelValueCopy() {
      if (this.advanced) return JSON.parse(JSON.stringify(this.modelValue))
      return this.modelValue
    },
    translatedCalendarOptions() {
      return this.generateOptions()
    },
    defaultDropdownOptions() {
      return this.generateDropdownOptions()
    },
    extQuery() {
      if (this.advanced) return { from: this.from, to: this.to }
      return this.$attrs.modelValue
    },
    mode() {
      if (this.modelValue) {
        switch (this.modelValue.value) {
          case 3:
            return 'periods'
          case 5:
            return 'more-months'
          case 6:
            return 'range'
          default:
            return 'default'
        }
      }
      return 'default'
    }
  },
  methods: {
    setMidnight() {
      if (this.modelValue == null) this.modelValue = this.getMidNight(moment()).toDate()
    },
    doChangeDay(amount, dataToChange) {
      const period = this.$attrs.dateFormat === 'mm/yy' ? 'months' : 'days'
      if (!dataToChange) {
        if (!this.modelValue) {
          this.modelValue = this.getMidNight(moment()).toDate()
        }
        this.modelValue = this.addPeriod(moment(this.modelValue), amount, period)
        return
      }
      this.modelValue.date[dataToChange] = this.addPeriod(
        moment(this.modelValue.date[dataToChange]),
        amount,
        period
      ).toDate()
    },
    handleDateEmit(val, oldVal) {
      const emitValue = (val) => this.$emit('update:modelValue', val)
      if (!val) {
        emitValue(null)
        return
      }
      const toJSDateVal = this.$filters.toJSDate(
        moment(val).set({ seconds: 0, milliseconds: 0 }),
        false
      )
      if (!oldVal) {
        switch (this.empty) {
          case false:
            emitValue(toJSDateVal)
            return
          case true:
            emitValue(val)
            return
        }
      }
      if (!this.compareDate(oldVal, val, 'equal')) {
        emitValue(toJSDateVal)
      }
    },
    handleObjectEmit(val, oldVal) {
      if (val.value !== 6) {
        this.$emit('update:from', val.date.from)
        this.$emit('update:to', val.date.to)
        return
      }
      const emitValue = (resource) => {
        if (
          !oldVal ||
          Object.entries(oldVal).length === 0 ||
          !this.compareDate(oldVal.date[resource], val.date[resource], 'equal')
        ) {
          const valueToEmit = this.$filters.toJSDate(val.date[resource], false)
          this.$emit(`update:${resource}`, valueToEmit)
        }
      }
      emitValue('from')
      emitValue('to')
    },
    getCalendarOption(value) {
      if (value) {
        if (typeof value === 'object') {
          const option = this.selects.calendarOptions.find(
            (el) => el.date?.from === value.from && el.date?.to === value.to
          )
          if (option) return option
        }
        return this.selects.calendarOptions.find((el) => el.value === value)
      }
    },
    getNumberFromDate(isOnMounted) {
      let ret
      let tmp
      let date = JSON.stringify({ from: this.from, to: this.to })
      if (JSON.parse(date).from == null && JSON.parse(date).to == null) {
        ret = null
        return ret
      }
      const today = JSON.stringify(this.getCalendarOption(1)?.date)
      const yesterday = JSON.stringify(this.getCalendarOption(2)?.date)
      const currMonth = JSON.stringify(this.getCalendarOption(4)?.date)
      // N.B. Il case 6 viene escluso dalla pre-valorizzazione ( poiché viene usato in modalità "Range" )
      switch (date) {
        case today:
          ret = 1
          break
        case yesterday:
          ret = 2
          break
        case currMonth:
          ret = 4
          break
        default:
          ret = 6
          tmp = this.getCalendarOption(ret)
          tmp.date = {
            from: this.from
              ? this.$filters.toJSDate(this.from)
              : this.$filters.toJSDate(this.getMidNight(moment())),
            to: this.to
              ? this.$filters.toJSDate(this.to)
              : this.$filters.toJSDate(this.getEndOf(moment(), 'day'))
          }
          return tmp
      }
      if (isOnMounted) this.startValue = ret
      return this.getCalendarOption(ret)
    },
    // TODO rendere globale se necessario ( se utilizzata 2 volte )
    getPreviousMonths() {
      let ret = []
      for (let i = 1; i <= 12; i++) {
        //AGGIUNGO 1 PERCHÈ I DECODE PARTONO DA 1 E I MONTH DA 0
        const monthValue = this.addPeriod(moment(), -i, 'months').month() + 1
        const yearValue = this.addPeriod(moment(), -i, 'months').year()
        ret.push({
          label: this.$translate('decode.month.' + monthValue) + ' ' + yearValue,
          value: this.getCalendarOption(5).updateDate(i)
        })
      }
      return (this.selects.previousMonths = ret)
    },
    doReset() {
      // RESETTERÀ IL VMODEL
      this.modelValue = this.unselectable === true ? this.getCalendarOption(this.startValue) : null
    },
    generatePeriods() {
      const arr = [3, 7, 15, 30, 60, 90]
      let ret = []
      ret.push(
        {
          label: this.$translate('admin.generic.calendar.this.week'),
          value: {
            date: {
              from: this.getMidNight(this.getStartOf(moment(), 'isoweek')).toISOString(),
              to: this.getMidNight(this.getEndOf(moment(), 'isoweek')).toISOString()
            }
          }
        },
        {
          label: this.$translate('admin.generic.calendar.last.week'),
          value: {
            date: {
              from: this.getMidNight(
                this.getStartOf(this.addPeriod(moment(), -1, 'weeks'), 'isoweek')
              ).toISOString(),
              to: this.getMidNight(
                this.getEndOf(this.addPeriod(moment(), -1, 'weeks'), 'isoweek')
              ).toISOString()
            }
          }
        }
      )
      arr.forEach((el) => {
        ret.push({
          label: this.$translate('admin.generic.last.days.' + el),
          value: {
            date: {
              from: this.getMidNight(
                this.getStartOf(this.addPeriod(moment(), -el, 'days'), 'day')
              ).toISOString(),
              to: this.getEndOf(moment(), 'day').toISOString()
            }
          }
        })
      })
      return ret
    },
    generateDropdownOptions() {
      let ret = []
      switch (this.mode) {
        case 'more-months':
          ret = this.getPreviousMonths()
          break
        case 'periods':
          ret = this.generatePeriods()
          break
      }
      return ret
    },
    generateOptions() {
      return [
        {
          value: 1,
          label: this.$translate('admin.generic.calendar.today'),
          date: {
            from: this.getMidNight(moment()).toDate(),
            to: this.getEndOf(moment(), 'day').toDate()
          }
        },
        {
          value: 2,
          label: this.$translate('admin.generic.calendar.yesterday'),
          date: {
            from: this.getMidNight(this.getYesterday()).toDate(),
            to: this.getEndOf(this.getYesterday(), 'day').toDate()
          }
        },
        {
          value: 3,
          label: this.$translate('admin.generic.periods'),
          date: {
            from: this.getMidNight(this.getStartOf(moment(), 'isoweek')).toDate(),
            to: this.getMidNight(this.getEndOf(moment(), 'isoweek')).toDate()
          }
        },
        {
          value: 4,
          label: this.$translate('admin.generic.calendar.this.month'),
          date: {
            from: this.getMidNight(this.getStartOf(moment(), 'month')).toDate(),
            to: this.getMidNight(this.getEndOf(moment(), 'month')).toDate()
          }
        },
        {
          value: 5,
          label: this.$translate('admin.generic.other.months'),
          date: {
            from: this.getStartOf(this.addPeriod(moment(), -1, 'months'), 'month').toDate(),
            to: this.getEndOf(this.addPeriod(moment(), -1, 'months'), 'month').toDate()
          },
          updateDate(value) {
            return {
              ...this,
              date: {
                from: Datemixin.methods
                  .getStartOf(Datemixin.methods.addPeriod(moment(), -value, 'months'), 'month')
                  .toDate(),
                to: Datemixin.methods
                  .getEndOf(Datemixin.methods.addPeriod(moment(), -value, 'months'), 'month')
                  .toDate()
              }
            }
          }
        },
        {
          value: 6,
          label: this.$translate('admin.generic.select.date.range'),
          date: {
            from: this.$filters.toJSDate(this.getMidNight(moment())),
            to: this.$filters.toJSDate(this.getEndOf(moment(), 'day'))
          }
        }
      ]
    },
    filterOptions() {
      if (this.filteredOptions.length > 0) {
        this.selects.calendarOptions = this.selects.calendarOptions.filter((el) =>
          this.filteredOptions.includes(el.value)
        )
      }
    },
    getFilteredAttrs(attrs) {
      const ret = { ...attrs }
      delete ret.modelValue
      return ret
    }
  },
  created() {
    if (this.advanced) {
      this.selects.calendarOptions = this.generateOptions()
      this.filterOptions()
    }
  },
  mounted() {
    if (this.advanced) {
      this.modelValue = this.getNumberFromDate(true)
      this.getPreviousMonths()
    } else {
      if (!this.empty) {
        this.modelValue = this.$attrs.modelValue
          ? this.$filters.toJSDate(
              moment(this.$attrs.modelValue).set({
                seconds: 0,
                milliseconds: 0
              })
            )
          : this.$filters.toJSDate(this.getMidNight(moment()))
      } else {
        this.modelValue = this.$attrs.modelValue ? moment(this.$attrs.modelValue, false) : null
      }
    }
  }
}
</script>
<style scoped lang="scss">
#o-calendar {
  max-height: 35px;
  height: 100%;
  width: 100%;

  .p-inputgroup {
    width: 100%;
    height: 100%;
    min-height: 2.5rem;

    :deep(.p-button):not(.p-datepicker-trigger) {
      padding: 0.2rem;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }

    :deep(.p-selectbutton) {
      width: 100%;
      display: flex;
    }
  }
}
</style>
