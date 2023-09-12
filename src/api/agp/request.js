import axios from 'axios'
let store = localStorage.getItem('octavianlab-admin')
if (store) store = JSON.parse(store)

const endpoints = {
  stage: {
    v2: 'https://stage.octavianlab.com/accounting-service/admin/v2/',
    base: 'https://stage.octavianlab.com/accounting-service/v3/admin/api'
  },
  production: {
    v2: 'https://live.octavianlab.com/accounting-service/admin/v2/',
    base: 'https://live.octavianlab.com/accounting-service/v3/admin/api'
  }
}
const baseURL = endpoints[store.site.currentEnvironment].base

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
