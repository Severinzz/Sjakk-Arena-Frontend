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
              @click="editGame(Game.game_id)"
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
      gameID: 0
    }
  },
  methods: {
    ...mapActions([
      'subscribeToInvalidGames'
    ]),
    ...mapMutations([
      'removeInvalidGame'
    ]),

    /**
     * Set the gameID in the data values
     * @param gameID Id of the clicked game.
     */
    editGame (gameID) {
      this.gameID = gameID
      this.alterResultDialogState()
    },

    /**
     * Alter viability state of the dialog.
     */
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
      // kjøre axios i vue filene slik som nå er imot våre kodeformer.
      axios.get('/playerFile/Download/' + gameID, { responseType: 'arraybuffer' }).then(({ data }) => {
        // adapted from: https://jetrockets.pro/blog/l8dadq8oac-how-to-download-files-with-axios
        const downloadUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', 'Parti#_' + gameID + '.zip') // Name of the file which will be downloaded.
        document.body.appendChild(link)
        link.click()
        link.remove()
      }).catch(error => {
        if (error.response.status === 404) {
          console.log('This game does not have any images') // TODO: let user know there is nothing to download.
        } else {
          console.log(error)
        }
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
