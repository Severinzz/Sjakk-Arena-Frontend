import playingPlayers from '../data/playingPlayers'
import devTournament from '../data/tournament'
// TODO: REFACTOR STORE TO USE MODULES?
// TODO: SLETT TING FRA STORE SOM IKKJE BLIR BRUKT
// TODO: IKKJE BRUK STORE PÅ TING MAN IKKJE TRENG PÅ FLEIR SIDE/SOM MAN KAN FÅ TAKI I REST/SOCKET KALLA
const LOADING_MESSAGE = 'loading....'
let tournament = getDefaultTournament()
let player = getDefaultPlayer()
let players = getDefaultPlayers()
let activeTournament = getDefaultTournamentActive()
let paired = getDefaultPaired()
let activeGame = getDefaultActiveGame()
let activeGames = getEmptyList()
let points = getDefaultPoints()
let resultDialog = getDefaultResultDialog()
let invalidGames = getEmptyList()

function getDefaultTournament() {
  return {
    // Default value of tournament to prevent errors on load
    id: LOADING_MESSAGE,
    name: LOADING_MESSAGE,
    start: LOADING_MESSAGE,
    end: LOADING_MESSAGE
  }
}

function getDefaultPlayer() {
  return {
    name: LOADING_MESSAGE,
    points: LOADING_MESSAGE
  }
}

function getDefaultPlayers() {
  return {}
}

function getDefaultTournamentActive() {
  return false
}

function getDefaultPaired() {
  return false
}

function getDefaultActiveGame() {
  return {
    table: LOADING_MESSAGE,
    opponent: LOADING_MESSAGE,
    colour: LOADING_MESSAGE
  }
}

function getEmptyList() {
  return []
}

function getDefaultPoints() {
  return NaN
}

function getDefaultResultDialog() {
  return {
    suggested_result: undefined,
    game_id: '',
    opponents_disagree: false,
    valid: false
  }
}

function setStateToDefault () {
  this.tournament = getDefaultTournament()
  this.player = getDefaultPlayer()
  this.players = getDefaultPlayers()
  this.activeTournament = getDefaultTournamentActive()
  this.paired = getDefaultPaired()
  this.activeGame = getDefaultActiveGame()
  this.activeGames = getEmptyList()
  this.points = getDefaultPoints()
  this.resultDialog = getDefaultResultDialog()
  this.invalidGames = getEmptyList()
}
export default {
  players,
  tournament,
  devTournament,
  player,
  playingPlayers,
  activeTournament,
  paired,
  activeGame,
  points,
  resultDialog,
  activeGames,
  setStateToDefault,
  invalidGames
}
