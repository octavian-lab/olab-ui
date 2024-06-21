<template>
  <div
    v-if="!isModal"
    class="p-2 h-5rem flex align-items-center"
    :style="{
      background: headerColor
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
      <OKeycloakLoginButton :clientId="clientId" width="w-auto" />
    </div>
  </div>
</template>
<script>
import OKeycloakLoginButton from '@/components/OKeycloak/OKeycloakLoginButton.vue'
export default {
  components:{
    OKeycloakLoginButton
  },
  props: {
    clientId: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true,
      default: () => 'https://cdn.octavianlab.com/v3/bo/octavianlab/logo.png'
    },
    isModal: {
      type: Boolean,
      default: () => false
    },
    headerColor:{
      type:String,
      default: ()=> '#1e1e1e'
    }
  }
}
</script>
