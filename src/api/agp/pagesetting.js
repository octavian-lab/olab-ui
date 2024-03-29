import { useAxiosRequest } from './request.js'
const axios = useAxiosRequest
export default {
  search(params) {
    return axios().get('/pageSettings', { params })
  },
  add(params) {
    return axios().post('/pageSettings', params)
  },
  edit(id, params) {
    return axios().put(`/pageSettings/${id}`, params)
  },
  delete(id) {
    return axios().delete(`/pageSettings/${id}`)
  }
}
