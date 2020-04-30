import { PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = getDefaultState()
export const mutations = {
  /*
  Sets games with invalid result
   */
  setInvalidGames: (state, invalidGame) => {
    state.invalidGames = invalidGame
  },
  /*
  Sets a player's active game
   */
  setActiveGame: (state, activeGame) => {
    state.activeGame = activeGame
  },

  /*
  Sets a tournament's active games
   */
  setActiveGames: (state, activeGames) => {
    state.activeGames = activeGames
  },
  /*
 Resets the game state
  */
  resetGamesState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState())
  },
  /*
    Sets information about a result dialog
  */
  setResultDialog: (state, resultDialog) => {
    state.resultDialog = resultDialog
  },
  /*
  Sets a result dialog's suggested result
   */
  setSuggestedResult: (state, suggested) => {
    state.resultDialog.suggested_result = suggested
  },

  /*
  Sets true if opponents disagree on a result
   */
  setOpponentsDisagree: (state, disagree) => {
    state.resultDialog.opponents_disagree = disagree
  }
}
export const actions = {
  /*
  Resets games
   */
  resetGames: ({ commit }) => {
    commit('resetGamesState')
  },
  /*
  Sends a game and its result to the server.
 */
  hostSendGameResult: ({ commit }, gameIDAndResult) => {
    let slug = 'games/result/' + gameIDAndResult + '/'
    return TOURNAMENT_SERVICE.patch(slug)
  },

  /*
  Fetches a player's results in the tournament
   */
  fetchResults: () => {
    return PLAYER_SERVICE.get('games/inactive').catch(err => {
      throw err
    })
  },
  /*
  Fetches a tournament's player's inactive games
   */
  fetchPlayersInactiveGames: ({ commit }, payload) => {
    return TOURNAMENT_SERVICE.get(`games/inactive/${payload.id}`).catch(err => {
      throw err
    })
  },

  /*
  Sends a game result to the server.
 */
  sendGameResult: ({ commit }, { result, opponent }) => {
    return PLAYER_SERVICE.put(`games/add-result?result=${result}&opponent=${opponent}`)
  },

  /*
  Validates a game's result
   */
  sendValidationOfResult: ({ commit }, gameId) => {
    return PLAYER_SERVICE.patch(`games/${gameId}/validate`).catch(err => {
      throw err
    })
  },
  /*
  Invalidates a game's result
   */
  sendInvalidationOfResult: ({ commit }, gameId) => {
    return PLAYER_SERVICE.patch(`games/${gameId}/invalidate`).catch(err => {
      throw err
    })
  },

  /*
  Subscribes to active games. Receives active games from the server when the list of active games changes
   */
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

  /*
  Subscribes to a player's active game. Receives a new game when it is created on the server
   */
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

  /*
  Subscribes to suggested result. Receives information about result suggestions when such is changed by the opponent
  or the tournament host
   */
  subscribeToSuggestedResult: ({ commit }) => {
    let resultCallback = function (res) {
      let resultDialog = JSON.parse(res.body)
      commit('setResultDialog', resultDialog)
    }
    let sub = { path: 'player/result', callback: resultCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  /*
  Subscribes to games with invalid result. The tournament host receives a list of games with invalid result when
  the list changes on the server.
   */
  subscribeToInvalidGames: ({ commit }) => {
    let invalidGameCallback = function (res) {
      let invalidGames = JSON.parse(res.body)
      commit('setInvalidGames', invalidGames)
    }
    let sub = { path: 'tournament/games/invalid', callback: invalidGameCallback }
    WEBSOCKET_SERVICE.connect(sub)
  }
}
export const getters = {
}

/*
Returns a default state
 */
function getDefaultState() {
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
