import axios from 'axios'

const baseURL = 'https://iam-stage.octavianlab.com/realms/stage/protocol/openid-connect'
const axiosConfig = () => {
    return {
        baseURL,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
}

export const useAxiosRequest = () => axios.create(axiosConfig())
