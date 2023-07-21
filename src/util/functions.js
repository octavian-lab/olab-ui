import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'

export const useImage = (url) => {
  return new URL(`../${url}`, import.meta.url).href
}

export function isMobile(dim = '(max-width: 640px)') {
  return useMediaQuery(dim)
}

export function isTablet(dim = '(min-width: 641px) and (max-width: 991px)') {
  return useMediaQuery(dim)
}

export function isDesktop() {
  return computed(() => !isMobile && !isTablet)
}

export function isParsable(str) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export function generateSelects(data, optionValue, optionLabel) {
  const ret = []
  if (!Array.isArray(data)) {
    console.warn('Generazione select impossibile non è un array o è un array vuoto: ', data)
    return ret
  }

  for (let el of data) {
    ret.push({
      label: el[optionLabel],
      value: el[optionValue]
    })
  }

  return ret
}

// todo export function setTranslateKeyAttribute(prefix, name) {
//   return this.$translate(prefix + name, '', true)
//     .replaceAll('-', '')
//     .replaceAll(' ', '')
// }
