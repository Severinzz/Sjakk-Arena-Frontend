import tournamentService from '@/common/api'
import { addToken } from '../common/jwt.storage'

export default {
  addPlayer: ({ commit }, payload) => {
    commit('addPlayer', payload)
  },
  removePlayer: ({ commit }, index) => {
    commit('removePlayer', index)
  },
  createTournament: ({ commit }, payload) => {
    return tournamentService.put('/new-tournament', payload).then(res => {
      payload['id'] = res.data.tournament_id
      addToken(res.data.jwt)
      commit('addTournament', payload)
    }).catch(err => {
      throw err
    })
  },
  createPlayer: ({ commit }, payload) => {
    return tournamentService.put('/new-player', payload).then(res => {
      addToken(res.data.jwt)
      commit('createPlayer', payload)
      }).catch(err => {
      throw err
    })
  },
  fetchTournament: ({ commit }, path) => {
    return tournamentService.get(path).then(res => {
      addToken(res.data.jwt)
      let job = JSON.parse(res.data.tournament)
      commit('addTournament', job)
    }).catch(err => {
      throw err
    })
  }
}
