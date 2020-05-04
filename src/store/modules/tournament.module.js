import { API_SERVICE, PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import { addToken } from '../../common/jwt.storage'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = getDefaultState()
export const mutations = {
  /**
   * Set the tournament
   * @param state
   * @param tournament Tournament that should be set.
   */
  addTournament: (state, tournament) => {
    state.tournament = tournament
    state.activeTournament = tournament.active
  },

  /**
   * Sets the tournament active state.
   * @param state
   * @param active Active value that should be set.
   */
  setTournamentActive: (state, active) => {
    state.activeTournament = active
  },

  /**
   * Reset the state
   * @param state
   */
  resetTournamentState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState())
  }
}
export const actions = {
  resetTournament: ({ commit }) => {
    commit('resetTournamentState')
  },

  /**
   * Send a tournament to the server.
   * @param commit
   * @param tournament Tournament that should be sent
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendTournament: ({ commit }, tournament) => {
    return API_SERVICE.post('new-tournament', tournament).then(res => {
      // Adds the tournament ID received from the server to the payload.
      tournament['user_id'] = res.data.tournament_id
      addToken(res.data.jwt)
      // Adds the payload (tournament) to the state in store.
      commit('addTournament', tournament)
    }).then(res => {
      API_SERVICE.setHeader()
    })
  },

  /**
   * Send tournament pause request.
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendTournamentPauseRequest: () => {
    return TOURNAMENT_SERVICE.patch('pause').catch(res => {
      throw res.response
    })
  },

  /**
   * Send tournament unpause request.
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendTournamentUnpauseRequest: () => {
    return TOURNAMENT_SERVICE.patch('unpause').catch(res => {
      throw res.response
    })
  },

  /**
   * Fetch a tournament from the server.
   * @param commit
   * @returns {Promise<AxiosResponse<T>>}
   */
  fetchTournament: ({ commit }) => {
    return TOURNAMENT_SERVICE.get().then(res => {
      commit('addTournament', res.data)
    })
  },

  /**
   * Signs-in with adminID.
   * @param NULL
   * @param uuid the AdminID.
   * @returns {Promise<AxiosResponse<T>>}
   */
  signInUUID: ({ NULL }, uuid) => {
    return API_SERVICE.get(`sign-in/${uuid}`).then(res => {
      addToken(res.data.jwt)
    }).then(res => {
      API_SERVICE.setHeader()
    })
  },

  /**
   * Fetch the tournament a player is enrolled in.
   * @param commit
   * @returns {Promise<AxiosResponse<T>>}
   */
  fetchPlayersTournament: ({ commit }) => {
    return PLAYER_SERVICE.get('tournament').then(res => {
      commit('addTournament', res.data)
    })
  },

  /**
   * Send request to start the tournament
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendStartRequest: () => {
    return TOURNAMENT_SERVICE.patch('start').catch(err => {
      throw err
    })
  },

  /**
   * Send request to end the tournament
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendEndRequest: () => {
    return TOURNAMENT_SERVICE.patch('end').catch(err => {
      throw err
    })
  },

  /**
   * Subscribes to the tournament active endpoint. Receives updates when tournament starts or ends
   * @param commit
   * @param userRole
   */
  subscribeToTournamentActive: ({ commit }, { userRole }) => {
    let activeCallback = function (res) {
      let active = JSON.parse(res.body).active
      commit('setTournamentActive', active)
    }
    let path = userRole === 'player' ? 'player/tournament-active' : 'tournament/active'
    let sub = { path: path, callback: activeCallback }
    WEBSOCKET_SERVICE.connect(sub)
  }
}
export const getters = {
  /**
   * Returns the tournament's active state
   * @param state
   * @returns {boolean} Active state.
   */
  isTournamentActive: (state) => {
    return state.activeTournament
  }
}

/**
 * Returns the default state
 * @returns {{playingPlayers: [], players: [], paired: boolean, player: {name: string, points: string}, points: number}}
 */
function getDefaultState() {
  return {
    tournament: {
      user_id: LOADING_MESSAGE,
      tournament_name: LOADING_MESSAGE,
      start: LOADING_MESSAGE,
      end: LOADING_MESSAGE
    },
    activeTournament: false
  }
}
