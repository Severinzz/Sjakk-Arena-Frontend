import Vue from 'vue'
import Vuex from 'vuex'

import * as games from '@/store/modules/games.module'
import * as players from '@/store/modules/players.module'
import * as tournament from '@/store/modules/tournament.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    games,
    players,
    tournament
  }
})
