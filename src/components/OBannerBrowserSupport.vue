<template>
  <div id="banner-browser-support" class="zIndex font-bold fixed top-0 left-0 right-0">
    <div
      v-if="!isSupported"
      class="p-3 h-5rem bg-red-500 font-bold bg-warning flex flex-row justify-content-between align-items-center"
    >
      <div class="flex align-items-center">
        <div>
          <i class="fad fa-triangle-exclamation text-xl mr-1"></i
          >{{ $translate('admin.generic.browser.not.supported') }}
        </div>
        <Button
          outlined
          class="ml-2 border-none"
          :icon="icon.chrome"
          @click="openLink(link.chrome)"
        >
          <img class="h-2rem w-2rem" src="../assets/images/chrome.svg" alt="" />
        </Button>

        <Button
          outlined
          class="ml-2 border-none"
          :icon="icon.firefox"
          @click="openLink(link.firefox)"
        >
          <img class="h-2rem w-2rem" src="../assets/images/firefox.svg" alt="" />
        </Button>
      </div>
      <div class="flex align-items-center justify-content-between">
        <Button class="p-button-sm ml-2" icon="fa-solid fa-xmark" @click="toggle()" />
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
.zIndex {
  z-index: 2000;
}
</style>
