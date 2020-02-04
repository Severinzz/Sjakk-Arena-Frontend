export default {
  addPlayer: (state, player) => {
    state.players.push(player)
  },
  removePlayer: (state, index) => {
    console.log(index)
    state.players.splice(index, 1)
  }
}
