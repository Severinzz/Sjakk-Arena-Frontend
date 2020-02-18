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
      payload['tournamentId'] = res.data.tournament_id
      addToken(res.data.jwt)
      commit('createTournament', payload)
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
  }
}
