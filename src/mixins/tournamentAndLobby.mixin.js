export const tournamentAndLobbyMixin = {
  async created() {
    // If the tournament id is a string then it wil get the tournament from the server since the id should always be int.
    if (typeof this.tournament.user_id === 'string') {
      await this.fetchTournament()
    }
    this.pathVar = this.pathVar + this.tournament.user_id
    this.subscribeToTournamentActive({ userRole: 'tournament' })
    this.subscribeToPlayers(this.isTournamentActive)
  }
}
