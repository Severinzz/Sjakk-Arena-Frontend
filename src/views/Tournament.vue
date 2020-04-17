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
             xl="8"
             lg="7"
             md="7"
             sm="7"
             xs="7"
      >
        <Table
          class="leaderBoard"
          v-if="showLeaderBoard"
          :object-list="Array.from(playerList)"
          :heading-list="leaderBoardHeadingList"
          :autoScrollOption="true"
          @entryClicked="handlePlayerClicked"
        />
        <!-- TODO: Add functionality when clicked (same as invalid games component?) -->
        <Table
          class="leaderBoard"
          v-if="!showLeaderBoard"
          :object-list="Array.from(gamesList)"
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
  </span>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import { mapActions, mapGetters } from 'vuex'
import InvalidGames from '@/components/InvalidGames'
import Table from '../components/Table'

export default {
  name: 'Tournament',
  components: {
    Table,
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
      'subscribeToTournamentSubscriptions',
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
    this.subscribeToTournamentSubscriptions({ vm: this, started: started })
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
  @media (max-width: 1480px) {
    /deep/ .leaderBoard td, th{
      font-size: 1.5em;
    }
  }
  @media (max-width: 1180px){
    /deep/.row{
      display: block !important;
    }
    /deep/ .leaderBoard{
      width: 150% !important;
      margin-left: 5% !important;
    }
  }
  @media (max-width: 780px) {
    /deep/ .leaderBoard td, th{
      font-size: 1em;
    }
  }
  @media (max-width: 600px) {
    /deep/ .leaderBoard{
      width: 90% !important;
      margin-left: 5% !important;
    }
  }
</style>
