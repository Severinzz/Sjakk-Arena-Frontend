export default {
  addPlayer: (state, player) => {
    state.players.push(player)
  },
  removePlayer: (state, index) => {
    state.players.splice(index, 1)
  }
}