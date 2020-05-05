import { API_SERVICE, PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import { addToken, deleteToken } from '../../common/jwt.storage'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = getDefaultState()

export const mutations = {
  /**
   * Add player to the players state array.
   * @param state
   * @param player Player to be added to the players array.
   */
  addPlayer: (state, player) => {
    state.players.push(player)
  },

  /**
   * Removes player from the players state.
   * @param state
   * @param player Player to remove
   */
  removePlayer: (state, player) => {
    delete state.players[player]
  },

  /**
   * Sets the player state
   * TODO: Remove this or the "addPlayers mutation"
   * @param state
   * @param player The player to set.
   */
  createPlayer: (state, player) => {
    state.player = player
  },

  /**
   * Sets the player state
   * TODO: Remove this or the "addPlayers mutation"
   * @param state
   * @param payload The player to add.
   */
  addPlayers: (state, payload) => {
    state.players = payload
  },

  /**
   * Clears the players
   * @param state
   */
  clearPlayers: (state) => {
    state.player = []
  },

  /**
   * Sets the player paired state
   * @param state
   * @param paired Boolean value to tell if the player is paierd with an opponent
   */
  setPaired: (state, paired) => {
    // TODO: heller endre player objektet sin paired?
    state.paired = paired
  },

  /**
   * Sets the points of the player
   * @param state
   * @param points The amount of points the player got
   */
  setPoints: (state, points) => {
    // TODO: heller endre player objektet sin points?
    state.points = points
  },

  /**
   * Resets the state.
   * @param state
   */
  resetPlayerState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState())
  }
}
export const actions = {
  /**
   * Resets the player state.
   * @param commit
   */
  resetPlayer: ({ commit }) => {
    commit('resetPlayerState')
  },

  /**
   * Sets the player paird state
   * @param commit
   * @param paired
   */
  setPlayerPaired: ({ commit }, paired) => {
    commit('setPaired', paired)
  },

  /**
   * Add a player to the players list
   * @param commit
   * @param payload The player that should be added
   */
  addPlayer: ({ commit }, payload) => {
    commit('addPlayer', payload)
  },

  /**
   * Remove player from tournament
   * @param commit
   * @param started Boolean value to tell if the tournament is started
   * @param player Player that should be removed
   * @param id Id of the player that should be removed
   * @param msg The custom message the player should receive when removed.
   * @returns {Promise<AxiosResponse<T>>}
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

  /**
   * Send a player to the server
   * @param commit
   * @param player The player that should be sent
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendPlayer: ({ commit }, player) => {
    return API_SERVICE.post('new-player', player).then(res => {
      addToken(res.data.jwt)
      commit('createPlayer', player)
    }).then(res => {
      API_SERVICE.setHeader()
    })
  },

  /**
   * Fetch the player from the backend
   * @param commit
   * @returns {Promise<AxiosResponse<T>>}
   */
  fetchPlayer: ({ commit }) => {
    return PLAYER_SERVICE.get().then(res => {
      commit('createPlayer', res.data)
    })
  },

  /**
   * Fetch a player in the tournament.
   * TODO: Commit player instead for sending back to the component?
   * @param NULL
   * @param id ID of the tournament
   * @returns {Promise<AxiosResponse<T>>}
   */
  hostFetchPlayer: ({ NULL }, { id }) => {
    API_SERVICE.setHeader()
    return TOURNAMENT_SERVICE.get(`player/${id}`)
  },

  /**
   * Sends a request to leave to the server
   * @param commit
   * @param started Boolean value to tell if the tournament is started or not.
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendLeaveRequest: ({ commit }, started) => {
    let slug
    started ? slug = 'inactivate' : slug = 'delete'
    return PLAYER_SERVICE.patch(slug).then(res => {
      deleteToken()
    })
  },

  /**
   * Send pause request
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendPauseRequest: () => {
    return PLAYER_SERVICE.patch('pause').catch(err => {
      throw err
    })
  },

  /**
   * Send unpause request
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendUnpauseRequest: () => {
    return PLAYER_SERVICE.patch('unpause').catch(err => {
      throw err
    })
  },

  /**
   * Subscribes to the players endpoint. Receives updates when new players join the tournament.
   * @param commit
   * @param started Boolean value to tell if the tournament is started or not.
   */
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

  /**
   * Subscribes to the players points endpoint. Receives updates about the players points.
   * @param commit
   */
  subscribeToPoints: ({ commit }) => {
    let pointCallback = function (res) {
      let points = JSON.parse(res.body).points
      commit('setPoints', points)
    }
    let sub = { path: 'player/points', callback: pointCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  /**
   * Subscribes to the "kicked" endpoint. Receives a custom message if the player is kicked.
   * @param commit
   * @param callback
   */
  subscribeToPlayerKicked: ({ commit }, callback) => {
    let sub = {
      path: 'player/removed',
      callback: callback
    }
    WEBSOCKET_SERVICE.connect(sub)
  }
}
export const getters = {
  /**
   * Return the amount of players in the tournament
   * @param state
   * @returns {number}
   */
  getPlayerCount: (state) => {
    return state.players.length
  },

  /**
   * Returns all players in the tournament
   * @param state
   * @returns {[]|{name: string, points: string}|{name: string, points: string}|null|
   * {type: StringConstructor, required: boolean}|{type: StringConstructor | String, required: boolean}}
   */
  getAllPlayers: (state) => {
    return state.players
  },

  /**
   * Returns the reversed players array
   * @param state
   * @returns {T[]}
   */
  getAllPlayersReversed: (state) => {
    return state.players.reverse()
  }
}

/**
 * Returns the default state
 * @returns {{playingPlayers: [], players: [], paired: boolean, player: {name: string, points: string}, points: number}}
 */
function getDefaultState() {
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
