<template>
  <span>
  <v-container class="content-wrapper" fluid>
    <v-row>
      <v-col cols="2">
        <div class="info-wrapper">
          <tournament-info
            :tournament="this.activeTournament"
            :started="true"
          />
          <p class="numberOfPlayers">
            Antall spillere: {{ this.playerCount }}
          </p>
          <div class="button-wrapper">
            <v-btn id="Games" class="mr-4">
              Parti oversikt
            </v-btn>
            <v-btn id="Pause" class="mr-4" @click="alterPauseState">
              {{ pauseButtonText }}
            </v-btn>
            <v-btn id="Stop"
                   color="error"
                   class="mr-4"
                   @click="endDialog = true">
              Avslutt
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col class="playerTable"
             xl="5"
             lg="5"
             md="6"
             sm="5"
      >
        <!-- Adapted from https://vuetifyjs.com/en/components/simple-tables -->
        <!-- TODO: Bytt til table komponenten -->
      <v-simple-table>
        <template v-slot:default>
          <tbody>
          <tr
            v-for="player in playerList"
              :key="player.name"
            @click="handlePlayerClicked(player)"
          >
            <td>
              {{ player.name }}
            </td>
            <td>
              {{ player.points }}
            </td>
          </tr>
          </tbody>
          <!-- TODO: Lage knappa til en egen komponent? Mange begynn kanskje å bli veldi like -->
          <div
          v-if="playerCount > 0"
          >
          <v-btn class="tableBtn mr-4"
            @click="increaseLimit()"
            :disabled="limit >= playerCount">Vis flere</v-btn>
          <v-btn class="tableBtn mr-4"
            @click="decreaseLimit()"
            :disabled="limit <= 5">Vis mindre</v-btn>
          </div>
        </template>
      </v-simple-table>
        <!-- end -->
        <v-divider></v-divider>
        <!-- Invalid games component -->
        <div v-if="invalidGames">
      <InvalidGames></InvalidGames>
    </div>
      </v-col>
    </v-row>
  </v-container>
  <warning-dialog
  :title="endDialogTitle"
  action="avslutte turneringen"
  carry-on-button-text="Avslutt turnering"
  :show-dialog="endDialog"
  @carryOn="endTournament()"
  @closeDialog="closeEndDialog()">
  </warning-dialog>
    <warning-dialog
      title="Forlat turneringen"
      action="forlate tuneringen"
      :show-dialog="leaveWarn"
      carry-on-button-text="Forlat turnering"
      @carryOn="leaveTournament()"
      @closeDialog="leaveWarn = false"
    ></warning-dialog>
  </span>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import InvalidGames from '@/components/InvalidGames'
import { mapActions, mapGetters } from 'vuex'
import WarningDialog from '../components/WarningDialog'

export default {
  name: 'Tournament',
  components: {
    WarningDialog,
    TournamentInfo,
    InvalidGames
  },
  data () {
    return {
      intervalId: '',
      limit: 5,
      activeTournament: '',
      leaderboard: [],
      instance: this,
      invalidGames: true,
      pause: false,
      pauseButtonText: 'Pause',
      endDialog: false,
      endDialogTitle: 'Avslutt turnering',
      pathVar: 'tournament/',
      leaveWarn: false
    }
  },
  computed: {
    ...mapGetters([
      'getPlayerCount',
      'getTournament',
      'getAllPlayers',
      'isTournamentActive'
    ]),
    // https://stackoverflow.com/questions/46622209/how-to-limit-iteration-of-elements-in-v-for/54836170#54836170
    playerList () {
      return this.getPlayerCount > this.limit ? this.getAllPlayers.slice(0, this.limit) : this.getAllPlayers
    },
    playerCount() {
      return this.getPlayerCount
    }
  },
  methods: {
    ...mapActions([
      'subscribeToLobbySubscriptions',
      'fetchTournament',
      'unsubscribe',
      'close',
      'sendTournamentPauseRequest',
      'sendTournamentUnpauseRequest',
      'sendEndRequest'
    ]),
    increaseLimit () {
      if (this.limit < this.playerCount) {
        this.limit = this.limit + 5
      }
    },
    decreaseLimit() {
      if (this.limit > 5) {
        this.limit = this.limit - 5
      }
    },
    handlePlayerClicked(player) {
      // TODO: PRØVE Å SENDE PLAYER?
      // https://stackoverflow.com/a/47874850
      let route = this.$router.resolve('/tournament/player/' + player.user_id)
      window.open(route.href, '_blank')
    },
    alterPauseState() {
      this.pause = !this.pause
      if (this.pause) {
        this.sendTournamentPauseRequest()
        this.pauseButtonText = 'Fortsett'
      } if (!this.pause) {
        this.sendTournamentUnpauseRequest()
        this.pauseButtonText = 'Pause'
      }
    },
    endTournament() {
      this.sendEndRequest().then(res => {
        this.$router.push('/')
      })
    },
    closeEndDialog() {
      this.endDialog = false
      this.endDialogTitle = 'Avslutt turnering'
    },
    alterLeaveDialogState() {
      this.leaveWarn = !this.leaveWarn
    }
  },
  mounted() {
  /*
    Send warning to user when back button is pressed.
    adapted from from: https://stackoverflow.com/questions/12381563/how-to-stop-browser-back-button-using-javascript
  */
    let VM = this
    window.location.hash = this.pathVar + this.getTournament.user_id
    window.location.hash = this.pathVar + this.getTournament.user_id // Varsel vil nå dukke opp to ganger
    window.onhashchange = function() {
      window.onpopstate = function() { VM.alterLeaveDialogState() }
    }
  },
  async created () {
    let started = true
    // If the tournament id is a string then it wil get the tournament from the server since the id should always be int.
    this.activeTournament = this.getTournament
    if (typeof this.activeTournament.id === 'string') {
      await this.fetchTournament().then(() => {
        this.activeTournament = this.getTournament
      })
    }
    this.subscribeToLobbySubscriptions({ vm: this, started: started })
  },
  destroyed () {
    this.unsubscribe('leaderboard')
    this.close()
  },
  watch: {
    isTournamentActive: function(active) {
      if (!active) {
        this.endDialog = true
        this.endDialogTitle = 'Tidspunktet for turneringsslutt er passert'
      }
    }
  }
}
</script>

<style scoped>
  .content-wrapper {
    padding: 0 0 2% 0;
  }

  .numberOfPlayers {
    font-size: 1.5em;
  }
  .playerTable{
    margin: auto !important;
    display: inline-block;
  }

  .info-wrapper {
    text-align: center;
    display: inline-block;
    height: 100%;
    padding-top: 20%;
    margin: auto auto auto 10%;
  }

  .button-wrapper {
    display: inline-block;
  }

  .button-wrapper button{
    display: block;
    align-content: center;
    text-align: center;
    width: 100%;
    margin-top: 10%;
  }

  .tableBtn{
    margin-top: 5%;
  }

  td{
    font-size: 3em !important;
    font-weight: bold;
  }

  div.col {
    height: 100%;
    padding: 0;
  }

  @media (max-width: 1100px){
    td{
      font-size: 2em !important;
    }
  }

  @media (max-width: 1000px){
    .playerTable{
      margin-left: 25% !important;
    }
  }
  @media (max-width: 680px) and (min-width: 350px){
    .playerTable{
      margin-top: 700px !important;
      margin-left: 0 !important;
    }
  }
</style>
