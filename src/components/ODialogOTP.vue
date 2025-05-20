<template>
  <ODialog
    :name="$options.name.toLowerCase()"
    id="o-dialog-otp"
    label="OTP Authenticator"
    icon="fad fa-user-shield"
    :style="{ width: '500px', overflow: 'hidden', minHeight: '200px', position: 'relative' }"
    :breakpoints="{ '1200px': '40vw', '960px': '70vw', '640px': '95%' }"
    position="top"
    :show-required-text="false"
    :draggable="false"
    :modal="true"
    :closable="false"
  >
    <div class="field col-12 text-center" v-if="$modal.data.seed != null">
      <span class="font-bold text-sm flex align-items-center">
        <i class="fad fa-2x fa-square-1 mr-1" />
        {{ $translate('admin.otp.downloadapp.from.store') }}
      </span>
      <!-- BOTTONI SOCIALS APP DOWNLOAD IOS/ANDROID  -->
      <div class="flex justify-content-center align-items-center">
        <a
          class="btn-store"
          href="https://apps.apple.com/it/app/google-authenticator/id388497605"
          target="_blank"
        >
          <i class="fab fa-apple" />
          <p>
            Disponibile su <br />
            <span class="big-txt">App Store</span>
          </p>
        </a>
        <a
          class="btn-store"
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
          target="_blank"
        >
          <img class="google-play-icon" src="@/assets/images/google-play.svg" alt="GPlay" />
          <p>
            Disponibile su <br />
            <span class="big-txt">Google Play</span>
          </p>
        </a>
      </div>
    </div>

    <div class="field col-12" v-if="$modal.data.seed != null">
      <span class="font-bold text-sm flex align-items-center">
        <i class="fad fa-2x fa-square-2 mr-1" />
        {{ $translate('admin.otp.scan.qr') }}
      </span>

      <div class="text-center mt-3">
        <QRCode
          :width="175"
          :height="175"
          :value="qrcode.value"
          :image="qrcode.logo"
          :imageOptions="{ crossOrigin: 'anonymous', margin: 10 }"
          :backgroundOptions="{ color: 'transparent' }"
          :cornersDotOptions="qrcode.cornerDots"
          :dotsOptions="qrcode.dots"
        />
      </div>
    </div>

    <div class="field col-12 text-center">
      <span class="font-bold text-sm flex align-items-center">
        <i
          :class="['fad fa-2x mr-1', $modal.data.seed != null ? 'fa-square-3' : 'fa-square-info']"
        />
        {{ $translate('admin.otp.enter.pin') }}
      </span>
      <OInputOTP
        :error="$modal.data.error"
        :digit-count="digitCount"
        v-model="$modal.data.seedCode"
      />
    </div>

    <template #footer>
      <Button
        label="Enter"
        :class="['uppercase font-bold', { 'p-button-sm': isMobile }]"
        icon="fad fa-shield-keyhole"
        :loading="$loading.isLoading('login')"
        :disabled="$modal.data.seedCode == null"
        @click="$emit('doLogin')"
      />
    </template>
  </ODialog>
</template>
<script>
import QRCode from 'qrcode-vue3'
import OInputOTP from '@/components/OInputOTP.vue'

export default {
  name: 'ODialogOTP',
  components: { QRCode, OInputOTP },
  props: {
    logoQR: { type: String, default: () => '' },
    digitCount: { type: Number, default: () => 6 }
  },
  watch: {
    '$modal.data.seedCode'(code) {
      if (code.length === this.digitCount) {
        this.$emit('doLogin')
      }
    }
  },
  computed: {
    qrcode() {
      return {
        value: `otpauth://totp/${localStorage.getItem('site')}: ${
          this.$modal.data.username
        }?secret=${this.$modal.data.seed}`,
        logo: this.logoQR || undefined,
        cornerDots: { type: 'rounded', color: '#000000' },
        dots: {
          type: 'dots',
          color: '#000000',
          gradient: {
            type: 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: '#000000' },
              { offset: 1, color: '#000000' }
            ]
          }
        }
      }
    }
  },
  methods: {
    generateBase32Secret() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
      let sb = ''

      for (let i = 0; i < 16; i++) {
        const val = Math.floor(Math.random() * 32)
        if (val < 26) {
          sb += chars.charAt(val)
        } else {
          sb += chars.charAt(2 + (val - 26))
        }
      }

      return sb
    }
  },
  unmounted() {
    this.$modal.close()
  }
}
</script>
<style lang="scss">
#o-dialog-otp {
  // Buttons stile app download
  .btn-store {
    display: flex;
    padding: 5px;
    width: 45%;
    max-width: 160px;
    color: #fff;
    margin: 20px 10px;
    text-align: left;
    border-radius: 5px;
    text-decoration: none;
    font-family: 'Lucida Grande', sans-serif;
    text-transform: uppercase;
    font-size: 9px;
    background-color: #101010;
    transition: background-color 0.25s linear;
    &:hover {
      background-color: #454545;
    }
    img.google-play-icon {
      @media (max-width: 375px) {
        width: 30px;
      }
      width: 45px;
    }
    i {
      width: 20%;
      text-align: center;
      font-size: 28px;
      margin-right: 7px;
      @media (max-width: 600px) {
        font-size: 20px;
      }
      &.fa-apple {
        @media (max-width: 600px) {
          font-size: 21px;
        }
        font-size: 33px;
        margin-right: 12px;
      }
    }
    .big-txt {
      font-size: 14px;
      font-weight: bold;
      text-transform: capitalize;
      @media (max-width: 600px) {
        font-size: 11px;
      }
    }
  }
}
</style>
