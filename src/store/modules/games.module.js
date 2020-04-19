import { PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = {
  activeGame: {
    table: LOADING_MESSAGE,
    opponent: LOADING_MESSAGE,
    colour: LOADING_MESSAGE
  },
  activeGames: [],
  invalidGames: []
}
export const mutations = {
  addInvalidGame: (state, invalidGame) => {
    if (Array.isArray(invalidGame)) {
      state.invalidGames = invalidGame
    } else {
      state.invalidGames.push(invalidGame)
    }
  },

  removeInvalidGame: (state, index) => {
    state.invalidGames.splice(index, 1)
  },

  setActiveGame: (state, activeGame) => {
    state.activeGame = activeGame
  },

  setActiveGames: (state, activeGames) => {
    state.activeGames = activeGames
  }
}
export const actions = {

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
      throw err.response
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
      commit('setActiveGame', newGame)
      dispatch('setPlayerPaired', true)
    }
    let sub = { path: 'player/active-game', callback: newGameCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  subscribeToSuggestedResult: ({ commit }) => {
    let resultCallback = function (res) {
      let resultDialog = JSON.parse(res.body)
      commit('setResultDialog', resultDialog)
    }
    return { path: 'player/result', callback: resultCallback }
  },

  subscribeToInvalidGames: ({ commit }) => {
    let invalidGameCallback = function (res) {
      let invalidGame = JSON.parse(res.body)
      commit('addInvalidGame', invalidGame)
    }
    let sub = { path: 'tournament/games/invalid', callback: invalidGameCallback }
    WEBSOCKET_SERVICE.connect(sub)
  }
}
export const getters = {
}
