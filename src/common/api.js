import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { API_URL, TIME_OUT } from '@/common/config'

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = API_URL
Vue.axios.defaults.timeout = TIME_OUT

const tournamentService = {
  put(path, params) {
    return axios.put(`${path}`, params).then(res => res).catch(err => {
      throw err
    })
  },
  get(path) {
    return axios.get('/tournament-information/' + `${path}`).then(res => res).catch(err => {
      throw err
    })
  }
}

export default tournamentService
