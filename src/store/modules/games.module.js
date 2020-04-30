import { PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = setDefaultState()
export const mutations = {
  addInvalidGames: (state, invalidGame) => {
    state.invalidGames = invalidGame
  },
  setActiveGame: (state, activeGame) => {
    state.activeGame = activeGame
  },

  setActiveGames: (state, activeGames) => {
    state.activeGames = activeGames
  },

  resetGamesState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, setDefaultState())
  },

  setResultDialog: (state, resultDialog) => {
    state.resultDialog = resultDialog
  },

  setSuggestedResult: (state, suggested) => {
    state.resultDialog.suggested_result = suggested
  },

  setOpponentsDisagree: (state, disagree) => {
    state.resultDialog.opponents_disagree = disagree
  }
}
export const actions = {
  resetGames: ({ commit }) => {
    commit('resetGamesState')
  },
  /*
  Host send a game and its result to the server.
 */
  hostSendGameResult: ({ commit }, gameIDAndResult) => {
    let slug = 'games/result/' + gameIDAndResult + '/'
    return TOURNAMENT_SERVICE.patch(slug)
  },

  // Commit istede for å sende til komponent ?
  fetchResults: () => {
    return PLAYER_SERVICE.get('games/inactive').catch(err => {
      throw err
    })
  },

  /*
  Send a game result to the server.
 */
  sendGameResult: ({ commit }, { result, opponent }) => {
    return PLAYER_SERVICE.put(`games/add-result?result=${result}&opponent=${opponent}`)
  },

  sendValidationOfResult: ({ commit }, gameId) => {
    return PLAYER_SERVICE.patch(`games/${gameId}/validate`).catch(err => {
      throw err
    })
  },

  sendInvalidationOfResult: ({ commit }, gameId) => {
    return PLAYER_SERVICE.patch(`games/${gameId}/invalidate`).catch(err => {
      throw err
    })
  },

  subscribeToActiveGames: ({ commit }) => {
    let activeGamesCallback = function (res) {
      let activeGames = JSON.parse(res.body)
      commit('setActiveGames', activeGames)
    }
    let sub = {
      path: 'tournament/active-games',
      callback: activeGamesCallback
    }
    WEBSOCKET_SERVICE.connect(sub)
  },

  subscribeToActiveGame: ({ commit, dispatch }) => {
    let newGameCallback = function (res) {
      let newGame = JSON.parse(res.body)
      if (newGame.active) {
        commit('setActiveGame', newGame)
        dispatch('setPlayerPaired', true)
      } else {
        commit('setPaired', false)
      }
    }
    let sub = { path: 'player/active-game', callback: newGameCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  subscribeToSuggestedResult: ({ commit }) => {
    let resultCallback = function (res) {
      let resultDialog = JSON.parse(res.body)
      commit('setResultDialog', resultDialog)
    }
    let sub = { path: 'player/result', callback: resultCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  subscribeToInvalidGames: ({ commit }) => {
    let invalidGameCallback = function (res) {
      let invalidGames = JSON.parse(res.body)
      commit('addInvalidGames', invalidGames)
    }
    let sub = { path: 'tournament/games/invalid', callback: invalidGameCallback }
    WEBSOCKET_SERVICE.connect(sub)
  }
}
export const getters = {
}

function setDefaultState() {
  return {
    activeGame: {
      table: LOADING_MESSAGE,
      opponent: LOADING_MESSAGE,
      colour: LOADING_MESSAGE
    },
    resultDialog: {
      suggested_result: undefined,
      game_id: '',
      opponents_disagree: false,
      valid: false
    },
    activeGames: [],
    invalidGames: []
  }
}
