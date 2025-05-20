<template>
  <div class="line-container">
    <span class="line-text">oppure</span>
  </div>
  <Button
    :style="{
      background: '#424242',
      borderColor: '#424242'
    }"
    :class="`text-white p-1 ${width}`"
    @click="useKeycloak().getAccessCode(clientId)"
  >
    <img style="height: 25px" src="https://cdn.octavianlab.com/v3/bo/octavianlab/small-logo.png" />
    <div class="text-center w-full font-semibold">Octavian SSO</div>
  </Button>
</template>
<script>
import { useKeycloak } from '@/mixins/keycloak.js'

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
<style>
.line-container {
  margin: 1rem 0;
  position: relative;
  width: 100%;
  text-align: center;
}

.line-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ced4da;
  z-index: 1;
}

.line-text {
  position: relative;
  display: inline-block;
  padding: 0 10px;
  background-color: var(--surface-b);
  z-index: 2;
}
</style>
