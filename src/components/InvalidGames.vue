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
          <th>Parti ID, Bord, Spillere, Resultat</th>
          <tr></tr>
          <tbody
            v-for="(Game, index) in gameList"
            v-bind:key="index"
          >
          <div class="ma-3">
            <tr class="body-1"><strong>Parti ID: </strong>{{Game.game_id}} <strong>Bord: </strong>{{Game.table}}
             <strong>Spillere: </strong> {{Game.white_player_name}} og {{Game.black_player_name}}
             <strong>Resultat: </strong> {{Game.white_player_points}} - {{ calculateBlackPlayerPoints(Game.white_player_points) }}</tr>
            <v-btn
              small
              color="primary"
              rounded
              class="ma-1"
              @click="editGame(Game.game_id)"
            >
              Endre resultat
            </v-btn>
          <v-btn
            :disabled=!Game.has_image
            small
            color="primary"
            rounded
            @click="downloadImages(Game.game_id)"
          >
            Last ned bilde(r)
          </v-btn>
          </div>
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
    <information-dialog
      :show-dialog="downloadError"
      title="Problem med å laste ned bilde(r)!"
      :text="downloadErrorText"
      @closeDialog="downloadError = false"
      />
  </span>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import ChangeResultDialog from './ChangeResultDialog'
import InformationDialog from './InformationDialog'

export default {
  name: 'InvalidGames',
  components: { ChangeResultDialog, InformationDialog },
  data () {
    return {
      limit: 10,
      intervalID: '',
      timeInterval: 5000,
      dialogBox: false,
      result: '',
      gameID: 0,
      downloadError: false,
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions([
      'subscribeToInvalidGames',
      'getImages'
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
    /**
     * Downloads images that belong to the specified game
     *
     * @param gameId
     * @returns {Promise<void>}
     */
    async downloadImages(gameId) {
      try {
        let data = await this.getImages(gameId)
        // adapted from: https://jetrockets.pro/blog/l8dadq8oac-how-to-download-files-with-axios
        const downloadUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', 'Parti#_' + gameId + '.zip') // Name of the file which will be downloaded.
        document.body.appendChild(link)
        link.click()
        link.remove()
      } catch (error) {
        this.downloadError = true
        this.errorMessage = error.message
      }
    },
    /**
     * Returns the points of the player with black chessmen, given the specified points of the player with white
     * chessmen
     * @param whitePlayerPoints The points of the player with white chessmen
     * @returns {number} the points of the player with black chessmen
     */
    calculateBlackPlayerPoints(whitePlayerPoints) {
      return 1 - whitePlayerPoints
    }
  },
  computed: {
    gameList () {
      return this.limit ? this.invalidGames.slice(0, this.limit) : this.invalidGames
    },
    ...mapState({
      invalidGames: state => state.games.invalidGames
    }),
    downloadErrorText () {
      return 'Kunne ikke laste ned bilder. Feilmelding: ' + this.errorMessage
    }
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
