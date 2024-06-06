<template>
  <Button label="vai a keycloak" @click="useKeycloack().getAccessCode(clientId, redirectUrl)" />
  <Button
    class="mx-2"
    label="prendi code"
    @click="useKeycloack().getAccessToken(clientId, redirectUrl, clientSecret)"
  />
  <Button
    label="controlla token"
    @click="useKeycloack().checkAndRefreshToken(clientId, clientSecret)"
  />
</template>
<script>
import { useKeycloack } from '@/mixins/keycloack.js'
export default {
  name: 'OKeycloackAuth',
  data() {
    return {
      code: null
    }
  },
  methods: {
    useKeycloack
  },
  props: {
    clientId: {
      type: String,
      required: true
    },
    redirectUrl: {
      type: String,
      required: true
    },
    clientSecret: {
      type: String,
      required: true
    }
  },
  mounted() {
    // const { getAccessCode, getAccessToken } = useKeycloack()
    if (!location.href.includes('code')) {
      // getAccessCode(this.clientId, this.redirectUrl)
      console.log('faccio login')
    } else {
      // getAccessToken(this.clientId, this.redirectUrl, this.clientSecret)
      console.log('prendo code')
    }
  }
}
</script>
