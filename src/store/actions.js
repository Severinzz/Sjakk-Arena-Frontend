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
    return new Promise((resolve, reject) => {
      tournamentService.put('/new-tournament', payload).then(res => {
        payload['tournamentId'] = res.data.tournament_id
        addToken(res.data.jwt)
        commit('createTournament', payload)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    }).catch(err => {
      throw err
    })
  }
}
