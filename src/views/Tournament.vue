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
            <v-btn id="Games" class="mr-4" @click="alterShowLeaderBoard">
              {{ alterLeaderBoardText }}
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
             xl="7"
             lg="5"
             md="6"
             sm="5"
      >
        <Table
          class="leaderBoard"
          v-if="showLeaderBoard"
          :object-list="Array.from(playerList)"
          :attribute-list="leaderBoardAttributeList"
          :heading-list="leaderBoardHeadingList"
          :autoScrollOption="true"
          @entryClicked="handlePlayerClicked"
        />
        <!-- TODO: Add functionality when clicked (same as invalid games component?) -->
        <Table
          class="leaderBoard"
          v-if="!showLeaderBoard"
          :object-list="Array.from(gamesList)"
          :attribute-list="activeGamesAttributeList"
          :heading-list="activeGamesHeadingList"
          :autoScrollOption="true"
        />
        <!-- Invalid games component -->
        <div v-if="invalidGames">
        <v-divider></v-divider>
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
  </span>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import { mapActions, mapGetters } from 'vuex'
import InvalidGames from '@/components/InvalidGames'
import Table from '../components/Table'
import WarningDialog from '../components/WarningDialog'

export default {
  name: 'Tournament',
  components: {
    Table,
    WarningDialog,
    TournamentInfo,
    InvalidGames
  },
  data () {
    return {
      activeTournament: '',
      invalidGames: true,
      pause: false,
      pauseButtonText: 'Pause',
      showLeaderBoard: true,
      alterLeaderBoardText: 'Vis parti oversikt',
      leaderBoardAttributeList: ['placement', 'name', 'points'],
      leaderBoardHeadingList: ['Plassering', 'Spiller', 'Poeng'],
      activeGamesAttributeList: ['table', 'white_player_name', 'black_player_name', 'start'],
      activeGamesHeadingList: ['Bord', 'Hvit spiller', 'Svart spiller', 'Startet'],
      endDialog: false,
      endDialogTitle: 'Avslutt turnering'
    }
  },
  computed: {
    ...mapGetters([
      'getPlayerCount',
      'getTournament',
      'getAllPlayers',
      'getActiveGames',
      'isTournamentActive'
    ]),
    // Add placement to the players.
    playerList () {
      let list = this.getAllPlayers
      let i = 1
      if (list.length) {
        list.forEach(function (player) {
          player['placement'] = i
          i++
        })
      }
      return list
    },
    gamesList () {
      let list = this.getActiveGames
      list.forEach(function (game) {
        game['start'] = game['start'].split(' ')[1]
        game['start'] = game['start'].split(':')[0] + ':' + game['start'].split(':')[1]
      })
      return list
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
    alterShowLeaderBoard() {
      this.showLeaderBoard = !this.showLeaderBoard
      this.showLeaderBoard === true ? this.alterLeaderBoardText = 'Vis partioversikt' : this.alterLeaderBoardText = 'Vis rangeringstabell'
    },
    endTournament() {
      this.sendEndRequest().then(res => {
        this.$router.push('/')
      })
    },
    closeEndDialog() {
      this.endDialog = false
      this.endDialogTitle = 'Avslutt turnering'
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
  /deep/ .leaderBoard td {
    font-size: 2em;
    font-weight: bold;
  }
  /deep/ .leaderBoard th {
   }
  /deep/ .leaderBoard {
    margin: 2em auto;
  }
  .content-wrapper {
    padding: 0 0 2% 0;
  }
  .numberOfPlayers {
    font-size: 1.5em;
  }
  .playerTable{
    margin: auto !important;
    display: inline-block;
    text-align: center;
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
