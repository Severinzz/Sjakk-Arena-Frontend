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
  },
  setPaired: (state, paired) => {
    state.paired = paired
  },
  setActiveGame: (state, activeGame) => {
    state.activeGame = activeGame
  },
  setPoints: (state, points) => {
    state.points = points
  },
  setResultDialog: (state, resultDialog) => {
    state.resultDialog = resultDialog
  },
  setSuggestedResult: (state, suggested) => {
    state.resultDialog.suggested_result = suggested
  },
  setOpponentsDisagree: (state, disagree) => {
    state.resultDialog.opponents_disagree = disagree
  }
}
