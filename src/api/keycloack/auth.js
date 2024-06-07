import {useAxiosRequest} from './request.js'

const axios = useAxiosRequest()
import queryString from 'query-string';

export default {
    getAccessToken(params) {
        return axios.post('/token',
            queryString.stringify({
                grant_type: 'authorization_code',
                client_id: params.clientId,
                client_secret: params.clientSecret,
                redirect_uri: params.redirectUrl,
                code: params.code
            })
        )
    },
    refreshToken(params) {
        return axios.post('/token',
            queryString.stringify({
                grant_type: 'refresh_token',
                client_id: params.clientId,
                client_secret: params.clientSecret,
                refresh_token: params.refreshToken
            })
        )
    },
}
