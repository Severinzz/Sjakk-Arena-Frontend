export default {
  addPlayer: (state, player) => {
    state.players.push(player)
  },
  removePlayer: (state, player) => {
    delete state.players[player]
  },
  addTournament: (state, tournament) => {
    state.tournament = tournament
  },
  createPlayer: (state, player) => {
    state.player = player
  },
  addPlayers: (state, payload) => {
    state.player = payload
  },
  setTournamentActive: (state, active) => {
    state.activeTournament = active
  },
  clearPlayers: (state) => {
    state.player = []
  }
}
