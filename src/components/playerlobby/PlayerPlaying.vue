<template>
  <!-- This page is only loaded when tournament has started -->
  <v-container
    class="justify-center"
    fluid
  >
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
          <v-spacer/>
          <v-toolbar-title>Turneringen har startet!</v-toolbar-title>
          <v-spacer/>
        </v-toolbar>
        <v-card-text align="center">
          <v-spacer/>
          <!-- Remember to check mixin for some values -->
          <!-- Tournament name -->
          <h1 class="bigInfo">{{ tournamentName }}</h1>

          <!-- Basic user details -->
          <h3 class="minorInfo">{{ playerName }}</h3>
          <h3 class="mediumInfo">Poeng: {{ points }}</h3>

          <v-divider/>

          <!-- Do player have an opponent? -->
          <div v-if="paired">
            <player-paired/>
          </div>

          <!-- Player do not have opponent -->
          <div v-else-if="!pause">
            <player-not-paired/>
          </div>

          <!-- If user is on a break  -->
          <div v-if="pause && !paired">
            <p class="pauseDetails">Du har nå pause.</p>
          </div>

          <v-divider/>

          <!-- Buttons -->
          <v-container>
            <!-- Register result -->
            <oval-button
            :primary="true"
            v-if="paired"
            text="Registrer resultat"
            @buttonClicked="resultDialog = true"
            data-cy="register-result"
            />

            <!-- Leave tournament -->
            <oval-button
              text="Forlat turnering"
              @buttonClicked="leaveTournament"
              data-cy="leave-tournament"
            />

            <!-- break -->
            <oval-button
              :text="pauseButtonText"
              :primary="pause"
              v-if="!paired"
              @buttonClicked="alterBreakState"
            />

            <!-- Chess clock -->
            <oval-button
              text="Sjakkur"
              @buttonClicked="showChessClock"
            />

            <!-- Past results -->
            <oval-button
              :primary="pastResults"
              :text="pastResultsText"
              @buttonClicked="alterPastResultsState"
              data-cy="past-results"
            />

          </v-container>

          <div v-if="pastResults">
            <earlier-results/>
          </div>

          <!-- Dialog for user to input result; https://vuetifyjs.com/en/components/dialogs -->
          <!-- TODO change to ChangeResultDialog -->
          <v-row
            class="justify-center"
            align="center"
          >
            <v-dialog
              v-model="resultDialog"
              persistent
              max-width="650px"
            >
              <v-card>
                <v-alert
                  type="error"
                  v-if="alertError"
                >
                  {{ alertErrorMessage }}
                </v-alert>
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
                          data-cy="white-win"
                        >
                          <v-spacer/>
                        </v-radio>
                      </v-col>
                      <v-col cols="4">
                        <v-radio
                          class="radio"
                          label="Remis"
                          value="0.5"
                          data-cy="stalemate"
                        >
                          <v-spacer/>
                        </v-radio>
                      </v-col>
                      <v-col cols="4">
                        <v-radio
                          class="radio"
                          label="Sort seier"
                          value="0"
                          data-cy="black-win"
                        >
                          <v-spacer/>
                        </v-radio>
                      </v-col>
                    </v-radio-group>
                  </v-row>
                  <div class="imgInput">
                  <img
                    :src="img"
                    v-if="showImg"
                  >
                  <v-file-input
                    v-model="file"
                    label="Last opp bilde"
                    filled
                    :prepend-icon="showImg ? '' : 'mdi-camera'"
                    accept="image/*"
                    messages="Her kan du laste opp et bilde som kan være til hjelp dersom turneringsvert må avgjøre spillets resultat"
                  />
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    text
                    @click="closeResultDialog"
                    data-cy="cancel-result"
                  >
                    Avbryt
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    outlined
                    @click="registerResult"
                    data-cy="send-result"
                  >
                    Send inn
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <!-- Dialog shown when a suggestion of the active game's result is received -->
          <!-- TODO change to warning dialog -->
          <v-row
            class="justify-center"
            align="center"
          >
            <v-dialog
              v-model="showSuggestedResultDialog"
              persistent
              max-width="650px"
            >
              <v-card>
                <v-card-title class="justify-center"> Din motstander hevder at {{ getResultText }}</v-card-title>
                <v-card-text class="text-center">Vil du godkjenne dette resultatforslaget?</v-card-text>
                <v-layout justify-center>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn
                      textv
                      color="success"
                      @click="approveResult()"
                    >
                      Godkjenn
                    </v-btn>
                    <v-btn
                      textv
                      color="red"
                      @click="disapproveResult()"
                    >
                      Ikke godkjenn
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-card>
            </v-dialog>
          </v-row>

          <!-- Dialog if opponents can't agree on the result -->
          <information-dialog
            :show-dialog="opponentsDisagree"
            title="Dere ble ikke enige om resultatet"
            text="Ta kontakt med turneringsvert eller prøv på nytt!"
            @closeDialog="setOpponentsDisagree(false)"
          />

          <!-- Dialog shown when result suggestion is sent -->
          <information-dialog
            :show-dialog="suggestionIsSent"
            title="Resultatforslag er sendt!"
            text="Venter på at motstander skal godkjenne resultatet"
            @closeDialog="suggestionIsSent = false"
          />

          <!-- playtime -->
          <p
            v-if="tournamentEnd"
           class="gameDetail body-2"
          >
            Spilletid: {{ tournamentStart }} -> {{ tournamentEnd }}
          </p>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PlayerPaired from './PlayerPaired'
import PlayerNotPaired from './PlayerNotPaired'
import EarlierResults from './EarlierResults'
import { mapActions, mapState, mapMutations } from 'vuex'
import { playerMixin } from '../../mixins/player.mixin'
import InformationDialog from '../Dialogs/InformationDialog'
import OvalButton from '../Buttons/OvalButton'

export default {
  name: 'PlayerPlaying',
  components: {
    InformationDialog,
    PlayerPaired,
    PlayerNotPaired,
    EarlierResults,
    OvalButton
  },
  mixins: [
    playerMixin
  ],
  data() {
    return {
      resultDialog: false,
      pastResults: false,
      pause: false,
      pauseButtonText: 'Ta pause',
      pastResultsText: 'Tidligere parti',
      result: '',
      suggestionIsSent: false,
      pathVar: 'player-lobby',
      selectedFile: null,
      data: null,
      rules: [
        value => !value || value.size < 10000000 || 'Bildet må være mindre enn 10 MB!'
      ],
      file: undefined,
      alertError: false,
      alertErrorMessage: '',
      img: '',
      showImg: false
    }
  },
  computed: {
    ...mapState({
      paired: state => state.players.paired,
      opponentId: state => state.games.activeGame.opponent_id,
      opponentsDisagree: state => state.games.resultDialog.opponents_disagree,
      suggestedResult: state => state.games.resultDialog.suggested_result,
      gameId: state => state.games.resultDialog.game_id,
      validResult: state => state.games.resultDialog.valid
    }),

    /**
     * Return the result text depending on the suggested result.
     */
    getResultText: function () {
      if (this.suggestedResult === 1.0) {
        return 'hvit vant'
      } else if (this.suggestedResult === 0.5) {
        return 'partiet endte i remis'
      } else {
        return 'sort vant'
      }
    },

    showSuggestedResultDialog: function() {
      return this.suggestedResult !== undefined
    }
  },
  methods: {
    ...mapActions([
      'sendGameResult',
      'sendPauseRequest',
      'sendUnpauseRequest',
      'sendValidationOfResult',
      'sendInvalidationOfResult',
      'uploadFile'
    ]),
    ...mapMutations([
      'setPaired',
      'setSuggestedResult',
      'setOpponentsDisagree'
    ]),

    leaveTournament() {
      this.$emit('leaveTournament')
    },

    /**
     * Register the result of the currently active game
     */
    async registerResult() {
      try {
        await this.uploadFile(this.file)
        let payload = this.getResultPayload()
        await this.sendGameResult(payload)
        this.showSuggestionIsSentDialog()
        this.closeResultDialog()
      } catch (err) {
        this.alertErrorMessage = err.message
        this.alertError = true
      }
    },
    /**
     * Show suggestion is sent dialog
     */
    showSuggestionIsSentDialog() {
      this.suggestionIsSent = true
    },
    /**
     * Returns the information needed when a result is sent to the server
     * @returns the information needed when a result is sent to the server
     */
    getResultPayload() {
      return {
        opponent: this.opponentId,
        result: this.result
      }
    },
    /**
     * Closes the result dialog
     */
    closeResultDialog() {
      this.alertErrorMessage = ''
      this.alertError = false
      this.resultDialog = false
      this.file = undefined
    },
    /**
     * Approve the result of the currently active game
     */
    approveResult() {
      this.sendValidationOfResult(this.gameId).then(res => {
        this.setSuggestedResult(undefined)
        this.setPaired(false)
      })
    },

    /**
     * Disapprove the result of the currently active game.
     */
    disapproveResult() {
      this.sendInvalidationOfResult(this.gameId).then(res => {
        this.setSuggestedResult(undefined)
      })
    },

    /**
     * Alter the break state. The player is either taking a break or not.
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

    /**
     * Alter the past result state. The past results is either shown or not.
     */
    alterPastResultsState() {
      this.pastResults = !this.pastResults
      if (this.pastResults) {
        this.pastResultsText = 'Fjern resultatliste'
      } else {
        this.pastResultsText = 'Tidligere parti'
      }
    },

    /**
     * Open the chess clock in a new tab
     */
    showChessClock() {
      let route = this.$router.resolve('/chess-clock')
      window.open(route.href, '_blank')
    }
  },
  watch: {
    validResult () {
      if (this.validResult) {
        this.setPaired(false)
      }
    },
    file () {
      let fileReader = new FileReader()
      if (this.file !== undefined) {
        fileReader.onload = fileData => {
          this.img = fileData.target.result
          this.showImg = true
        }
        fileReader.readAsDataURL(this.file)
      } else {
        this.img = ''
        this.showImg = false
      }
    }
  }
}
</script>

<style scoped>
  .pauseDetails {
    margin-top: 1em;
    margin-bottom: 1em;
    font-size: 22px;
  }

  .radio {
    margin-bottom: 1em;
  }

  .card {
    display: inline;
    width: auto;
    min-width: 20em;
    max-width: 70em;
    height: auto;
  }

  .bigInfo {
    text-align-all: center;
  }

  .mediumInfo {
    margin-top: 0.4em;
    margin-bottom: 0.25em;
    font-weight: bold;
    font-size: 21px;
  }

  .minorInfo {
    margin-top: 0.8em;
  }
  .imgInput{
    display: flex;
    height: 100px;
  }
  img{
    height: 150px;
    width: 150px;
    margin-right: 10px;
  }
  @media (max-width: 440px) {
    .imgInput{
      flex-direction: column;
      height: auto
    }
    img{
      margin: auto auto 10px auto
    }
  }
</style>
