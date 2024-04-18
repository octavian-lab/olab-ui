<template>
  <div id="banner-browser-support">
    <div
      v-if="isSupported"
      class="banner p-3 font-bold bg-warning absolute top-0 left-0 right-0 flex flex-row justify-content-between"
    >
      <div>
        <p>
          Al momento ti trovi su un browser non supportato. Ti invitiamo a scaricare uno dei
          seguenti Browser:
        </p>
        <ul>
          <li>
            <a :href="link.chrome" target="_blank">
              <i :class="icon.chrome"><span class="ml-1">Download Chrome</span></i></a
            >
          </li>
          <li class="mt-2">
            <a :href="link.firefox" target="_blank">
              <i :class="icon.firefox"><span class="ml-1">Download Firefox</span></i></a
            >
          </li>
        </ul>
      </div>
      <div class="flex align-items-center justify-content-between">
        <Button icon="fa-solid fa-xmark" @click="toggle()" />
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
  height: fit-content;
  z-index: 1000;
}
</style>
