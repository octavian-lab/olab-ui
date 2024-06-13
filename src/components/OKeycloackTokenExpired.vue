<template>
  <div
    class="p-2 h-5rem flex align-items-center"
    :style="{
      background: 'var(--surface-800)'
    }"
  >
    <img :src="logo" class="h-3rem" />
  </div>
  <div class="h-full">
    <OLottie name="user-sleeping" :height="450" width="100%" />
    <div class="text-center">
      <div class="my-3 font-bold text-2xl">
        {{ $translate('admin.generic.session.expired') }}
      </div>
      <Button
        :label="$translate('admin.generic.do.login')"
        icon="fad fa-sign-in"
        @click="useKeycloack().getAccessCode(clientId)"
      />
    </div>
  </div>
</template>
<script>
import { useKeycloack } from '@/mixins/keycloack.js'

export default {
  props: {
    clientId: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true,
      default: () => 'https://cdn.octavianlab.com/v3/bo/octavianlab/logo.png'
    }
  },
  methods: {
    useKeycloack
  }
}
</script>
