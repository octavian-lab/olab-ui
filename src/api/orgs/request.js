import axios from 'axios'
const baseURL = import.meta.env.VUE_APP_API_URL

let store = localStorage.getItem('octavianlab-admin')
if (store) {
  store = JSON.parse(store)
}

const axiosRequest = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: store.auth.token ? `Bearer ${store.auth.token}` : '',
  }
})

export default axiosRequest
