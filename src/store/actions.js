import { API_SERVICE, TOURNAMENT_SERVICE, PLAYER_SERVICE } from '../common/api'
import { addToken } from '../common/jwt.storage'

export default {
  addPlayer: ({ commit }, payload) => {
    commit('addPlayer', payload)
  },
  removePlayer: ({ commit }, payload) => {
    TOURNAMENT_SERVICE.delete(`delete-player/${payload.id}`)
    commit('removePlayer', payload.index)
  },
  createTournament: ({ commit }, payload) => {
    return API_SERVICE.post('new-tournament', payload).then(res => {
      // Adds the tournament ID received from the server to the payload.
      payload['id'] = res.data.tournament_id
      addToken(res.data.jwt)
      // Adds the payload (tournament) to the state in store.
      commit('addTournament', payload)
    }).catch(err => {
      console.error(err)
    }).then(res => {
      API_SERVICE.setHeader()
    })
  },
  createPlayer: ({ commit }, payload) => {
    return API_SERVICE.post('new-player', payload).then(res => {
      addToken(res.data.jwt)
      commit('createPlayer', payload)
    }).then(res => {
      API_SERVICE.setHeader()
    }).catch(err => {
      throw err
    })
  },
  fetchTournament: ({ commit }, uuid) => {
    if (uuid === undefined) {
      return TOURNAMENT_SERVICE.get('information').then(res => {
        commit('addTournament', res.data)
      }).catch(err => {
        throw err
      })
    } else {
      return API_SERVICE.get(`tournament-information/${uuid}`).then(res => {
        addToken(res.data.jwt)
        // Formats the tournament to the correct format for the store.
        const job = JSON.parse(res.data.tournament)
        commit('addTournament', job)
      }).then(res => {
        API_SERVICE.setHeader()
      }).catch(err => {
        throw err
      })
    }
  },
  fetchPlayersTournament: ({ commit }) => {
    return PLAYER_SERVICE.get('tournament').then(res => {
      commit('addTournament', res.data)
    })
  },
  fetchPlayers: ({ commit }) => {
    return TOURNAMENT_SERVICE.get('players').then(res => {
      commit('addPlayers', res.data)
    })
  },
  fetchPlayer: ({ commit }) => {
    return PLAYER_SERVICE.get('information').then(res => {
      commit('createPlayer', res.data)
    })
  }
}
