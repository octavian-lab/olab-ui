<template>
  <Button
      :style="{
        background: '#424242',
        borderColor:'#424242'
      }"
      :class="`text-white p-1 ${width}`"
      @click="useKeycloak().getAccessCode(clientId)"
  >
    <img style="height: 25px" src="https://cdn.octavianlab.com/v3/bo/octavianlab/small-logo.png"/>
    <div class="text-center w-full font-semibold">Octavian SSO</div>
  </Button>
</template>
<script>
import {useKeycloak} from '@/mixins/keycloak.js'

export default {
  props: {
    clientId: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: () => 'w-full'
    }
  },
  methods: {
    useKeycloak
  }
}
</script>
