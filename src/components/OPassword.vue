<template>
  <Password
    id="o-password"
    inputClass="w-100"
    v-model="value"
    :placeholder="handlePlaceholder()"
    :toggleMask="value.length > 0"
    :feedback="type !== 'old'"
  >
    <template #header>
      <div class="p-d-flex p-jc-between">
        <p class="p-text-bold" :class="{ 'p-mb-3': type !== 'new' }">
          {{ $store.getters.translate(`admin.generic.${type}.password`) }}
        </p>
        <div v-if="type === 'new'">
          {{ `${filteredArray.length} / ${level}` }}
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="type === 'new'">
        <hr />
        <p class="mt-2 p-text-bold">
          {{ $store.getters.translate('admin.generic.check.password.rules') }}
        </p>
        <p>
          {{ $store.getters.translate('admin.generic.check.password.length') }}
        </p>

        <ul class="p-pl-2 p-ml-2 p-mt-0" v-for="list in listCheckPassword" :key="list">
          <li :class="filteredArray.includes(list.condition) && 'text-success p-text-bold'">
            <i :class="passwordValidityIcon(list.condition)"> </i>
            {{ list.label }}
          </li>
        </ul>
      </div>
      <div v-if="type === 'confirm'">
        <hr />
        <label class="p-text-bold">
          {{ $store.getters.translate('admin.generic.check.password.compare') }}
        </label>
      </div>
    </template>
  </Password>
</template>
<script>
export default {
  name: 'OPassword',
  data() {
    return {
      value: '',
      passwordContain: [],
      filteredArray: [],
      listCheckPassword: [
        {
          label: this.$store.getters.translate('admin.generic.check.password.lowercase'),
          condition: 'lowercase'
        },
        {
          label: this.$store.getters.translate('admin.generic.check.password.uppercase'),
          condition: 'uppercase'
        },
        {
          label: this.$store.getters.translate('admin.generic.check.password.symbol'),
          condition: 'symbol'
        },
        {
          label: this.$store.getters.translate('admin.generic.check.password.number'),
          condition: 'number'
        }
      ]
    }
  },
  props: {
    level: {
      type: Number,
      default: 4
    },
    type: {
      type: String,
      default: 'old'
    },
    componentClass: { type: String, default: () => 'w-100' },
    placeholder: String
  },
  watch: {
    value(val) {
      let lowercase = /[a-z]+/
      let uppercase = /[A-Z]+/
      let numbers = /[0-9]+/
      this.passwordContain = []
      this.filteredArray = []
      for (let letter of val.trim()) {
        if (letter) {
          if (lowercase.test(letter)) {
            this.passwordContain.push('lowercase')
          }
          if (uppercase.test(letter)) {
            this.passwordContain.push('uppercase')
          }
          if (numbers.test(letter)) {
            this.passwordContain.push('number')
          }
          if (!lowercase.test(letter) && !uppercase.test(letter) && !numbers.test(letter)) {
            this.passwordContain.push('symbol')
          }
          this.filteredArray = [...new Set(this.passwordContain)]
        } else {
          this.passwordContain = []
        }
      }
      this.checkPassword()
      this.$emit('update:modelValue', val)
    },
    clearInput(val) {
      if (val === true) {
        this.value = ''
      }
    }
  },
  methods: {
    handlePlaceholder() {
      if (!this.placeholder === undefined) {
        return this.$store.getters.translate(`admin.generic.enter.${this.type}.password`)
      }
      return this.placeholder
    },
    passwordValidityIcon(condition) {
      return this.filteredArray.includes(condition)
        ? 'fad fa-circle-check p-mr-1 fa-lg text-success'
        : 'fad fa-circle-xmark p-mr-1 fa-lg text-danger'
    },
    // Check su true manda emit che deve abilitare il button.
    checkPassword() {
      if (this.value.length >= 8 && this.filteredArray.length === this.level) {
        this.$emit('check', true)
      } else {
        this.$emit('check', false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.p-input-icon-right {
  :deep(svg) {
    right: 0.5rem;
  }
}
ul li {
  list-style: none;
  line-height: 1.8;
}
</style>
