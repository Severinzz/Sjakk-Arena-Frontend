<template>
  <div>
    <tournament-info
  :tournament="tournament"
  :started="false"/>
  <v-divider
    class="mx-11"
    inset
    vertical>
  </v-divider>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-row
            align="start"
            justify="start"
            class="grey lighten-5"
            style="height: 300px;"
          >
            <v-card
              v-for="player in players"
              :key="player.index"
              class="ma-3 pa-6 justify-center"
              outlined
              tile
              icon="fas fa-chess-rook"
            >
              {{ player.name }}
              <br>
              <i :class="randomIcon()"></i>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
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

<style scoped>
</style>
