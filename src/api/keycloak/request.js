import axios from 'axios'
import {useKeycloak} from "@/mixins/keycloak.js";

const axiosConfig = () => {
    return {
        baseURL: useKeycloak().baseURL.value,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
}

export const useAxiosRequest = () => axios.create(axiosConfig())
