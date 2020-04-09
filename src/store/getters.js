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
  isTournamentActive: (state) => {
    return state.activeTournament
  },
  getActiveGames: (state) => {
    return state.activeGames
  }
}
