<template>
    <v-container class="content-wrapper" fluid>
      <v-row style="height: 100%;">
        <v-col cols="2" style="height: 100%;">
          <div class="info-wrapper">
            <tournament-info
              :tournament="tournament"
              :started="false"/>

            <div class="button-wrapper">
              <v-btn class="mr-4" >start</v-btn>
              <v-btn class="mr-4" >Cancel</v-btn>
            </div>
          </div>
        </v-col>
          <v-col class="1">
          <v-row
            align="start"
            justify="start"
            class="text-center"
            style="height: 100%;"
          >
            <div
              v-for="player in players"
              :key="player.index"
              class="player-wrapper"
            >
              <p class="player-name">{{ player.name }}</p>
              <i :class="randomIcon()"></i>
            </div>
          </v-row>
          </v-col>
      </v-row>
    </v-container>
</template>

<script>
import TournamentInfo from '../components/TournamentInfo'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Lobby',
  components: {
    TournamentInfo
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
    randomIcon() {
      return this.iconsAvailable[Math.floor(Math.random() * this.iconsAvailable.length)]
    }
  }

}
</script>

<style>
  .content-wrapper{
    height: 100% !important;
  }
  .info-wrapper{
    justify-items: center;
    align-content: center;
    text-align: center;
    border-right: 10px solid rebeccapurple;
    display: inline-block;
    height: 100%;
  }
  .button-wrapper{
    margin: 2% 1% 0 1%;
    display: inline-block;
  }
  .player-name{
    font-size: 1.3em;
    font-weight: bold;
  }
  .player-wrapper{
    margin: auto;
    padding: 10px;
    width: 10%;
  }
  .player-wrapper:hover{
  }
  .info-col{
    height: 100%;
  }
</style>
