export default {
  addPlayer: ({ commit }, payload) => {
    commit('addPlayer', payload)
  },
  removePlayer: ({ commit }, index) => {
    commit('removePlayer', index)
  }
}
