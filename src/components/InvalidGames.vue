<template>
  <span>
<v-card height="auto" max-width="55em">
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
          <tbody v-for="(Game, index) in gameList" v-bind:key="index">
            <th class="body-1"><strong>Parti ID: </strong>{{Game.game_id}}, <strong>Bord: </strong>{{Game.table}}</th>
            <td class="body-1"><strong>Spillere:</strong> {{Game.white_player_name}} og {{Game.black_player_name}}</td>
            <td class="body-1">, <strong>Hvit</strong> spiller poeng: {{Game.white_player_points}}</td>
            <v-btn small color="primary" rounded @click="editGame(Game.game_id)">Endre resultat</v-btn>
          </tbody>
        </table>
      </v-layout>
    </v-container>
  </v-layout>
</v-card>
    <ChangeResultDialog
      :gameId="gameID"
      :dialogBox="dialogBox"
      @closeResultDialog="alterResultDialogState"
    />
  </span>
</template>

<script>
import { mapActions } from 'vuex'
import ChangeResultDialog from './ChangeResultDialog'

export default {
  name: 'InvalidGames',
  components: { ChangeResultDialog },
  data () {
    return {
      limit: 10,
      intervalID: '',
      timeInterval: 5000,
      disapprovedGames: [],
      dialogBox: false,
      result: '',
      gameID: 0
    }
  },
  methods: {
    ...mapActions([
      'fetchInvalidGames',
      'hostSendGameResult'
    ]),
    loadInvalidGames () { // TODO: gjør om fra pulling til websocket updates
      const VM = this
      this.intervalID = setInterval(async function () {
        await VM.fetchInvalidGames().then(res => {
          VM.disapprovedGames = res.data
        }).catch(err => {
          throw err.response
        })
      }, this.timeInterval)
    },
    editGame (gameID) {
      this.gameID = gameID
      this.alterResultDialogState()
    },
    alterResultDialogState () {
      this.dialogBox = !this.dialogBox
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
    clearInterval(this.intervalID)
  }
}
</script>

<style scoped>

</style>
