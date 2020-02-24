import playingPlayers from '../data/playingPlayers'
import devTournament from '../data/tournament'
// TODO: REFACTOR STORE TO USE MODULES?
let tournament = {
  // Default value of tournament to prevent errors on load
  id: 'loading....',
  start: 'loading......',
  end: 'loading......'
}
let player = {}
let players = {}

export default {
  players,
  tournament,
  devTournament,
  player,
  playingPlayers
}
