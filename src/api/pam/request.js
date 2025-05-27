import axios from 'axios'
import {useKeycloak} from '@/mixins/keycloak.js'

const ENDPOINTS = {
  stage: {
    base: 'https://stage.octavianlab.com/pam/admin/api/'
  },
  production: {
    base: 'https://live.octavianlab.com/pam/admin/api/'
  }
}

const getUtils = () => {
  return JSON.parse(localStorage.getItem('olab-ui-pam:utils'))
}
const baseURL = ENDPOINTS[getUtils().env].base
const axiosConfig = () => {
  return {
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getUtils().token ? `${useKeycloak().getStorageData('isKeycloakAuth') ? 'JWTIDP' : 'token'} ${getUtils().token}` : ''
    }
  }
}

export const useAxiosRequest = () => axios.create(axiosConfig())
