<template>
<v-card height="auto">
  <v-layout column fill-height>
    <v-toolbar dense class="primary">
      <v-toolbar-title>Spill med ugyldige resultater</v-toolbar-title>
    </v-toolbar>
    <v-container fluid fill-height>
      <v-layout>
        <table justify-center>
          <tr></tr>
          <th>Parti ID, Bord, Spillere, Poeng til hvit spiller</th>
          <tr></tr>
          <tr v-for="(Game, index) in gameList" v-bind:key="index">
            <th class="body-1"><strong>Parti ID: </strong>{{Game.game_id}}, <strong>Bord: </strong>{{Game.table}}</th>
            <td class="body-1"><strong>Spillere:</strong> {{Game.white_player_name}} og {{Game.black_player_name}}</td>
            <td class="body-1">, <strong>Hvit</strong> spiller poeng: {{Game.white_player_points}}</td>
          </tr>
        </table>
      </v-layout>
    </v-container>
  </v-layout>
</v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'InvalidGames',
  data () {
    return {
      limit: 10,
      timeInderval: 5000,
      disapprovedGames: [
        {
          game_id: 1,
          white_player_name: 'Magnus',
          black_player_name: 'Albus Dumbledore',
          table: 4,
          white_player_points: 1
        },
        {
          game_id: 3,
          white_player_name: 'Cevita',
          black_player_name: 'Coop',
          table: 2,
          white_player_points: 0.5
        },
        {
          game_id: 5,
          white_player_name: 'Kåre',
          black_player_name: 'Hikaru',
          table: 1,
          white_player_points: 0
        },
        {
          game_id: 4,
          white_player_name: 'Svein',
          black_player_name: 'Magnus',
          table: 5,
          white_player_points: 1
        },
        {
          game_id: 10,
          white_player_name: 'Hikaru',
          black_player_name: 'Capablanca',
          table: 4,
          white_player_points: 0.5
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'fetchInvalidGames'
    ]),
    loadInvalidGames () { // TODO: gjør om fram pulling til websocket updates
      const VM = this
      this.intervalID = setInterval(async function () {
        await VM.fetchInvalidGames().then(res => {
          VM.disapprovedGames = res.data
          console.log(VM.disapprovedGames)
        }).catch(err => {
          throw err.response
        })
      }, this.timeInterval)
    }
  },
  computed: {
    gameList () {
      return this.limit ? this.disapprovedGames.slice(0, this.limit) : this.disapprovedGames
    }
  },
  created() {
    this.loadInvalidGames()
  },
  destroyed() {
    clearInterval(this.intercal)
  }
}
</script>

<style scoped>

</style>
