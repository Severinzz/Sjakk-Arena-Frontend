import playingPlayers from '../data/playingPlayers'
// TODO: REFACTOR STORE TO USE MODULES?
const LOADING_MESSAGE = 'loading....'
let tournament = {
  // Default value of tournament to prevent errors on load
  id: LOADING_MESSAGE,
  name: LOADING_MESSAGE,
  start: LOADING_MESSAGE,
  end: LOADING_MESSAGE
}
let player = {
  name: LOADING_MESSAGE,
  points: LOADING_MESSAGE
}
let players = {}

export default {
  players,
  tournament,
  player,
  playingPlayers
}
