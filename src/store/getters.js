export default {
  getAllPlayers: (state) => {
    return state.players
  },
  getPlayerCount: (state) => {
    return state.players.length
  },
  getTournament: (state) => {
    return state.tournament
  }
}
