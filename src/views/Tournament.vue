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
            <v-btn id="Stop" color="error" class="mr-4">
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
        <Table
          :object-list="Array.from(getAllPlayers)"
          :attribute-list="attributeList"
          :heading-list="headingList"
          @entryClicked="handlePlayerClicked"
          id="leaderBoard"
        />
        <!-- end -->
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
      limit: 5,
      activeTournament: '',
      instance: this,
      invalidGames: true,
      pause: false,
      pauseButtonText: 'Pause',
      attributeList: ['name', 'points'],
      headingList: ['Plassering', 'Spiller', 'Poeng']
    }
  },
  computed: {
    ...mapGetters([
      'getPlayerCount',
      'getTournament',
      'getAllPlayers'
    ]),
    // https://stackoverflow.com/questions/46622209/how-to-limit-iteration-of-elements-in-v-for/54836170#54836170
    playerList () {
      return this.getAllPlayers
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
      'sendTournamentUnpauseRequest'
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
  }
}
</script>

<style scoped>
  /deep/ #leaderBoard td {
    font-size: 2em;
    font-weight: bold;
  }
  /deep/ #leaderBoard {
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
