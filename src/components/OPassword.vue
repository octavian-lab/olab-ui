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
          {{ $translate(`admin.generic.${type}.password`) }}
        </p>
        <div v-if="type === 'new'">
          {{ `${filteredArray.length} / ${levelToCheck()}` }}
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="type === 'new'">
        <hr />
        <p class="mt-2 p-text-bold">
          {{ $translate('admin.generic.check.password.rules') }}
        </p>
        <p>
          {{ $translate('admin.generic.check.password.length') }}: {{lengthToCheck()}}
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
          {{ $translate('admin.generic.check.password.compare') }}
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
          label: this.$translate('admin.generic.check.password.lowercase'),
          condition: 'lowercase'
        },
        {
          label: this.$translate('admin.generic.check.password.uppercase'),
          condition: 'uppercase'
        },
        {
          label: this.$translate('admin.generic.check.password.symbol'),
          condition: 'symbol'
        },
        {
          label: this.$translate('admin.generic.check.password.number'),
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
    placeholder: String,
    configKey: { type: String, default: () => null }
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
    getConfig(key) {
      // SE È PLAYER VIENE DAL PORTALE DI GIOCO CHE UTILIZZA UN GETTERS DIVERSO DA QUELLO DE BO
      return this.configKey === 'player'
        ? this.$store.getters.configByKey(`password.policy.${this.configKey}.min.${key}`)
        : this.$store.getters.getConfigByKey(`password.policy.${this.configKey}.min.${key}`)
    },
    levelToCheck() {
      if (!this.configKey) return this.level
      return +this.getConfig('groups')
    },
    lengthToCheck() {
      if (!this.configKey) return 8
        return +this.getConfig('length')
    },
    handlePlaceholder() {
      if (!this.placeholder === undefined) {
        return this.$translate(`admin.generic.enter.${this.type}.password`)
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
      if (this.value.length >= this.lengthToCheck() && this.filteredArray.length === this.levelToCheck()) {
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