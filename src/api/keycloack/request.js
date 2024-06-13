import axios from 'axios'
import {useKeycloack} from "@/mixins/keycloack.js";

const axiosConfig = () => {
    return {
        baseURL: useKeycloack().baseURL.value,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
}

export const useAxiosRequest = () => axios.create(axiosConfig())
