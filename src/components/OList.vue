<template>
  <div id="o-list" :class="oListContainerClass()">
    <slot>
      <div v-for="el in items" :key="el" :class="oListClass()">
        <!-- LABEL -->
        <div :class="['font-bold', el.labelClass, { 'px-3': striped }]">
          {{ elaborateLabel(el.label) }}:
        </div>
        <!-- VALUE -->
        <div :class="{ 'px-3 text-right': striped }">
          <span
            v-if="
              el.value == null ||
              el.value === '' ||
              (Array.isArray(el.value) && el.value.length === 0)
            "
            >-
          </span>
          <img
            v-else-if="checkType(el.valueType) === 'flag'"
            :class="`flag flag-${el.value.toLowerCase()}`"
          />
          <span
            v-else-if="checkType(el.valueType) === 'boolean' && el.valueType.showIcon === false"
          >
            {{ $translate(`admin.message.olist.boolean.${el.value}`) }}
          </span>
          <span
            v-else-if="checkType(el.valueType?.type) === 'boolean' && el.valueType.reverse === true"
          >
            <span>{{ $translate(`admin.message.olist.boolean.${el.value}`) }} - </span>
            <i :class="`fad fa-lg ${setIcon(!el.value)}`" />
          </span>
          <i
            v-else-if="checkType(el.valueType) === 'boolean'"
            :class="`fad fa-lg ${setIcon(el.value)}`"
          />
          <span
            v-else-if="checkType(el.valueType) !== 'string' && Array.isArray(elaborateValue(el))"
          >
            <Tag :class="el.valueClass" v-for="tag in elaborateValue(el)" :key="tag">{{ tag }}</Tag>
          </span>
          <span v-else :class="el.valueClass">
            {{ elaborateValue(el) }}
          </span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'OList',
  props: {
    items: { type: Array, required: false, default: () => [] },
    striped: { Type: Boolean, default: () => true },
    col: { Type: Number, default: () => 1 },
    groupTable: { Type: Boolean, default: () => false }
  },
  data() {
    return {
      defaultCurrency: 'EUR'
    }
  },
  methods: {
    oListClass() {
      let dynamicClass = 'o-list-item flex justify-content-between align-items-center py-2'
      switch (this.striped) {
        case true:
          if (this.col === 1) {
            dynamicClass += ' striped-row'
          } else {
            dynamicClass += ' divided-striped'
          }
          break
        case false:
          dynamicClass += ' border-bottom'
          break
      }
      if (this.col === 1 || this.isMobile) dynamicClass += ' w-full'
      return dynamicClass
    },
    oListContainerClass() {
      return [
        { divided: this.col > 1 },
        { 'group-table-mode': this.groupTable },
        { 'slot-olist': this.$slots.default },
        { 'striped-slot-olist': this.$slots.default && this.striped }
      ]
    },
    checkType(valueType) {
      if (valueType == null) return 'string'
      if (typeof valueType === 'string') return valueType
      return valueType.type
    },
    setIcon(value) {
      switch (value) {
        case true:
          return 'fa-circle-check text-success'
        case false:
          return 'fa-circle-xmark text-danger'
      }
    },
    elaborateLabel(label) {
      let ret = label
      if (label.startsWith('admin')) ret = this.$translate(ret)
      return ret
    },
    elaborateValue(field) {
      let ret = field.value
      const type = this.checkType(field.valueType)
      if (!type) {
        console.warn('Type is not defined')
        return
      }
      // CASO IN CUI RICEVO UNA STRINGA SOTTOFORMA DI ARRAY LA TRANSFORMO COME TALE
      if (type === 'array' && this.isParsable(ret)) ret = JSON.parse(ret)

      // CASO IN CUI IL VALORE DA STAMPARE È VINCOLATO DA UNA TRADUZIONE
      if (field.translator != null) {
        ret = this.$translate(`${field.translator}.${ret}`)
        if (field.prependValue) ret = `${field.value} - ${ret}`
      }

      if (type === 'number') {
        const symbol =
          field.valueType.symbol || this.$store.getters.info?.idCurrency || this.defaultCurrency
        if (type === 'number' && symbol === '%') {
          ret = this.$filters.asPercentage(ret)
        } else {
          ret = this.$filters.asAmount(ret, symbol)
        }
      }

      if (type === 'date') {
        ret = this.$filters.asDate(ret, field.valueType.format)
      }

      return ret
    }
  }
}
</script>
<style lang="scss" scoped>
#o-list {
  //CASO COL 2
  &.divided {
    display: flex;
    flex-wrap: wrap;

    .o-list-item {
      width: 50%;
      &.divided-striped {
        &:nth-child(4n + 2),
        &:nth-child(4n + 3) {
          background: var(--surface-ground) !important;
        }
      }
    }
  }

  &.slot-olist {
    //STRIPED PER SLOT
    &.striped-slot-olist {
      :deep(div) {
        &:nth-child(odd) {
          background-color: transparent;
        }

        &:nth-child(even) {
          background-color: var(--surface-ground);
        }
      }
    }
    :deep(div) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.3rem 0;
      border-bottom: 1px solid var(--surface-border);
      &:last-child {
        border-bottom: none;
      }
      > div,
      > span {
        &:first-child {
          font-weight: bold;
        }
      }
    }
  }

  //TODO: una volta rimossa la classe group-table dalla cdn rinominare questa classe group-table
  &.group-table-mode {
    font-size: 0.8rem !important;

    .o-list-item {
      padding: 0.3rem 0.2rem !important;
    }
  }

  .border-bottom:not(:last-child) {
    border-bottom: 1px solid var(--surface-border);
  }
  //PER SINGOLA COLONNA
  .striped-row {
    &:nth-child(odd) {
      background-color: transparent;
    }

    &:nth-child(even) {
      background-color: var(--surface-ground);
    }
  }
}
</style>
