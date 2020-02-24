<template>
  <v-container class="content-wrapper" fluid>
    <v-row>
      <v-col cols="2">
        <div class="info-wrapper">
          <tournament-info
            :tournament="this.devTournament"
            :started="true"
          />
          <p class="numberOfPlayers">
            Antall spillere: {{ this.getPlayerCount }}
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
      <v-simple-table>
        <template v-slot:default>
          <tbody>
          <tr v-for="player in playerList" :key="player.name">
            <td>{{ player.name }}</td>
            <td> {{ player.points }}</td>
          </tr>
          </tbody>
          <!-- TODO: Lage knappa til en egen komponent? Mange begynn kanskje å bli veldi like -->
          <!-- TODO: FUCKA STYLINGA ANDRE PLASSA ME Å STYLE BUTTON -->
          <v-btn class="tableBtn mr-4"
            @click="increaseLimit()"
            :disabled="limit >= playingPlayers.length">Vis flere</v-btn>
          <v-btn class="tableBtn mr-4"
            @click="decreaseLimit()"
            :disabled="limit <= 5">Vis mindre</v-btn>
        </template>
      </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Tournament',
  components: {
    TournamentInfo
  },
  data () {
    return {
      intervalId: '',
      limit: 5
    }
  },
  computed: {
    // TODO: Use mapGetters instead?
    ...mapState([
      'devTournament',
      'playingPlayers'
    ]),
    ...mapGetters([
      'getPlayerCount'
    ]),
    // https://stackoverflow.com/questions/46622209/how-to-limit-iteration-of-elements-in-v-for/54836170#54836170
    playerList () {
      return this.limit ? this.playingPlayers.slice(0, this.limit) : this.playingPlayers
    }
  },
  methods: {
    ...mapActions([
      'fetchPlayers',
      'fetchTournament'
    ]),
    loadPlayers(reference) {
      this.intervalId = setInterval(async function() {
        await reference.fetchPlayers('/tournament/player-lobby-information').then(res => {
        }).catch(err => {
          throw err
        })
      }, 3000)
    },
    increaseLimit () {
      if (this.limit < this.playingPlayers.length) {
        this.limit = this.limit + 5
      }
    },
    decreaseLimit() {
      if (this.limit > 5) {
        this.limit = this.limit - 5
      }
    }
  },
  mounted() {
    // this.loadPlayers(this)
  },
  created () {
    // if (this.tournament.tournament_name === undefined) {
    // this.fetchTournament()
    // }
  },
  destroyed () {
    // clearInterval(this.intervalId)
  }
}
</script>

<style>
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
