import { defineStore } from 'pinia'
export const useKeycloakAuthStore = defineStore('keycloak-auth', {
  state: () => ({
    keycloakAuth:false,
    info: null,
    token: {
      id: {
        value: null,
        expire: null
      },
      refresh: null
    }
  }),
  getters: {
    getAuthInfo: (state) => {
      return state.info
    },
    getIdToken: (state) => {
      return state.token.id
    },
    getRefreshToken: (state) => {
      return state.token.refresh
    },
    isAuthenticated(state) {
      return state.token.id.value !== null
    },
    isKeycloakAuth(state) {
      return state.keycloakAuth
    }
  },
  actions: {
    updateKeycloakAuth(value){
      this.keycloakAuth = value
    },
    updateInfo(info) {
      this.info = info
    },
    updateTokens({ id, refresh, expire }) {
      this.token.id.value = id
      // MOLTIPLICO IL TOKEN ( ESPRESSO IN SECONDI ) PER POTERLO COMPARARE CON DATE.NOW() ( ESPRESSO IN MILLISECONDI )
      this.token.id.expire = expire * 1000
      this.token.refresh = refresh
    },
    logout(){
      this.token.id.value = null
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: `olab-ui-${localStorage.getItem('site')}:keycloak-auth`,
        storage: localStorage
      }
    ]
  }
})
