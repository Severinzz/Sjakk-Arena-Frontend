import { API_SERVICE, PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import { addToken } from '../../common/jwt.storage'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = setDefaultState()
export const mutations = {
  addTournament: (state, tournament) => {
    state.tournament = tournament
    state.activeTournament = tournament.active
  },
  setTournamentActive: (state, active) => {
    state.activeTournament = active
  },
  resetTournamentState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, setDefaultState())
  }
}
export const actions = {

  resetTournament: ({ commit }) => {
    commit('resetTournamentState')
  },

  /*
    Send a tournament to the server.
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

  /*
  Send tournament pause request to server.
   */
  sendTournamentPauseRequest: () => {
    return TOURNAMENT_SERVICE.patch('pause').catch(res => {
      throw res.response
    })
  },

  /*
  Send tournament unpause request to server.
 */
  sendTournamentUnpauseRequest: () => {
    return TOURNAMENT_SERVICE.patch('unpause').catch(res => {
      throw res.response
    })
  },

  /*
  Fetch a tournament from the server.
 */
  fetchTournament: ({ commit }) => {
    return TOURNAMENT_SERVICE.get().then(res => {
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
  Fetch the tournament a player is enrolled in.
  IDENTISK til fetchTournament frontend men, forskjellig formatering på backend.
 */
  fetchPlayersTournament: ({ commit }) => {
    return PLAYER_SERVICE.get('tournament').then(res => {
      commit('addTournament', res.data)
    })
  },

  sendStartRequest: () => {
    return TOURNAMENT_SERVICE.patch('start').catch(err => {
      throw err
    })
  },

  sendEndRequest: () => {
    return TOURNAMENT_SERVICE.patch('end').catch(err => {
      throw err
    })
  },

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
  isTournamentActive: (state) => {
    return state.activeTournament
  }
}

function setDefaultState() {
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
