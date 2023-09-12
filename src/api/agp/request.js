import axios from 'axios'
const baseURL = import.meta.env.VUE_APP_API_URL_V3

let store = localStorage.getItem('octavianlab-admin')
if (store) {
  store = JSON.parse(store)
}

const axiosRequest = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: store.auth.ssoToken ? `token ${store.auth.ssoToken}` : '',
    'X-Lab-Language': store.language.id
  }
})

export default axiosRequest
