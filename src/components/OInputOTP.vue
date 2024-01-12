<template>
  <div ref="otpInput">
    <input
      type="text"
      inputmode="numeric"
      class="digit-box"
      v-for="(el, i) in digits"
      :key="el + i"
      v-model="digits[i]"
      :autofocus="i === 0"
      maxlength="1"
      @keydown.exact="handleKeyDown($event, i)"
      :class="{ bounce: digits[i] !== null }"
      @keydown.ctrl.v.exact="onPaste($event)"
      @keydown.meta.v.exact="onPaste($event)"
      @paste="onPaste($event)"
    />
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps, computed } from 'vue'
// PROPS
const props = defineProps({
  default: String,
  error: {
    type: Boolean,
    default: () => false
  },
  digitCount: {
    type: Number,
    default: () => 4
  }
})

const digits = reactive([])

if (props.default && props.default.length === props.digitCount) {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = props.default.charAt(i)
  }
} else {
  for (let i = 0; i < props.digitCount; i++) {
    digits[i] = null
  }
}

const otpInput = ref(null)

const emit = defineEmits(['update:modelValue', 'onPaste'])

const dynamicBorderColor = computed(() => {
  let ret
  if (props.error) ret = 'red'
  else ret = 'black'
  return ret
})

const isDigitsFull = () => {
  for (const elem of digits) {
    if (elem == null) {
      return false
    }
  }
  return true
}

const handleKeyDown = (event, index) => {
  if (event.key !== 'Tab' && event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
    event.preventDefault()
  }

  if (event.key === 'Backspace') {
    digits[index] = null

    if (index != 0) {
      otpInput.value.children[index - 1].focus()
    }

    return
  }

  if (new RegExp('^([0-9])$').test(event.key)) {
    digits[index] = event.key

    if (index != props.digitCount - 1) {
      otpInput.value.children[index + 1].focus()
    }

    if (isDigitsFull()) {
      emit('update:modelValue', digits.join(''))
    }
  }
}

const onPaste = async (event) => {
  event.preventDefault()

  let text
  if (event.type === 'paste') text = event.clipboardData.getData('text')
  else if (navigator.clipboard.readText) text = await navigator.clipboard.readText()
  else return
  if (!text) return

  text.trim()
  text = text.replaceAll(' ', '')
  if (text.length !== digits.length) return

  const arr = text.split('')
  digits.forEach((el, i) => {
    digits[i] = arr[i]
  })

  emit('onPaste')
}
</script>

<style scoped>
.digit-box {
  width: 2.75rem;
  aspect-ratio: 1;
  border: 2px solid v-bind(dynamicBorderColor);
  display: inline-block;
  border-radius: 5px !important;
  margin: 5px;
  text-align: center;
  font-size: 1.5rem;

  @media (min-width: 576px) {
    width: 4rem;
    font-size: 2rem;
  }
}

.digit-box:focus {
  outline: 3px solid v-bind(dynamicBorderColor);
}

.bounce {
  animation: pulse 0.3s ease-in-out alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
</style>
