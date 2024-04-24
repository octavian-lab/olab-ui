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
        v-bind="$attrs"
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
        :options="selects.calendarOptions"
        :showClear="unselectable"
        dataKey="value"
        option-label="label"
        :placeholder="$translate('admin.generic.select.date.type')"
      />
      <!--  CALENDAR DEFAULT: VISIBILE DA DESKTOP  -->
      <SelectButton
        v-else-if="isDesktop && mode === 'default'"
        :options="selects.calendarOptions"
        v-model="modelValue"
        optionLabel="value"
        :allowempty="unselectable === true ? undefined : false"
      >
        <template #option="{ option }">
          <div class="font-xs">{{ option.label }}</div>
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
          showTime
          :placeholder="$translate('admin.generic.from')"
          dateFormat="dd/mm/yy"
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
          showTime
          :placeholder="$translate('admin.generic.to')"
          dateFormat="dd/mm/yy"
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
        periods: [
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
          },
          ...this.generatePeriods()
        ]
      }
    }
  },
  watch: {
    extQuery(val) {
      if (this.advanced) {
        if (!val.from && !val.to) this.doReset()
        if (val && typeof val.from === 'string' && this.advanced) {
          this.modelValue = this.getNumberFromDate()
        }
      } else {
        this.modelValue = val
      }
    },
    // Trasformazione da oggetto calendar smart a query per tutti i panels.
    modelValue: {
      deep: true,
      handler(vmodel, oldVal) {
        if (!vmodel) {
          this.$emit('update:from', null)
          this.$emit('update:to', null)
        }
        if (vmodel?.date != null) {
          this.$emit('update:from', vmodel.date.from)
          this.$emit('update:to', vmodel.date.to)
        }
        if (!this.advanced && !this.compareDate(oldVal, vmodel, 'equal')) {
          const valueToEmit =
            vmodel != null ? moment(vmodel).set({ seconds: 0, milliseconds: 0 }).toDate() : null
          this.$emit('update:modelValue', valueToEmit)
        }
      }
    },
    '$store.getters.getLangCode'() {
      this.selects.calendarOptions = this.generateOptions()
      this.filterOptions()
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
    },
    defaultDropdownOptions() {
      let ret = []
      switch (this.mode) {
        case 'more-months':
          ret = this.selects.previousMonths
          break
        case 'periods':
          ret = this.selects.periods
          break
      }
      return ret
    }
  },
  methods: {
    setMidnight() {
      if (this.modelValue == null) this.modelValue = this.getMidNight(moment()).toDate()
    },
    doChangeDay(amount, dataToChange) {
      if (!dataToChange) {
        if (!this.modelValue) {
          this.modelValue = this.getMidNight(moment()).toDate()
        }
        this.modelValue = this.addPeriod(moment(this.modelValue), amount, 'days')
        return
      }
      this.modelValue.date[dataToChange] = this.addPeriod(
        moment(this.modelValue.date[dataToChange]),
        amount,
        'days'
      ).toDate()
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
      const currMonth = JSON.stringify(this.getCalendarOption(4).date)

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
            from: this.from ? moment(this.from).toDate() : this.getMidNight(moment()).toDate(),
            to: this.to ? moment(this.to).toDate() : this.getEndOf(moment(), 'day').toDate()
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
        const monthValue = this.addPeriod(moment(), -i, 'months').month() + 1
        const yearValue = this.addPeriod(moment(), -i, 'months').year()

        ret.push({
          label: this.$translate('decode.month.' + monthValue) + ' ' + yearValue,
          value: this.getCalendarOption(5).updateDate(i)
        })
      }
      this.selects.previousMonths = ret
    },
    doReset() {
      // RESETTERÀ IL VMODEL
      this.modelValue = this.unselectable === true ? this.getCalendarOption(this.startValue) : null
    },
    generatePeriods() {
      const arr = [3, 7, 15, 30, 60, 90]
      let ret = []
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
            from: this.getMidNight(moment()).toDate(),
            to: this.getEndOf(moment(), 'day').toDate()
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
          : this.getMidNight(moment()).toDate()
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
