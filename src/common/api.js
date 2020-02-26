import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import jwtService from './jwt.storage'
import { API_URL, TIME_OUT } from '@/common/config'

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = API_URL
Vue.axios.defaults.timeout = TIME_OUT

const tournamentService = {
  post(path, params) {
    return axios.post(`${path}`, params).then(res => res).catch(err => {
      throw err
    })
  },
  get(path) {
    if (path === undefined || path == null) {
      let config = this.setupHeader()
      return axios.get('/tournament/information', config).then(res => res).catch(err => {
        throw err
      })
    } else {
      return axios.get('/tournament-information/' + `${path}`).then(res => res).catch(err => {
        throw err
      })
    }
  },
  getPlayers(path) {
    let config = this.setupHeader()
    return axios.get(path, config).then(res => res).catch(err => {
      throw err
    })
  },
  deleteURI(path, param) {
    let config = this.setupHeader()
    return axios.delete(path + `${param}`, config).catch(err => {
      throw err
    })
  },
  setupHeader() {
    return {
      headers: {
        'Authorization': 'Bearer ' + jwtService.getToken()
      }
    }
  }
}

export default tournamentService
