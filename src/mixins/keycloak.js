import { useKeycloakAuthStore } from '@/store/keycloak-auth.js'
import { jwtDecode } from 'jwt-decode'
import { ref } from 'vue'
// IL FILE API È IMPORTATO NELLE SINGOLE FUNZIONI CHE LO UTILIZZANO, PER AVERE LA URL CON L'ENVIRONMENT CORRETTO

const baseURL = ref('https://iam.octavianlab.com/realms/stage/protocol/openid-connect')
const redirectURL = ref(location.origin)
export function useKeycloak() {
  // [METHODS]
  const checkKeycloakAuth = async ({ siteURL, clientId, clientSecret }) => {
    updateEnvBaseURL()
    updateRedirectURL(siteURL)
    if (!getStorageData('isAuthenticated')) {
      // REDIRECT NELLA PAGINA DI AUTENTICAZIONE
      getAccessCode(clientId)
      // API PER PRENDERE TOKEN DI ACCESSO E METTERE TOKEN E INFORMAZIONI IN STORE
      await getAccessToken(clientId, clientSecret)
    }
  }
  const updateEnvBaseURL = () => {
    // AGGIORNA L'API URL IN BASE ALL'ENVIRONMENT
    const site = localStorage.getItem('site')
    const utils = JSON.parse(localStorage.getItem(`olab-ui-${site}:utils`))
    const environment = utils.env
    if (environment === 'production' || environment === 'live') {
      baseURL.value = baseURL.value.replace('stage', 'live')
    }
  }
  const updateRedirectURL = (siteURL) => {
    if (!location.origin.includes('localhost:')) {
      redirectURL.value = `${location.origin}${siteURL}`
    }
  }
  const getAccessCode = (clientId) => {
    if (location.href.includes('code=') && location.href.includes('session_state=')) {
      return
    }
    // REDIRECT ALLA PAGINA DI LOGIN DI KEYCLOAK
    const keycloakStore = useKeycloakAuthStore()
    keycloakStore.updateKeycloakAuth(true)
    location.href = `${baseURL.value}/auth?client_id=${clientId}&redirect_uri=${redirectURL.value}&scope=olab-profile olab-app openid&response_type=code&state4b0d44ba2e152425e9c8a70f2a3fe2bb1a83ff50`
  }
  const getAccessToken = async (clientId, clientSecret) => {
    if (!location.href.includes('code=') && !location.href.includes('session_state=')) {
      return
    }
    // API PER PRENDERE IL TOKEN DI AUTENTICAZIONE PER EFFETTUARE LE API
    try {
      const APIFile = async () => await import('@/api/keycloak/index.js')
      const API = await APIFile()
      const code = location.href.split('code=')[1].split('#')[0]
      const json = {
        clientId,
        clientSecret,
        redirectUrl: redirectURL.value,
        code
      }
      const { data } = await API.default.auth.getAccessToken(json)
      updateStoreInfo(data)
      const homeCleanedUrl = `${window.url || ''}${window.location.pathname || ''}`
      window.history.replaceState(null, '', homeCleanedUrl)
    } catch (e) {
      console.log(e)
    }
  }
  const updateStoreInfo = (data) => {
    // AGGIORNA LE INFO DELL'UTENTE LOGGATO
    const keycloakStore = useKeycloakAuthStore()
    const decodedToken = decodeToken(data['id_token'])
    keycloakStore.updateInfo({ ...decodedToken.profile, ...decodedToken.app })
    keycloakStore.updateTokens({
      id: data['id_token'],
      refresh: data['refresh_token'],
      expire: decodedToken.exp
    })
  }
  const decodeToken = (token) => {
    // DECODIFICA IL TOKEN
    const decodedToken = jwtDecode(token)
    return decodedToken
  }
  const checkAndRefreshToken = async (clientId, clientSecret) => {
    // API PER VERIFICARE SE IL TOKEN È SCADUTO E AGGIORNARLO IN TAL CASO
    const keycloakStore = useKeycloakAuthStore()
    if (keycloakStore.getIdToken?.value && Date.now() > keycloakStore.getIdToken.expire) {
      const APIFile = async () => await import('@/api/keycloak/index.js')
      const API = await APIFile()
      try {
        const json = {
          clientId,
          clientSecret,
          refreshToken: keycloakStore.getRefreshToken
        }
        const { data } = await API.default.auth.refreshToken(json)
        updateStoreInfo(data)
      } catch (e) {
        keycloakStore.logout()
      }
    }
  }
  const getStorageData = (data) => {
    // RITORNA I DATI DELLO STORE
    const keycloakStore = useKeycloakAuthStore()
    // da utilizzare per info e isAuthenticated
    return keycloakStore[data]
  }
  const logout = async (clientId) => {
    const keycloakStore = useKeycloakAuthStore()
    try {
      const keycloakStore = useKeycloakAuthStore()
      keycloakStore.logout()
      location.href = `${baseURL.value}/logout?post_logout_redirect_uri=${redirectURL.value}&client_id=${clientId}`
    } catch (e) {
      console.log(e)
    }
  }

  return {
    baseURL: baseURL,
    logout,
    checkKeycloakAuth,
    checkAndRefreshToken,
    updateStoreInfo,
    updateEnvBaseURL,
    updateRedirectURL,
    decodeToken,
    getAccessCode,
    getAccessToken,
    getStorageData
  }
}
