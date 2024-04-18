<template>
  <div id="banner-browser-support">
    <div
      v-if="!isSupported"
      class="banner p-3 font-bold bg-warning absolute top-0 left-0 right-0 flex flex-row justify-content-between align-items-center"
    >
      <div class="flex align-items-center">
        <div>
          Al momento ti trovi su un browser NON supportato. Ti invitiamo a scaricare uno dei
          seguenti Browser:
        </div>
        <Button class="ml-2" :icon="icon.chrome" label="Chrome" @click="openLink(link.chrome)" />
        <Button class="ml-2" :icon="icon.firefox" label="Firefox" @click="openLink(link.firefox)" />
      </div>
      <div class="flex align-items-center justify-content-between">
        <Button class="p-button-danger" icon="fa-solid fa-xmark" @click="toggle()" />
      </div>
    </div>
  </div>
</template>

<script>
import UAParser from 'ua-parser-js'
export default {
  name: 'OBannerBrowserSupport',
  data() {
    return {
      supportedBrowsers: ['Chrome', 'Firefox'],
      parser: new UAParser(),
      isSupported: true,
      link: {
        chrome: 'https://www.google.com/intl/it_it/chrome/',
        firefox: 'https://www.mozilla.org/it/firefox/new/'
      },
      icon: {
        chrome: 'fa-brands fa-chrome',
        firefox: 'fa-brands fa-firefox-browser'
      }
    }
  },
  methods: {
    toggle() {
      this.isSupported = !this.isSupported
    },
    openLink(link) {
      window.open(link, '_blank')
    },
    checkBrowserSupport() {
      const browser = this.parser.getBrowser().name
      this.isSupported = this.supportedBrowsers.some((el) => {
        return el.includes(browser)
      })
    }
  },
  mounted() {
    this.checkBrowserSupport()
  }
}
</script>
<style lang="scss" scoped>
.banner {
  height: 4rem;
  z-index: 2000;
}
</style>
