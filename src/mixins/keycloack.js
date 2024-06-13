import { useKeycloackAuthStore } from '@/store/keycloack-auth.js'
import { jwtDecode } from 'jwt-decode'
import { ref } from 'vue'
// IL FILE API È IMPORTATO NELLE SINGOLE FUNZIONI CHE LO UTILIZZANO, PER AVERE LA URL CON L'ENVIRONMENT CORRETTO

const baseURL = ref('https://iam.octavianlab.com/realms/stage/protocol/openid-connect')
export function useKeycloack() {
  // [METHODS]
  const checkKeycloackAuth = async (apiURL,clientId,clientSecret) => {
    updateEnvBaseURL(apiURL)
    if (!getStorageData("isAuthenticated")) {
      if (!location.href.includes("code=") && !location.href.includes("session_state=")) {
        // REDIRECT NELLA PAGINA DI AUTENTICAZIONE
        getAccessCode(clientId, location.origin);
      } else {
        // API PER PRENDERE TOKEN DI ACCESSO E METTERE TOKEN E INFORMAZIONI IN STORE
        await getAccessToken(clientId, clientSecret);
        const homeCleanedUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState(null, "", homeCleanedUrl);
      }
    }
  }
  const updateEnvBaseURL = (apiURL) => {
    // AGGIORNA L'API URL IN BASE ALL'ENVIRONMENT
    const environment = apiURL.split('.')[0].split('/')[2]
    if (environment !== 'stage') {
      baseURL.value = baseURL.value.replace('stage', environment)
    }
  }
  const getAccessCode = (clientId) => {
    // REDIRECT ALLA PAGINA DI LOGIN DI KEYCLOACK
    location.href = `${baseURL.value}/auth?client_id=${clientId}&redirect_uri=${location.origin}&scope=olab-profile olab-app openid&response_type=code&state4b0d44ba2e152425e9c8a70f2a3fe2bb1a83ff50`
  }
  const getAccessToken = async (clientId,  clientSecret) => {
    // API PER PRENDERE IL TOKEN DI AUTENTICAZIONE PER EFFETTUARE LE API
    try {
      const APIFile = async () => await import('@/api/keycloack/index.js')
      const API = await APIFile()
      const code = location.href.split('code=')[1].split('#')[0]
      const json = {
        clientId,
        clientSecret,
        redirectUrl: location.origin,
        code
      }
      const { data } = await API.default.auth.getAccessToken(json)
      updateStoreInfo(data)
    } catch (e) {
      console.log(e)
    }
  }
  const updateStoreInfo = (data) => {
    // AGGIORNA LE INFO DELL'UTENTE LOGGATO
    const keycloackStore = useKeycloackAuthStore()
    const decodedToken = decodeToken(data['id_token'])
    keycloackStore.updateInfo({ ...decodedToken.profile, ...decodedToken.app })
    keycloackStore.updateTokens({
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
    const APIFile = async () => await import('@/api/keycloack/index.js')
    const API = await APIFile()
    const keycloackStore = useKeycloackAuthStore()
    if (keycloackStore.getIdToken && Date.now() > keycloackStore.getIdToken.expire) {
      try {
        const json = {
          clientId,
          clientSecret,
          refreshToken: keycloackStore.getRefreshToken
        }
        const { data } = await API.default.auth.refreshToken(json)
        updateStoreInfo(data)
      } catch (e) {
        keycloackStore.logout()
      }
    }
  }
  const getStorageData = (data) => {
    // RITORNA I DATI DELLO STORE
    const keycloackStore = useKeycloackAuthStore()
    // da utilizzare per info e isAuthenticated
    return keycloackStore[data]
  }
  const logout = async () => {
    const keycloackStore = useKeycloackAuthStore()
    try {
      location.href = `${baseURL.value}/logout`
      keycloackStore.logout()
    } catch (e) {
      console.log(e)
    }
  }

  return {
    baseURL: baseURL,
    logout,
    checkKeycloackAuth,
    checkAndRefreshToken,
    updateStoreInfo,
    updateEnvBaseURL,
    decodeToken,
    getAccessCode,
    getAccessToken,
    getStorageData
  }
}
