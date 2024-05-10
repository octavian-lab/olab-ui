<template>
  <div id="banner-browser-support" class="banner font-bold fixed top-0 left-0 right-0 shadow-4">
    <div
      v-if="!showBanner"
      class="p-3 pb-0 md:pb-3 flex flex-column md:flex-row md:justify-content-between align-items-center"
    >
      <div class="flex flex-column md:flex-row align-items-center">
        <div class="flex align-items-center text-white text-shadow">
          <i class="fad fa-triangle-exclamation text-4xl mr-2"></i>
          <span class="text-xl font-bold">{{
            $translate('admin.generic.browser.not.supported')
          }}</span>
        </div>
        <div class="mt-2 md:mt-0 md:ml-4">
          <img
            class="h-2rem mr-4 line-shadow"
            src="../assets/images/chrome.svg"
            alt=""
            @click="openLink(link.chrome)"
          />
          <img
            class="h-2rem line-shadow"
            src="../assets/images/firefox.svg"
            alt=""
            @click="openLink(link.firefox)"
          />
        </div>
      </div>
      <Button
        class="text-4xl text-white text-shadow"
        text
        icon="fa-solid fa-xmark"
        @click="closeBanner()"
      />
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
.banner {
  z-index: 10000;
  background-color: #7c0a02;
}
.text-shadow {
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
}
img {
  cursor: pointer;
  &.line-shadow {
    filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
  }
}
</style>
