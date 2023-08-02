<template>
  <div id="o-calendar">
    <Calendar
      v-if="!advanced"
      class="w-full"
      v-model="modelValue"
      v-bind="$attrs"
      @show="setMidnight"
      hide-on-date-time-select
      :showIcon="$attrs.showIcon != null ? $attrs.showIcon : true"
      :showTime="$attrs.showTime != null ? $attrs.showTime : true"
      :showButtonBar="true"
      :dateFormat="$attrs.dateFormat ? $attrs.dateFormat : 'dd/mm/yy'"
      icon="fad fa-calendar"
      :touch-u-i="$isMobile"
      placeholder="dd / mm / yy hh:mm"
    />
    <div class="p-inputgroup" v-else>
      <!-- CALENDAR MOBILE: ( FATTO CON DROPDOWN PER MOTIVI DI SPAZIO SU MOBILE )  -->
      <Dropdown
        v-if="!$isDesktop && mode === 'default'"
        :options="selects.calendarOptions"
        option-label="label"
        :placeholder="$translate('admin.generic.select.date.type')"
      />
      <!--  CALENDAR DEFAULT: VISIBILE DA DESKTOP  -->
      <SelectButton
        v-else-if="$isDesktop && mode === 'default'"
        :options="selects.calendarOptions"
        v-model="modelValue"
        optionLabel="value"
        :unselectable="unselectable"
      >
        <template #option="{ option }">
          <div class="font-xs">{{ option.label }}</div>
        </template>
      </SelectButton>

      <!-- CALENDAR DEFAULT: @CLICK MORE MONHTS -->
      <Dropdown
        v-else-if="mode === 'more-months'"
        v-model="modelValue"
        :options="selects.previousMonths"
        optionLabel="label"
        option-value="value"
        :placeholder="$translate('admin.generic.select.date.type')"
      />

      <!-- CALENDAR DEFAULT: @CLICK RANGE -->
      <Calendar
        v-if="mode === 'range'"
        v-model="modelValue.date.from"
        class="animate__animated animate__fadeIn mr-2"
        showTime
        :placeholder="$translate('admin.generic.from')"
        dateFormat="dd/mm/yy"
        icon="fad fa-calendar"
        hide-on-date-time-select
        :touch-u-i="!$isDesktop"
      />
      <Calendar
        v-if="mode === 'range'"
        class="animate__animated animate__fadeIn"
        v-model="modelValue.date.to"
        showTime
        :placeholder="$translate('admin.generic.to')"
        dateFormat="dd/mm/yy"
        icon="fad fa-calendar"
        hide-on-date-time-select
        :touch-u-i="!$isDesktop"
      />
      <span
        v-if="mode === 'range' || mode === 'more-months'"
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
import {
  addPeriod,
  getMidNight,
  getYesterday,
  getStartOf,
  getEndOf,
  compareDate
} from '@/util/dateHandler.js'

export default {
  name: 'OCalendar',
  emits: ['update:from', 'update:to', 'update:modelValue'],
  props: {
    unselectable: { type: Boolean, default: () => true },
    from: { type: [Date, Object, String], default: () => null },
    to: { type: [Date, Object, String], default: () => null },
    advanced: { type: Boolean, default: () => true },
    empty: { type: Boolean, default: () => false },
    filteredOptions: { type: Array, default: () => [] }
  },
  data() {
    return {
      startValue: 1,
      modelValue: null,
      selects: {
        calendarOptions: [],
        previousMonths: []
      }
    }
  },
  watch: {
    extQuery(val) {
      if (!val.from && !val.to) this.doReset()
      if (val && typeof val.from === 'string' && this.advanced) {
        this.modelValue = this.getNumberFromDate()
      }
    },
    // Trasformazione da oggetto calendar smart a query per tutti i panels.
    modelValue: {
      deep: true,
      handler(vmodel, oldVal) {
        if (vmodel?.date != null) {
          this.$emit('update:from', vmodel.date.from)
          this.$emit('update:to', vmodel.date.to)
        }
        if (!this.advanced && !compareDate(oldVal, vmodel, 'equal')) {
          this.$emit(
            'update:modelValue',
            moment(vmodel).set({ seconds: 0, milliseconds: 0 }).toDate()
          )
        }
        if (!vmodel && this.advanced) {
          this.$emit('update:from', null)
          this.$emit('update:to', null)
        }
      }
    },
    '$store.getters.getLangCode'() {
      this.selects.calendarOptions = this.generateOptions()
    }
  },
  computed: {
    extQuery() {
      if (this.advanced) return { from: this.from, to: this.to }
      return this.$attrs.modelValue
    },
    mode() {
      if (this.modelValue) {
        switch (this.modelValue.value) {
          case 6:
            return 'more-months'
          case 7:
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
      if (this.modelValue == null) this.modelValue = getMidNight(moment()).toDate()
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
    getNumberFromDate() {
      let ret
      let tmp
      let date = JSON.stringify({ from: this.from, to: this.to })

      if (JSON.parse(date).from == null && JSON.parse(date).to == null) {
        ret = null
        return ret
      }
      const today = JSON.stringify(this.getCalendarOption(1).date)
      const yesterday = JSON.stringify(this.getCalendarOption(2).date)
      const currWeek = JSON.stringify(this.getCalendarOption(3).date)
      const prevWeek = JSON.stringify(this.getCalendarOption(4).date)
      const currMonth = JSON.stringify(this.getCalendarOption(5).date)

      // N.B. Il case 6 viene escluso dalla pre-valorizzazione ( poiché viene usato in modalità "Range" )
      switch (date) {
        case today:
          ret = 1
          break
        case yesterday:
          ret = 2
          break
        case currWeek:
          ret = 3
          break
        case prevWeek:
          ret = 4
          break
        case currMonth:
          ret = 5
          break
        default:
          ret = 7
          tmp = this.getCalendarOption(ret)
          tmp.date = {
            from: this.from ? moment(this.from).toDate() : getMidNight(moment()).toDate(),
            to: this.to ? moment(this.to).toDate() : getEndOf(moment(), 'day').toDate()
          }
          return tmp
      }
      return this.getCalendarOption(ret)
    },
    // TODO rendere globale se necessario ( se utilizzata 2 volte )
    getPreviousMonths() {
      let ret = []
      for (let i = 1; i <= 12; i++) {
        //AGGIUNGO 1 PERCHÈ I DECODE PARTONO DA 1 E I MONTH DA 0
        const monthValue = addPeriod(moment(), -i, 'months').month() + 1
        const yearValue = addPeriod(moment(), -i, 'months').year()

        ret.push({
          label: this.$translate('decode.month.' + monthValue) + ' ' + yearValue,
          value: this.getCalendarOption(6).updateDate(i)
        })
      }
      this.selects.previousMonths = ret
    },
    doReset() {
      // RESETTERÀ IL VMODEL
      this.modelValue = !this.unselectable ? this.getCalendarOption(this.startValue) : null
    },
    generateOptions() {
      return [
        {
          value: 1,
          label: this.$translate('admin.generic.calendar.today'),
          date: {
            from: getMidNight(moment()).toDate(),
            to: getEndOf(moment(), 'day').toDate()
          }
        },
        {
          value: 2,
          label: this.$translate('admin.generic.calendar.yesterday'),
          date: {
            from: getMidNight(getYesterday()).toDate(),
            to: getEndOf(getYesterday(), 'day').toDate()
          }
        },
        {
          value: 3,
          label: this.$translate('admin.generic.calendar.this.week'),
          date: {
            from: getMidNight(getStartOf(moment(), 'isoweek')).toDate(),
            to: getMidNight(getEndOf(moment(), 'isoweek')).toDate()
          }
        },
        {
          value: 4,
          label: this.$translate('admin.generic.calendar.last.week'),
          date: {
            from: getMidNight(getStartOf(addPeriod(moment(), -1, 'weeks'), 'isoweek')).toDate(),
            to: getMidNight(getEndOf(addPeriod(moment(), -1, 'weeks'), 'isoweek')).toDate()
          }
        },
        {
          value: 5,
          label: this.$translate('admin.generic.calendar.this.month'),
          date: {
            from: getMidNight(getStartOf(moment(), 'month')).toDate(),
            to: getMidNight(getEndOf(moment(), 'month')).toDate()
          }
        },
        {
          value: 6,
          label: this.$translate('admin.generic.other.months'),
          date: {
            from: getStartOf(addPeriod(moment(), -1, 'months'), 'month').toDate(),
            to: getEndOf(addPeriod(moment(), -1, 'months'), 'month').toDate()
          },
          updateDate(value) {
            return {
              ...this,
              date: {
                from: getStartOf(addPeriod(moment(), -value, 'months'), 'month').toDate(),
                to: getEndOf(addPeriod(moment(), -value, 'months'), 'month').toDate()
              }
            }
          }
        },
        {
          value: 7,
          label: this.$translate('admin.generic.select.date.range'),
          date: {
            from: getMidNight(moment()).toDate(),
            to: getEndOf(moment(), 'day').toDate()
          }
        }
      ]
    }
  },
  created() {
    if (this.advanced) {
      this.selects.calendarOptions = this.generateOptions()
      if (this.filteredOptions.length > 0) {
        this.selects.calendarOptions = this.selects.calendarOptions.filter((el) =>
          this.filteredOptions.includes(el.value)
        )
      }
    }
  },
  mounted() {
    if (this.advanced) {
      this.modelValue = this.getNumberFromDate()
      this.getPreviousMonths()
    } else {
      if (!this.empty) {
        this.modelValue = this.$attrs.modelValue
          ? moment(this.$attrs.modelValue)
              .set({
                seconds: 0,
                milliseconds: 0
              })
              .toDate()
          : getMidNight(moment()).toDate()
      }
    }
  }
}
</script>

<style scoped lang="scss">
#o-calendar {
  .p-inputgroup {
    width: 100%;
    min-height: 26px;

    :deep(.p-button) {
      padding: 0.2rem;
      width: 100%;
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
