export default {
  getAllPlayers: (state) => {
    return state.players
  },
  getPlayerCount: (state) => {
    return state.players.length
  }
}
