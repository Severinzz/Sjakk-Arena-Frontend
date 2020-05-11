<template>
  <span>
<v-card
  height="auto"
  max-width="55em"
>
  <v-layout
    column
    fill-height
  >
    <v-toolbar
      dense
      class="primary"
    >
      <v-toolbar-title>Spill med ugyldige resultater</v-toolbar-title>
    </v-toolbar>
    <v-container
      fluid
      fill-height
    >
      <v-layout>
        <table justify-center>
          <tr></tr>
          <th>Parti ID, Bord, Spillere, Poeng til hvit spiller</th>
          <tr></tr>
          <tbody
            v-for="(Game, index) in gameList"
            v-bind:key="index"
          >
            <th class="body-1"><strong>Parti ID: </strong>{{Game.game_id}}, <strong>Bord: </strong>{{Game.table}}</th>
            <td class="body-1"><strong>Spillere:</strong> {{Game.white_player_name}} og {{Game.black_player_name}}</td>
            <td class="body-1">, <strong>Hvit</strong> spiller poeng: {{Game.white_player_points}}</td>
            <v-btn
              small
              color="primary"
              rounded
              @click="editGame(Game.game_id, index)"
            >
              Endre resultat
            </v-btn>
          <v-btn
            small
            color="primary"
            rounded
            @click="getImages(Game.game_id)"
          >
            Last ned bilde(r)
          </v-btn>
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
      @resultAdded="resultAdded"
    />
  </span>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ChangeResultDialog from './ChangeResultDialog'

export default {
  name: 'InvalidGames',
  components: { ChangeResultDialog },
  data () {
    return {
      limit: 10,
      intervalID: '',
      timeInterval: 5000,
      dialogBox: false,
      result: '',
      gameID: 0,
      index: ''
    }
  },
  methods: {
    ...mapActions([
      'subscribeToInvalidGames',
      'getGameImages'
    ]),
    ...mapMutations([
      'removeInvalidGame'
    ]),
    editGame (gameID, index) {
      this.gameID = gameID
      this.index = index
      this.alterResultDialogState()
    },
    alterResultDialogState () {
      this.dialogBox = !this.dialogBox
    },
    resultAdded () {
      this.removeInvalidGame(this.index)
    },
    getImages (gameID) {
      this.gameID = gameID
      console.log('GameID = ' + gameID)
      const axios = require('axios')
      //      axios.get('/playerFile/Download/' + gameID).then(result => {
      //        console.log('Getting image for game: ' + gameID)
      //      })
      axios.get('/playerFile/Download/' + gameID, { responseType: 'arraybuffer' }).then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', 'Parti#_' + gameID + '.zip') // Name of the file which will be downloaded.
        document.body.appendChild(link)
        link.click()
        link.remove()
      }).catch(error => {
        console.log(error.message)
      })
    }
  },
  computed: {
    gameList () {
      return this.limit ? this.invalidGames.slice(0, this.limit) : this.invalidGames
    },
    ...mapState({
      invalidGames: state => state.games.invalidGames
    })
  },
  created() {
    this.subscribeToInvalidGames()
  },
  destroyed() {
    clearInterval(this.intervalID)
  }
}
</script>

<style scoped>

</style>
