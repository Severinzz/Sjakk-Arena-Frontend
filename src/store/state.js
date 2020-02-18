import playingPlayers from '../data/playingPlayers'
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
  player,
  playingPlayers
}
