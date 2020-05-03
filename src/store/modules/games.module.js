import { PLAYER_SERVICE, TOURNAMENT_SERVICE } from '../../common/api'
import WEBSOCKET_SERVICE from '../../common/websocketApi'
const LOADING_MESSAGE = 'loading....'

export const state = getDefaultState()
export const mutations = {
  /**
   * Sets games with invalid result
   * @param state
   * @param invalidGame The invalid game
   */
  setInvalidGames: (state, invalidGame) => {
    state.invalidGames = invalidGame
  },

  /**
   * Sets a player's active game
   * @param state
   * @param activeGame The active game
   */
  setActiveGame: (state, activeGame) => {
    state.activeGame = activeGame
  },

  /**
   * Sets a tournament's active games
   * @param state
   * @param activeGames The active games in the tournament.
   */
  setActiveGames: (state, activeGames) => {
    state.activeGames = activeGames
  },

  /**
   * Resets the game state
   * @param state
   */
  resetGamesState: (state) => {
    // https://github.com/vuejs/vuex/issues/1118
    Object.assign(state, getDefaultState())
  },

  /**
   * Sets information about a result dialog
   * @param state
   * @param resultDialog Boolean value to alter resultDialog state.
   */
  setResultDialog: (state, resultDialog) => {
    state.resultDialog = resultDialog
  },

  /**
   * Sets a result dialog's suggested result
   * @param state
   * @param suggested The suggested result
   */
  setSuggestedResult: (state, suggested) => {
    state.resultDialog.suggested_result = suggested
  },

  /**
   * Sets true if opponents disagree on a result
   * @param state
   * @param disagree Boolean value to tell if the players disagree on the result.
   */
  setOpponentsDisagree: (state, disagree) => {
    state.resultDialog.opponents_disagree = disagree
  }
}
export const actions = {

  /**
   * Resets games
   * @param commit
   */
  resetGames: ({ commit }) => {
    commit('resetGamesState')
  },

  /**
   * Sends a game and its result to the server.
   * @param commit
   * @param gameIDAndResult Object containing the game-ID and the result.
   * @returns {Promise<AxiosResponse<T>>}
   */
  hostSendGameResult: ({ commit }, gameIDAndResult) => {
    let slug = 'games/result/' + gameIDAndResult + '/'
    return TOURNAMENT_SERVICE.patch(slug)
  },

  /**
   * Fetches a player's results in the tournament
   * @returns {Promise<AxiosResponse<T>>}
   */
  fetchResults: () => {
    return PLAYER_SERVICE.get('games/inactive').catch(err => {
      throw err
    })
  },

  /**
   * Fetches a tournament's player's inactive games
   * @param commit
   * @param payload Object containing the player's id.
   * @returns {Promise<AxiosResponse<T>>}
   */
  fetchPlayersInactiveGames: ({ commit }, payload) => {
    return TOURNAMENT_SERVICE.get(`games/inactive/${payload.id}`).catch(err => {
      throw err
    })
  },

  /**
   * Sends a game result to the server.
   * @param commit
   * @param result The result of the game
   * @param opponent Player-ID of the opponent
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendGameResult: ({ commit }, { result, opponent }) => {
    return PLAYER_SERVICE.put(`games/add-result?result=${result}&opponent=${opponent}`)
  },

  /**
   * Validates a game's result
   * @param commit
   * @param gameId Id of the game that should have result validated.
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendValidationOfResult: ({ commit }, gameId) => {
    return PLAYER_SERVICE.patch(`games/${gameId}/validate`).catch(err => {
      throw err
    })
  },

  /**
   * Invalidates a game's result
   * @param commit
   * @param gameId Id of the game.
   * @returns {Promise<AxiosResponse<T>>}
   */
  sendInvalidationOfResult: ({ commit }, gameId) => {
    return PLAYER_SERVICE.patch(`games/${gameId}/invalidate`).catch(err => {
      throw err
    })
  },

  /**
   * Subscribes to active games. Receives active games from the server when the list of active games changes
   * @param commit
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

  /**
   * Subscribes to a player's active game. Receives a new game when it is created on the server
   * @param commit
   * @param dispatch
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

  /**
   * Subscribes to suggested result. Receives information about result suggestions when such is changed by the opponent
   * or the tournament host
   * @param commit
   */
  subscribeToSuggestedResult: ({ commit }) => {
    let resultCallback = function (res) {
      let resultDialog = JSON.parse(res.body)
      commit('setResultDialog', resultDialog)
    }
    let sub = { path: 'player/result', callback: resultCallback }
    WEBSOCKET_SERVICE.connect(sub)
  },

  /**
   * Subscribes to games with invalid result. The tournament host receives a list of games with invalid result when
   * the list changes on the server.
   * @param commit
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

/**
 * Returns the default state.
 * @returns {{activeGames: [], activeGame: {colour: string, opponent: string, table: string}, invalidGames: [],
 * resultDialog: {valid: boolean, opponents_disagree: boolean, suggested_result: undefined, game_id: string}}}
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
