export const playerMixin = {
  props: {
    tournamentName: {
      type: String,
      default: 'Sjakk-Arena turnering'
    },
    tournamentStart: {
      type: String,
      required: true
    },
    tournamentEnd: {
      type: String,
      required: false
    },
    playerName: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      required: true
    }
  }
}
