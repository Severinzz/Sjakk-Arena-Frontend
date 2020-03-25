<template>
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
            <v-btn id="Pause" class="mr-4">
              Pause
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Tournament',
  components: {
    TournamentInfo
  },
  data () {
    return {
      intervalId: '',
      limit: 5,
      activeTournament: '',
      leaderboard: [],
      instance: this
    }
  },
  computed: {
    // TODO: Use mapGetters instead?
    ...mapGetters([
      'getPlayerCount',
      'getTournament',
      'getAllPlayers'
    ]),
    // https://stackoverflow.com/questions/46622209/how-to-limit-iteration-of-elements-in-v-for/54836170#54836170
    playerList () {
      return this.limit ? this.getAllPlayers.slice(0, this.limit) : this.getAllPlayers
    },
    playerCount() {
      return this.getAllPlayers.length
    }
  },
  methods: {
    ...mapActions([
      'fetchPlayers',
      'fetchTournament',
      'unsubscribe',
      'close'
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
    this.fetchPlayers(started)
  },
  destroyed () {
    this.unsubscribe('leaderboard')
    this.close()
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
