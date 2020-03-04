import { API_SERVICE, TOURNAMENT_SERVICE, PLAYER_SERVICE } from '../common/api'
import { addToken, deleteToken } from '../common/jwt.storage'

export default {
  /*
    Add a player to the players list
   */
  addPlayer: ({ commit }, payload) => {
    commit('addPlayer', payload)
  },
  /*
    Remove player from tournament

    Payload has to contain the id and the list index of the player to be removed
   */
  removePlayer: ({ commit }, payload) => {
    TOURNAMENT_SERVICE.delete(`delete-player/${payload.id}`)
    commit('removePlayer', payload.index)
  },
  /*
    Send a tournament to the server.
   */
  sendTournament: ({ commit }, tournament) => {
    return API_SERVICE.post('new-tournament', tournament).then(res => {
      // Adds the tournament ID received from the server to the payload.
      tournament['id'] = res.data.tournament_id
      addToken(res.data.jwt)
      // Adds the payload (tournament) to the state in store.
      commit('addTournament', tournament)
    }).then(res => {
      API_SERVICE.setHeader()
    })
  },
  /*
    Send a player to the server
   */
  sendPlayer: ({ commit }, player) => {
    return API_SERVICE.post('new-player', player).then(res => {
      addToken(res.data.jwt)
      commit('createPlayer', player)
    }).then(res => {
      API_SERVICE.setHeader()
    })
  },
  /*
    Fetch a tournament from the server. Use uuid if token linked to a tournament user is absent
   */
  fetchTournament: ({ commit }, uuid) => {
    if (uuid === undefined) {
      return TOURNAMENT_SERVICE.get('information').then(res => {
        commit('addTournament', res.data)
      })
    } else {
      return API_SERVICE.get(`tournament-information/${uuid}`).then(res => {
        addToken(res.data.jwt)
        // Formats the tournament to the correct format for the store.
        const job = JSON.parse(res.data.tournament)
        commit('addTournament', job)
      }).then(res => {
        API_SERVICE.setHeader()
      })
    }
  },
  /*
    Fetch the tournament a player is enrolled in
   */
  fetchPlayersTournament: ({ commit }) => {
    return PLAYER_SERVICE.get('tournament').then(res => {
      commit('addTournament', res.data)
    })
  },
  /*
    Fetch players enrolled in a tournament
   */
  fetchPlayers: ({ commit }) => {
    return TOURNAMENT_SERVICE.get('players').then(res => {
      commit('addPlayers', res.data)
    })
  },
  /*
    Fetch the player using the application.
   */
  fetchPlayer: ({ commit }) => {
    return PLAYER_SERVICE.get('information').then(res => {
      commit('createPlayer', res.data)
    })
  },
  /*
    Sends a request to leave to the server
   */
  sendLeaveRequest: () => {
    return PLAYER_SERVICE.patch('set-inactive').then(res => {
      deleteToken()
    })
  },
  fetchResults: () => {
    return PLAYER_SERVICE.get('games').catch(err => {
      throw err
    })
  },
  /*
    Send a game result to the server.
   */
  sendGameResult: ({ commit }, result) => {
    return PLAYER_SERVICE.put('add-result', result)
  }
}
