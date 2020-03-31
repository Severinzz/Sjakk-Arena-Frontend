import playingPlayers from '../data/playingPlayers'
import devTournament from '../data/tournament'
// TODO: REFACTOR STORE TO USE MODULES?
// TODO: SLETT TING FRA STORE SOM IKKJE BLIR BRUKT
// TODO: IKKJE BRUK STORE PÅ TING MAN IKKJE TRENG PÅ FLEIR SIDE/SOM MAN KAN FÅ TAKI I REST/SOCKET KALLA
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
let activeTournament = false
let paired = false
let activeGame = {
  table: LOADING_MESSAGE,
  opponent: LOADING_MESSAGE,
  colour: LOADING_MESSAGE
}
let points = NaN
export default {
  players,
  tournament,
  devTournament,
  player,
  playingPlayers,
  activeTournament,
  paired,
  activeGame,
  points
}
