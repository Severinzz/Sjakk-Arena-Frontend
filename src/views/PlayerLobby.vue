<template>
  <div>
    <v-container>
      <!-- Let the system decide what to load when we are waiting -->
      <!-- https://vuejs.org/v2/guide/conditional.html -->
      <div v-if="!activeTournament">
        <PlayerWaiting
          :tournament-name="tournamentName"
          :tournament-start="tournamentStart"
          :tournament-end="tournamentEnd"
          :player-name="playerName"
          :points="points"
        >
        </PlayerWaiting>
      </div>

      <!-- Let the system decide what to load when we are not waiting -->
      <div v-else-if="activeTournament">
        <PlayerPlaying
          :tournament-name="tournamentName"
          :tournament-start="tournamentStart"
          :tournament-end="tournamentEnd"
          :player-name="playerName"
          :points="points"
        >
        </PlayerPlaying>
      </div>

      <!-- Something goes wrong -->
      <div v-else>
        <h1>Something wrong in PlayerLobby.vue. activeTournament = {{ activeTournament }}</h1>
      </div>

      <v-row class="justify-center" align="center">
        <v-dialog v-model="kickedDialog" max-width="650px">
          <v-card>
            <v-card-title class="justify-center title">Du har blitt kastet ut av turneringen!</v-card-title>
            <v-card-text class="card-text">
              <h2 v-if="kickedMessage !== ''"> Begrunnelse: {{ kickedMessage }}</h2>
              <h3> Går tilbake til startsiden om: </h3>
              <h1> {{ countDownNr }} </h1>
            </v-card-text>
            <v-card-actions>
              <!-- User has the option to either leave or go back -->
              <v-btn text color="primary" outlined @click="navigateHome">Gå tilbake nå</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>

    </v-container>
    <v-spacer/>
  </div>
</template>

<script>
import PlayerWaiting from '../components/PlayerLobby/PlayerWaiting'
import PlayerPlaying from '../components/PlayerLobby/PlayerPlaying'
import storage from '../common/jwt.storage'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PlayerLobby',
  components: {
    PlayerWaiting,
    PlayerPlaying
  },
  computed: {
    ...mapState({
      tournamentName: state => state.tournament.name,
      tournamentStart: state => state.tournament.start,
      tournamentEnd: state => state.tournament.end,
      activeTournament: state => state.activeTournament,
      playerName: state => state.player.name,
      points: state => state.player.points
    })
  },
  methods: {
    ...mapActions([
      'fetchPlayersTournament',
      'fetchPlayer',
      'subscribeToPlayerLobbySubscriptions',
      'unsubscribeAll',
      'close'
    ]),
    countDown() {
      this.countDownNr--
      if (this.countDownNr === 0) {
        clearInterval(this.intervalId)
        this.kickedDialog = false
        this.navigateHome()
      }
    },
    navigateHome() {
      this.kickedDialog = false
      storage.deleteToken()
      this.$router.replace('/')
    },
    startCountDown() {
      this.intervalId = setInterval(this.countDown, 1000)
    }
  },
  data () {
    return {
      kickedMessage: '',
      countDownNr: 6,
      intervalId: '',
      kickedDialog: false
    }
  },
  mounted() {
    this.fetchPlayersTournament()
    this.fetchPlayer()
    let vm = this
    let callback = function(res) {
      vm.kickedMessage = res.body
      vm.kickedDialog = true
      vm.startCountDown()
    }
    this.subscribeToPlayerLobbySubscriptions(callback)
  },
  destroyed () {
    this.unsubscribeAll()
    this.close()
  }
}
</script>

<style scoped>
  button{
    margin: auto
  }
  .card-text{
    justify-content: center;
    text-align: center;
  }
  h1{
    margin-top: 1em;
  }
  h3{
    margin-top: 1em;
  }
  .title{
    word-break: keep-all;
  }
</style>
