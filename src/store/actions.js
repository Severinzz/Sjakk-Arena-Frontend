import tournamentService from '@/common/api'
import { addToken } from '../common/jwt.storage'

export default {
  addPlayer: ({ commit }, payload) => {
    commit('addPlayer', payload)
  },
  removePlayer: ({ commit }, payload) => {
    tournamentService.deleteURI(payload.path, payload.id)
    commit('removePlayer', payload.index)
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
      if (res.data.jwt !== undefined) {
        addToken(res.data.jwt)
        const job = JSON.parse(res.data.tournament)
        commit('addTournament', job)
      } else {
        commit('addTournament', res.data)
      }
    }).catch(err => {
      throw err
    })
  },
  fetchPlayers: ({ commit }, path) => {
    return tournamentService.getPlayers(path).then(res => {
      commit('addPlayers', res.data)
    })
  }
}
