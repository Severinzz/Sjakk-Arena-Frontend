<template>
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
          <tbody v-for="(Game, index) in gameList" v-bind:key="index" v-on:click="registerResult(Game)">
            <th class="body-1"><strong>Parti ID: </strong>{{Game.game_id}}, <strong>Bord: </strong>{{Game.table}}</th>
            <td class="body-1"><strong>Spillere:</strong> {{Game.white_player_name}} og {{Game.black_player_name}}</td>
            <td class="body-1">, <strong>Hvit</strong> spiller poeng: {{Game.white_player_points}}</td>
            <v-btn small color="primary" rounded x-small @click="editGame(Game.game_id)">Endre resultat</v-btn>
          </tbody>
        </table>
      </v-layout>
    </v-container>
  </v-layout>

  <!-- Use dialog box to let host change result for a game -->
  <div v-if="resultDialog">
    <v-row class="justify-center" align="center">
      <v-dialog v-model="resultDialog" persistent max-width="650px">
        <v-card>
          <v-card-title class="justify-center">Bestemmer resultat for parti ID:  {{this.gameID}}</v-card-title>
          <v-card-text>
            <v-row class="justify-center">
              <!-- Radio buttons used to register result; https://vuetifyjs.com/en/components/dialogs -->
              <v-radio-group
                v-model="result"
                :mandatory="true"
                inline-block
              >
                <v-col cols="4">
                  <v-radio
                    class="radio"
                    label="Hvit seier"
                    value="1"
                  >
                    <v-spacer />
                  </v-radio>
                </v-col>
                <v-col cols="4">
                  <v-radio
                    class="radio"
                    label="Remis"
                    value="0.5"
                  >
                    <v-spacer />
                  </v-radio>
                </v-col>
                <v-col cols="4">
                  <v-radio
                    class="radio"
                    label="Sort seier"
                    value="0"
                  >
                    <v-spacer />
                  </v-radio>
                </v-col>
              </v-radio-group>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="resultDialog=false"
            >Avbryt
            </v-btn>
            <v-btn
              text
              color="primary"
              outlined
              @click="registerResult">Send inn</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
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
      disapprovedGames: [],
      resultDialog: false,
      result: '',
      gameID: ''
    }
  },
  methods: {
    ...mapActions([
      'fetchInvalidGames',
      'hostSendGameResult'
    ]),
    registerResult () {
      this.hostSendGameResult(this.gameID, this.result).then(res => {
        this.resultDialog = false
      })
    },
    loadInvalidGames () { // TODO: gjør om fram pulling til websocket updates
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
      this.resultDialog = true
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
