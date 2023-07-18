<template>
  <div>
    <div>Test span22</div>
    <Tag> Test tag </Tag>
  </div>

  <!--  <Tag> Test tag prime vue </Tag>-->
  <!--  <div v-for="el in items" :key="el" :class="oListClass()">-->
  <!--    &lt;!&ndash; LABEL &ndash;&gt;-->
  <!--    <div :class="['p-text-bold', el.labelClass, { 'p-px-3': striped }]">-->
  <!--      {{ $store.getters.translate(`${el.label}`) }}:-->
  <!--    </div>-->
  <!--    &lt;!&ndash; VALUE &ndash;&gt;-->
  <!--    <div :class="{ 'p-px-3 dx': striped }">-->
  <!--      <span v-if="el.value == null || el.value === ''">-</span>-->
  <!--      <img-->
  <!--        v-else-if="checkType(el.valueType) === 'flag'"-->
  <!--        :class="`flag flag-${el.value.toLowerCase()}`"-->
  <!--      />-->
  <!--      <span v-else-if="checkType(el.valueType) === 'boolean' && el.valueType.showIcon === false">-->
  <!--        {{ $store.getters.translate(`admin.message.olist.boolean.${el.value}`) }}-->
  <!--      </span>-->
  <!--      <span-->
  <!--        v-else-if="checkType(el.valueType?.type) === 'boolean' && el.valueType.reverse === true"-->
  <!--      >-->
  <!--        <span>{{ $store.getters.translate(`admin.message.olist.boolean.${el.value}`) }} - </span>-->
  <!--        <i :class="`fad fa-lg ${setIcon(!el.value)}`" />-->
  <!--      </span>-->
  <!--      <i-->
  <!--        v-else-if="checkType(el.valueType) === 'boolean'"-->
  <!--        :class="`fad fa-lg ${setIcon(el.value)}`"-->
  <!--      />-->
  <!--      <span v-else-if="checkType(el.valueType) !== 'string' && Array.isArray(elaborateValue(el))">-->
  <!--        <Tag :class="el.valueClass" v-for="tag in elaborateValue(el)" :key="tag">{{ tag }}</Tag>-->
  <!--      </span>-->
  <!--      <span v-else :class="el.valueClass">-->
  <!--        {{ elaborateValue(el) }}-->
  <!--      </span>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script>
// import Tag from 'primevue/tag'
export default {
  name: 'OList',
  // components: { Tag }
  // props: {
  //   items: { type: Array, required: false, default: () => [] },
  //   striped: { Type: Boolean, default: () => true }
  // },
  // methods: {
  //   oListClass() {
  //     const dynamicClass = this.striped ? 'striped-row' : 'border-bottom'
  //     return [`p-d-flex p-jc-between p-ai-center p-py-2`, [dynamicClass]]
  //   },
  //   checkType(valueType) {
  //     if (valueType == null) return 'string'
  //     if (typeof valueType === 'string') return valueType
  //     return valueType.type
  //   },
  //   setIcon(value) {
  //     switch (value) {
  //       case true:
  //         return 'fa-circle-check text-success'
  //       case false:
  //         return 'fa-circle-xmark text-danger'
  //     }
  //   },
  //   elaborateValue(field) {
  //     let ret = field.value
  //     const type = this.checkType(field.valueType)
  //     if (!type) {
  //       console.warn('Type is not defined')
  //       return
  //     }
  //     // CASO IN CUI RICEVO UNA STRINGA SOTTOFORMA DI ARRAY LA TRANSFORMO COME TALE
  //     if (type === 'array' && this.isParsable(ret)) ret = JSON.parse(ret)
  //
  //     // CASO IN CUI IL VALORE DA STAMPARE È VINCOLATO DA UNA TRADUZIONE
  //     if (field.translator != null) {
  //       ret = this.$store.getters.translate(`${field.translator}.${ret}`)
  //       if (field.prependValue) ret = `${field.value} - ${ret}`
  //     }
  //
  //     if (type === 'number') {
  //       const symbol =
  //         field.valueType.symbol || this.$store.getters.info?.idCurrency || this.defaultCurrency
  //       if (type === 'number' && symbol === '%') {
  //         ret = this.$filters.asPercentage(ret)
  //       } else {
  //         ret = this.$filters.asAmount(ret, symbol)
  //       }
  //     }
  //
  //     if (type === 'date') {
  //       ret = this.$filters.asDate(ret, field.valueType.format)
  //     }
  //
  //     return ret
  //   }
  // }
}
</script>
<!--<style lang="scss" scoped>-->
<!--.border-bottom:not(:last-child) {-->
<!--  border-bottom: 1px solid #e0e0e0;-->
<!--}-->
<!--.striped-row {-->
<!--  &:nth-child(odd) {-->
<!--    background-color: transparent;-->
<!--  }-->
<!--  &:nth-child(even) {-->
<!--    background-color: #e8e8e8;-->
<!--  }-->
<!--}-->
<!--</style>-->
