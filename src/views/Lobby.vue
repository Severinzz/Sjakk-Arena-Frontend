<template>
    <v-container class="content-wrapper" fluid>
      <v-row style="height: 100%;">
        <v-col cols="2">
          <div class="info-wrapper">
            <tournament-info
              :tournament="tournament"
              :started="false"/>
            <p class="numberOfPlayers">Antall spillere:  {{this.getPlayerCount}}</p>
            <div class="button-wrapper">
              <v-btn id="start" color="primary" class="mr-4" >start</v-btn>
              <v-btn id="cancel" class="mr-4" >Cancel</v-btn>
            </div>
          </div>
        </v-col>
          <v-col
                 offset="5"
                 offset-sm="3"
          offset-md="2"
          offset-lg="1"
          offset-xl="0">
          <v-row
            align="start"
            justify="start"
            class="text-center">

            <div
              v-for="(player, index) in players"
              :key="index"
              @click="handleRemovePlayer(index)"
              class="player-wrapper"
            >
              <player
              :player-name="player.name"
              :player-piece="randomIcon()"
              />
            </div>
          </v-row>
          </v-col>
      </v-row>
    </v-container>
</template>

<script>
import TournamentInfo from '../components/TournamentInfo'
import Player from '../components/Player'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Lobby',
  components: {
    TournamentInfo,
    Player
  },
  data () {
    return {
      iconsAvailable: [
        'fas fa-chess-rook fa-3x',
        'fas fa-chess-queen fa-3x',
        'fas fa-chess-pawn fa-3x',
        'fas fa-chess-knight fa-3x',
        'fas fa-chess-king fa-3x',
        'fas fa-chess-bishop fa-3x'
      ]
    }
  },
  computed: {
    ...mapState([
      'tournament',
      'players'
    ]),
    ...mapGetters([
      'getPlayerCount'
    ])
  },
  methods: {
    ...mapActions([
      'removePlayer',
      'addPlayer'
    ]),
    randomIcon() {
      return this.iconsAvailable[Math.floor(Math.random() * this.iconsAvailable.length)]
    },
    handleRemovePlayer(index) {
      this.removePlayer(index)
    }
  }

}
</script>

<style>
  .content-wrapper{
    height: 100% !important;
    padding: 0 0 2% 0;
  }
  .numberOfPlayers{
    font-size: 1em;
  }
  .info-wrapper{
    text-align: center;
    display: inline-block;
    height: 100%;
    padding-top: 20%;
    margin: auto auto auto 10%;
  }
  .button-wrapper{
    margin: 5% 1% 0 1%;
    display: inline-block;
  }
  .player-wrapper{
    margin: 3% auto auto auto;
    padding: 10px;
    width: 10%;
    min-width: 150px;
  }
  .player-wrapper:hover{
    text-decoration: line-through;
  }
  div.col {
    height: 100%;
    padding: 0;
  }
</style>
