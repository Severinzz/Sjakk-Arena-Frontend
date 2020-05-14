import Vue from 'vue'
import Vuex from 'vuex'
import { deleteToken } from '../common/jwt.storage'
import { API_SERVICE } from '../common/api'

import * as games from '@/store/modules/games.module'
import * as players from '@/store/modules/players.module'
import * as tournament from '@/store/modules/tournament.module'
import * as files from '@/store/modules/files.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    games,
    players,
    tournament,
    files
  },
  actions: {
    resetAllStatesAndToken: ({ dispatch }) => {
      deleteToken()
      API_SERVICE.clearHeader()
      dispatch('resetTournament')
      dispatch('resetPlayer')
      dispatch('resetGames')
    }
  }
})
