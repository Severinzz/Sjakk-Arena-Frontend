import { API_SERVICE, TOURNAMENT_SERVICE, PLAYER_SERVICE } from '../common/api'
import { addToken, deleteToken } from '../common/jwt.storage'
import WEBSOCKET_SERVICE from '../common/websocketApi'

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
    if (payload.started === true) {
      commit('removePlayer', payload.player)
      return TOURNAMENT_SERVICE.patch(`inactivatePlayer/${payload.id}`) // set-player-inactive
    } else {
      TOURNAMENT_SERVICE.delete(`delete-player/${payload.id}`)
      commit('removePlayer', payload.player)
    }
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
  fetchTournament: ({ commit }) => {
    return TOURNAMENT_SERVICE.get('information').then(res => {
      commit('addTournament', res.data)
    })
  },
  signInUUID: ({ NULL }, uuid) => {
    return API_SERVICE.get(`sign-in/${uuid}`).then(res => {
      addToken(res.data.jwt)
    }).then(res => {
      API_SERVICE.setHeader()
    })
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
  fetchPlayers: ({ commit }, started) => {
    const callback = function(res) {
      let players = JSON.parse(res.body)
      if (players.length >= 0) {
        commit('addPlayers', players)
      }
    }
    let slug
    started ? slug = 'leaderboard' : slug = 'players'
    WEBSOCKET_SERVICE.connect('tournament/' + slug, slug, callback)
  },
  /*
    Fetch games with invalid result
   */
  fetchInvalidGames: () => {
    console.log('Getting games with invalid results for tournament')
    return TOURNAMENT_SERVICE.get('invalidGames').catch(err => {
      throw err.response
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
  hostFetchPlayer: ({ NULL }, payload) => {
    API_SERVICE.setHeader()
    return TOURNAMENT_SERVICE.get(`player/${payload.id}`)
  },
  /*
    Sends a request to leave to the server
   */
  sendLeaveRequest: ({ commit }, started) => {
    let slug
    started ? slug = 'set-inactive' : slug = 'delete-player'
    return PLAYER_SERVICE.patch(slug).then(res => {
      deleteToken()
    })
  },
  fetchResults: () => {
    return PLAYER_SERVICE.get('games').catch(err => {
      throw err.response
    })
  },
  /*
    Send a game result to the server.
   */
  sendGameResult: ({ commit }, result) => {
    return PLAYER_SERVICE.put('add-result', result)
  },
  /*
    Send pause request
   */
  sendPauseRequest: () => {
    return PLAYER_SERVICE.patch('pause').catch(err => {
      throw err.response
    })
  },
  /*
    Send unpause request
   */
  sendUnpauseRequest: () => {
    return PLAYER_SERVICE.patch('unpause').catch(err => {
      throw err.response
    })
  },
  /*
  Unsubscribe from the enpoint
  @Param subscription. Subscription object that contains id and unsubscribe function.
   */
  unsubscribe: ({ NULL }, subscription) => {
    WEBSOCKET_SERVICE.unsubscribe(subscription)
  },
  /*
  Close the websocket.
   */
  close: () => {
    WEBSOCKET_SERVICE.close()
  }
}
