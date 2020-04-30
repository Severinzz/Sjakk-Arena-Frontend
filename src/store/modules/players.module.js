import { API_SERVICE, PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import { addToken, deleteToken } from '../../common/jwt.storage'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = setDefaultState()

export const mutations = {
  addPlayer: (state, player) => {
    state.players.push(player)
  },

  removePlayer: (state, player) => {
    delete state.players[player]
  },

  createPlayer: (state, player) => {
    state.player = player
  },

  addPlayers: (state, payload) => {
    state.player = payload
  },

  clearPlayers: (state) => {
    state.player = []
  },

  setPaired: (state, paired) => {
    // TODO: heller endre player objektet sin paired?
    state.paired = paired
  },

  setPoints: (state, points) => {
    // TODO: heller endre player objektet sin points?
    state.points = points
  },

  resetPlayerState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, setDefaultState())
  }
}
export const actions = {
  resetPlayer: ({ commit }) => {
    commit('resetPlayerState')
  },

  setPlayerPaired: ({ commit }, paired) => {
    commit('setPaired', paired)
  },

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
  removePlayer: ({ commit }, { started, player, id, msg }) => {
    if (started === true) {
      commit('removePlayer', player)
      return TOURNAMENT_SERVICE.patch(`player/inactivate/${id}`, msg)
    } else {
      TOURNAMENT_SERVICE.delete(`player/delete/${id}?msg=${msg}`)
      commit('removePlayer', player)
    }
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
  Fetch the player using the application.
 */
  fetchPlayer: ({ commit }) => {
    return PLAYER_SERVICE.get().then(res => {
      commit('createPlayer', res.data)
    })
  },

  // Commit player instead for sending back to the component?
  hostFetchPlayer: ({ NULL }, { id }) => {
    API_SERVICE.setHeader()
    return TOURNAMENT_SERVICE.get(`player/${id}`)
  },

  /*
  Sends a request to leave to the server
 */
  sendLeaveRequest: ({ commit }, started) => {
    let slug
    started ? slug = 'inactivate' : slug = 'delete'
    return PLAYER_SERVICE.patch(slug).then(res => {
      deleteToken()
    })
  },

  /*
  Send pause request
 */
  sendPauseRequest: () => {
    return PLAYER_SERVICE.patch('pause').catch(err => {
      throw err
    })
  },

  /*
  Send unpause request
 */
  sendUnpauseRequest: () => {
    return PLAYER_SERVICE.patch('unpause').catch(err => {
      throw err
    })
  },

  /*
    Send image from user to backend.
   */
  sendGameImage: (formData) => {
    console.log(formData)
    // return PLAYER_SERVICE.put(`/${gameId}/image/` + payload).catch(err => {
    //   throw err
    // })
  },

  subscribeToPlayers: ({ commit }, started) => {
    let playerCallback = function (res) {
      let players = JSON.parse(res.body)
      if (players.length >= 0) {
        commit('addPlayers', players)
      }
    }
    let slug
    started ? slug = 'leaderboard' : slug = 'players'
    let sub = { path: 'tournament/' + slug, callback: playerCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  subscribeToPoints: ({ commit }) => {
    let pointCallback = function (res) {
      let points = JSON.parse(res.body).points
      commit('setPoints', points)
    }
    let sub = { path: 'player/points', callback: pointCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  subscribeToPlayerKicked: ({ commit }, callback) => {
    let sub = {
      path: 'player/removed',
      callback: callback
    }
    WEBSOCKET_SERVICE.connect(sub)
  }
}
export const getters = {
  getPlayerCount: (state) => {
    return state.player.length
  },
  getAllPlayers: (state) => {
    return state.player
  }
}

function setDefaultState() {
  return {
    player: {
      name: LOADING_MESSAGE,
      points: LOADING_MESSAGE
    },
    players: [],
    playingPlayers: [],
    paired: false,
    points: NaN
  }
}
