import API from '@/api/keycloack/index.js'
import { useKeycloackAuthStore } from '@/store/keycloack-auth.js'
import { jwtDecode } from 'jwt-decode'
export function useKeycloack() {
  // [METHODS]
  const getAccessCode = (clientId, redirectUrl) => {
    location.href = `https://iam-stage.octavianlab.com/realms/stage/protocol/openid-connect/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUrl}/keycloack&scope=openid profile email phone address&response_type=code&state4b0d44ba2e152425e9c8a70f2a3fe2bb1a83ff50`
  }

  const getAccessToken = async (clientId, redirectUrl, clientSecret) => {
    try {
      const code = location.href.split('code=')[1].split('#')[0]
      const json = {
        clientId,
        redirectUrl: `${this.redirectUrl}/keycloack`,
        clientSecret,
        code
      }
      const { data } = await API.auth.getAccessToken(json)
      updateStoreInfo(data)
    } catch (e) {
      console.log(e)
    }
  }
  const updateStoreInfo = (data) => {
    const keycloackStore = useKeycloackAuthStore()
    const decodedToken = decodeToken(data['id_token'])
    keycloackStore.updateInfo(decodedToken.olab)
    keycloackStore.updateTokens({
      id: data['id_token'],
      refresh: data['refresh_token'],
      expire: decodedToken.exp
    })
  }
  const decodeToken = (token) => {
    const decodedToken = jwtDecode(token)
    console.log('id_token decodificato', decodedToken)
    return decodedToken
  }

  const checkAndRefreshToken = async (clientId,clientSecret) => {
    const keycloackStore = useKeycloackAuthStore()
    if(Date.now() > keycloackStore.token.id.expire){
      try {
        const json = {
          clientId,
          clientSecret,
          refreshToken: keycloackStore.token.refresh
        }
        const { data } = await API.auth.refreshToken(json)
        updateStoreInfo(data)
      }catch (e){
        // verificare che fare al fallimento della chiamata
        console.log(e)
      }
    }
  }
  // const

  return {
    updateStoreInfo,
    decodeToken,
    checkAndRefreshToken,
    getAccessCode,
    getAccessToken
  }
}
