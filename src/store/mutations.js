export default {
  addPlayer: (state, player) => {
    state.players.push(player)
  },
  removePlayer: (state, index) => {
    state.players.splice(index, 1)
  },
  addTournament: (state, tournament) => {
    state.tournament = tournament
  },
  createPlayer: (state, player) => {
    state.player = player
  },
  addPlayers: (state, payload) => {
    state.player = payload
  }
}
