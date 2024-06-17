<template>
  <Button
    :label="$translate(label)"
    :severity="severity"
    :icon="icon"
    @click="useKeycloak().getAccessCode(clientId)"
  />
</template>
<script>
import { useKeycloak } from '@/mixins/keycloak.js'

export default {
  props: {
    clientId: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      default: () => 'warning'
    },
    label: {
      type: String,
      default: () => 'admin.generic.keycloak.login'
    },
    icon: {
      type: String,
      default: () => 'fad fa-key'
    }
  },
  methods: {
    useKeycloak
  }
}
</script>
