import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import jwtService from './jwt.storage'
import { API_URL, TIME_OUT } from '@/common/config'

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = API_URL
Vue.axios.defaults.timeout = TIME_OUT

let config = {
  headers: {
    'Authorization': 'Bearer ' + jwtService.getToken()
  }
}

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
  },
  getPlayers(path) {
    console.log(jwtService.getToken())
    return axios.get(path, config).then(res => res).catch(err => {
      throw err
    })
  },
  deleteURI(path, param) {
    return axios.delete(path + `${param}`, config).catch(err => {
      throw err
    })
  }
}

export default tournamentService
