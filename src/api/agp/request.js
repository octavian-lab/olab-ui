import axios from 'axios'

const ENDPOINTS = {
  stage: {
    v2: 'https://stage.octavianlab.com/accounting-service/admin/v2/',
    base: 'https://stage.octavianlab.com/accounting-service/v3/admin/api'
  },
  production: {
    v2: 'https://live.octavianlab.com/accounting-service/admin/v2/',
    base: 'https://live.octavianlab.com/accounting-service/v3/admin/api'
  }
}

const getUtils = () => {
  return JSON.parse(localStorage.getItem('olab-ui-agp:utils'))
}
const baseURL = ENDPOINTS[getUtils().env].base
const axiosConfig = () => {
  return {
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getUtils().token ? `token ${getUtils().token}` : ''
    }
  }
}

export const useAxiosRequest = () => axios.create(axiosConfig())
