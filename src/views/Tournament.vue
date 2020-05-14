<template>
  <span>
  <v-container class="content-wrapper" fluid>
    <h1 v-if="this.pause">Turneringen er satt på pause</h1>
    <v-row>
      <v-col cols="2">
        <!-- Information side bar -->
        <div class="info-wrapper">
          <tournament-info
            :tournament="this.tournament"
            :started="true"
          />
          <p class="numberOfPlayers">
            Antall spillere: {{ this.getPlayerCount }}
          </p>
          <div class="button-wrapper">
            <v-btn
              id="Games"
              class="mr-4"
              @click="alterShowLeaderBoard"
            >
              {{ alterLeaderBoardText }}
            </v-btn>
            <v-btn
              id="Pause"
              class="mr-4"
              @click="alterPauseState"
            >
              {{ pauseButtonText }}
            </v-btn>
            <v-btn id="Stop"
                   color="error"
                   class="mr-4"
                   @click="leaveDialog = true"
            >
              Avslutt
            </v-btn>
          </div>
        </div>
      </v-col>

      <!-- Main content -->
      <v-col class="playerTable"
             xl="8"
             lg="7"
             md="7"
             sm="7"
             xs="7"
      >
        <!-- Leader board -->
        <Table
          class="tournament-table"
          v-if="showLeaderBoard"
          :object-list="Array.from(playerList)"
          :heading-list="leaderBoardHeadingList"
          :autoScrollOption="true"
          @entryClicked="handlePlayerClicked"
        />

        <!-- Active games -->
        <!-- TODO: Add functionality when clicked (set result or something) -->
        <Table
          class="tournament-table"
          v-if="!showLeaderBoard"
          :object-list="Array.from(gamesList)"
          :heading-list="activeGamesHeadingList"
          :autoScrollOption="true"
        />
        <!-- Invalid games component -->
      <div v-if="invalidGames">
        <v-divider/>
        <invalid-games/>
      </div>
      </v-col>
    </v-row>
  </v-container>
  <warning-dialog
  :title="leaveDialogTitle"
  action="avslutte turneringen"
  carry-on-button-text="Avslutt turnering"
  :show-dialog="leaveDialog"
  @carryOn="endTournament"
  @closeDialog="alterLeavePageDialogState"
  />
  </span>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { leavePageWarningMixin } from '../mixins/leavePageWarning.mixin'
import { tournamentAndLobbyMixin } from '../mixins/tournamentAndLobby.mixin'
import TournamentInfo from '@/components/hostcomponents/TournamentInfo'
import InvalidGames from '@/components/hostcomponents/InvalidGames'
import Table from '@/components/hostcomponents/Table'
import WarningDialog from '@/components/dialogs/WarningDialog'

export default {
  name: 'Tournament',
  components: {
    Table,
    WarningDialog,
    TournamentInfo,
    InvalidGames
  },
  mixins: [
    leavePageWarningMixin,
    tournamentAndLobbyMixin
  ],
  data () {
    return {
      invalidGames: true,
      pause: false,
      pauseButtonText: 'Pause',
      showLeaderBoard: true,
      alterLeaderBoardText: 'Vis parti oversikt',
      leaderBoardHeadingList: [ {
        text: 'Plassering',
        align: 'start',
        value: 'placement'
      },
      {
        text: 'Spiller',
        align: 'center',
        value: 'name'
      },
      {
        text: 'Poeng',
        align: 'end',
        value: 'points'
      }],
      activeGamesHeadingList: [
        {
          text: 'Bord',
          align: 'start',
          value: 'table'
        },
        {
          text: 'Hvit spiller',
          value: 'white_player_name'
        },
        {
          text: 'Svart spiller',
          value: 'black_player_name'
        },
        {
          text: 'Startet',
          align: 'end',
          value: 'start'
        }],
      leaveDialogTitle: 'Avslutt turnering',
      pathVar: 'tournament/'
    }
  },
  computed: {
    ...mapState({
      tournament: state => state.tournament.tournament,
      isTournamentActive: state => state.tournament.activeTournament,
      activeGames: state => state.games.activeGames
    }),
    ...mapGetters([
      'getPlayerCount',
      'getAllPlayers'
    ]),

    /**
     * Add placement to the players.
     * @returns {string} List of the current standing with placement number added.
     */
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

    /**
     * List of the currently active games.
     * @returns {any} List containing the currently active games with the right time format.
     */
    gamesList () {
      let list = this.activeGames
      list.forEach(function (game) {
        game['start'] = game['start'].split(' ')[1]
        game['start'] = game['start'].split(':')[0] + ':' + game['start'].split(':')[1]
      })
      return list
    }
  },
  methods: {
    ...mapActions([
      'fetchTournament',
      'unsubscribe',
      'sendTournamentPauseRequest',
      'sendTournamentUnpauseRequest',
      'sendEndRequest',
      'subscribeToPlayers',
      'subscribeToTournamentActive',
      'subscribeToActiveGames'
    ]),

    /**
     * Open the player details page in a new tab.
     * @param player The player to checkout.
     */
    handlePlayerClicked(player) {
      // https://stackoverflow.com/a/47874850
      let route = this.$router.resolve('/tournament/player/' + player.user_id)
      window.open(route.href, '_blank')
    },

    /**
     * Alters the pause state. Pause or not paused.
     */
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

    /**
     * Changes between leader board and active games table.
     */
    alterShowLeaderBoard() {
      this.showLeaderBoard = !this.showLeaderBoard
      this.showLeaderBoard === true ? this.alterLeaderBoardText = 'Vis partioversikt' : this.alterLeaderBoardText = 'Vis rangeringstabell'
    },

    /**
     * Send end request and navigate home if ended.
     */
    endTournament() {
      this.sendEndRequest().then(res => {
        this.wantToLeave = true
        this.$router.push('/')
      })
    }
  },
  watch: {
    /**
     * Watches for if the tournament is stil active. Displays message when end time is passed.
     * @param active Boolean value to tell if tournament is active.
     */
    isTournamentActive: function(active) {
      if (!active) {
        this.leaveDialogTitle = 'Tidspunktet for turneringsslutt er passert'
        this.leaveDialog = true
      }
    }
  },
  async created () {
    this.subscribeToActiveGames()
  }
}
</script>

<style scoped>
  /deep/ .tournament-table td {
    font-size: 2em;
    font-weight: bold;
  }
  /deep/ .tournament-table {
    margin: 2em auto;
  }
  .content-wrapper {
    text-align: center;
    padding: 0 0 2% 0;
  }
  h1{
    display: inline-block;
    padding: 15px;
    font-size: 3.5em;
    background-color: #1976d2;
    border-radius: 10px;
    color: white;
  }
  .numberOfPlayers {
    font-size: 1.8em;
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

  td{
    font-size: 3em !important;
    font-weight: bold;
  }

  div.col {
    height: 100%;
    padding: 0;
  }
  @media (max-width: 1480px) {
    /deep/ .tournament-table td, th{
      font-size: 1.5em;
    }
  }
  @media (max-width: 1180px){
    /deep/.row{
      display: block !important;
    }
    /deep/ .tournament-table{
      width: 150% !important;
      margin-left: 5% !important;
    }
  }
  @media (max-width: 780px) {
    /deep/ .tournament-table td, th{
      font-size: 1em;
    }
  }
  @media (max-width: 600px) {
    /deep/ .tournament-table{
      width: 90% !important;
      margin-left: 5% !important;
    }
  }
</style>
