<template>
  <!-- This page is only loaded when tournament has started -->
  <v-container class="justify-center" fluid>
    <v-row
      class="justify-center"
      align="center"
    >
      <v-card class="elevation-12, card">
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <v-spacer />
          <v-toolbar-title>Turneringen har startet!</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text align="center">
          <v-spacer />

          <!-- Tournament name -->
          <h1 class="bigInfo">{{ tournamentName }}</h1>

          <!-- Basic user details -->
          <h3 class="minorInfo">{{ playerName }}</h3>
          <h3 class="mediumInfo">Poeng: {{ points }}</h3>

          <v-divider></v-divider>

          <!-- Do player have an opponent? -->
          <div v-if="paired">
            <PlayerPaired></PlayerPaired>
          </div>

          <!-- Player do not have opponent -->
          <div v-else-if="!pause">
            <PlayerNotPaired></PlayerNotPaired>
          </div>

          <!-- If user is on a break  -->
          <div v-if="pause && !paired">
            <p class="pauseDetails">Du har nå pause.</p>
          </div>

          <v-divider></v-divider>

          <!-- Buttons -->
          <!-- Register result -->
          <v-container>
            <v-btn
              class="btn"
              color="primary"
              v-if="paired"
              block
              rounded
              depressed
              @click="resultDialog = true"
            >
              Registrer resultat
            </v-btn>
            <!-- Leave tournament -->
            <v-btn
              class="btn"
              block
              rounded
              depressed
              @click="leaveDialog = true"
            >
              Forlat turnering
            </v-btn>
            <!-- break -->
            <v-btn
              class="btn"
              :color="pause ? 'primary' : ''"
              block
              v-if="!paired"
              rounded
              depressed
              @click="alterBreakState"
            >
              {{ pauseButtonText }}
            </v-btn>
            <!-- Past results -->
            <v-btn
              class="btn"
              :color="pastResults ? 'primary' : ''"
              block
              rounded
              depressed
              @click="alterPastResultsState"
            >
              {{ pastResultsText }}
            </v-btn>
          </v-container>

          <div v-if="pastResults">
            <EarlierResults></EarlierResults>
            <v-btn
              class="btn"
              :color="pastResults ? 'primary' : ''"
              block
              rounded
              depressed
              @click="alterPastResultsState"
            >
              {{ pastResultsText }}
            </v-btn>
          </div>

          <!-- Dialog for user to input result; https://vuetifyjs.com/en/components/dialogs -->
          <v-row class="justify-center" align="center">
          <v-dialog v-model="resultDialog" persistent max-width="650px">
            <v-card>
              <v-card-title class="justify-center">Resultatet ble:</v-card-title>
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

          <!-- Dialog showed when a suggestion of the active game's result is received -->
          <v-row class="justify-center" align="center">
            <v-dialog v-model="suggested" persistent max-width="650px">
              <v-card>
              <v-card-title class="justify-center"> Din motstander hevder at {{ getResultText }}</v-card-title>
              <v-card-text class="text-center">Vil du godkjenne dette resultatforslaget?</v-card-text>
              <v-layout justify-center>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    textv
                    color="success"
                    @click="validateResult()"
                  >Godkjenn
                  </v-btn>
                  <v-btn
                    textv
                    color="red"
                    @click="validateResult()">Ikke godkjenn</v-btn>
                </v-card-actions>
              </v-layout>
              </v-card>
            </v-dialog>
          </v-row>

          <!-- Dialog for user if 'FORLAT TURNERING' is pressed -->
          <v-row class="justify-center" align="center">
            <v-dialog v-model="leaveDialog" persistent max-width="650px">
              <v-card>
                <v-card-title class="justify-center">Forlat turnering</v-card-title>
                <v-card-text>
                  <v-row class="justify-center">
                    <h2>Er du sikker på at du vil forlate tuneringen?</h2>
                    <p>Denne handlingen kan <strong>ikke</strong> reverseres.</p>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <!-- User has the option to either leave or go back -->
                  <v-btn text @click="leaveTournament()">Forlat turneringen</v-btn>
                  <v-btn text color="primary" outlined @click="leaveDialog = false">Avbryt</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <!-- playtime -->
          <p class="gameDetail body-2">Spilletid: {{ tournamentStart }} -> {{ tournamentEnd }} </p>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PlayerPaired from './PlayerPaired'
import PlayerNotPaired from './PlayerNotPaired'
import EarlierResults from './EarlierResults'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

export default {
  name: 'PlayerPlaying',
  props: {
    tournamentName: String,
    tournamentStart: String,
    tournamentEnd: String,
    playerName: String,
    points: Number
  },
  components: {
    PlayerPaired,
    PlayerNotPaired,
    EarlierResults
  },
  computed: {
    ...mapState({
      paired: state => state.paired,
      opponentId: state => state.activeGame.opponent_id,
      suggested: state => state.resultDialog.suggested,
      valid: state => state.resultDialog.valid,
      suggestedResult: state => state.resultDialog.suggested_result,
      gameId: state => state.resultDialog.game_id
    }),
    getResultText: function() {
      if (this.suggestedResult === 1.0) {
        return 'hvit vant'
      } else if (this.suggestedResult === 0.5) {
        return 'partiet i remis'
      } else {
        return 'sort vant'
      }
    }
  },
  data() {
    return {
      resultDialog: false,
      leaveDialog: false,
      pastResults: false,
      pause: false,
      pauseButtonText: 'Ta pause',
      pastResultsText: 'Tidligere parti',
      result: ''
    }
  },
  methods: {
    ...mapActions([
      'sendLeaveRequest',
      'sendDeleteRequest',
      'sendGameResult',
      'sendPauseRequest',
      'sendUnpauseRequest',
      'fetchPlayersTournament',
      'sendValidationOfResult'
    ]),
    ...mapGetters([
      'getTournament'
    ]),
    ...mapMutations([
      'setPaired',
      'setSuggested'
    ]),
    /*
      Register the result of the currently active game
    */
    registerResult () {
      let payload = {
        opponent: this.opponentId,
        result: this.result
      }
      this.sendGameResult(payload).then(res => {
        this.setPaired(false)
        this.resultDialog = false
      })
    },
    /*
      Validate the result of the currently active game
    */
    validateResult () {
      this.sendValidationOfResult(this.gameId).then(
        this.setSuggested(false)
      )
    },
    /*
      The player leaves the tournament
    */
    async leaveTournament () {
      await this.fetchPlayersTournament() // TODO: Bytt når websocket e inne
      let started = this.getTournament().started // TODO: Bytt når websocket e inne
      this.sendLeaveRequest(started).then(res => {
        this.$router.push('/')
      })
    },
    /*
      Alter the break state. The player is either taking a break or not.
    */
    alterBreakState() {
      this.pause = !this.pause
      if (this.pause) {
        this.sendPauseRequest()
        this.pauseButtonText = 'Fortsett spill'
      } else {
        this.sendUnpauseRequest()
        this.pauseButtonText = 'Ta pause'
      }
    },
    /*
      Alter the past result state. The past results is either shown or not.
     */
    alterPastResultsState() {
      this.pastResults = !this.pastResults
      if (this.pastResults) {
        this.pastResultsText = 'Fjern resultatliste'
      } else {
        this.pastResultsText = 'Tidligere parti'
      }
    }
  },
  watch: {

  }
}
</script>

<style scoped>
  .pauseDetails{
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 22px;
  }

  .radio{
    margin-bottom: 1em;
  }

  .btn{
    margin-top: 0.5em;
  }

  .card{
    display: inline;
    width: auto;
    min-width: 20em;
    max-width: 70em;
    height: auto;
  }

  .bigInfo{
    text-align-all: center;
  }

  .mediumInfo{
    margin-top: 0.4em;
    margin-bottom: 0.25em;
    font-weight: bold;
    font-size: 21px;
  }

  .minorInfo{
    margin-top: 0.8em;
  }
</style>
