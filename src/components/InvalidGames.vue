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
      timeInterval: 5000,
      disapprovedGames: []
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
