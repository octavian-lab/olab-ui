<template>
  <div id="banner-browser-support" class="zIndex font-bold fixed top-0 left-0 right-0">
    <div
      v-if="!showBanner"
      class="p-3 h-5rem bg-red-500 font-bold flex flex-row justify-content-between align-items-center"
    >
      <div class="flex align-items-center">
        <div>
          <i class="fad fa-triangle-exclamation text-xl mr-1"></i
          >{{ $translate('admin.generic.browser.not.supported') }}
        </div>
        <img
          class="h-2rem w-2rem ml-3"
          src="../assets/images/chrome.svg"
          alt=""
          @click="openLink(link.chrome)"
        />
        <img
          class="h-2rem w-2rem ml-3"
          src="../assets/images/firefox.svg"
          alt=""
          @click="openLink(link.firefox)"
        />
      </div>
      <Button class="text-2xl text-white ml-2" text icon="fa-solid fa-xmark" @click="closeBanner" />
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
      showBanner: null,
      link: {
        chrome: 'https://www.google.com/intl/it_it/chrome/',
        firefox: 'https://www.mozilla.org/it/firefox/new/'
      }
    }
  },
  methods: {
    closeBanner() {
      this.showBanner = true
    },
    openLink(link) {
      window.open(link, '_blank')
    },
    checkBrowserSupport() {
      const browser = this.parser.getBrowser().name
      this.showBanner = this.supportedBrowsers.some((el) => {
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

img {
  cursor: pointer;
}
</style>
