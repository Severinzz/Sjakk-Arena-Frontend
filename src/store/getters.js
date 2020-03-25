export default {
  getAllPlayers: (state) => {
    return state.player
  },
  getPlayerCount: (state) => {
    return state.player.length
  },
  getTournament: (state) => {
    return state.tournament
  },
  getInvalidGame: (state) => {
    return state.game
  }
}
