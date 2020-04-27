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
            />

            <!-- Leave tournament -->
            <oval-button
              text="Forlat turnering"
              @buttonClicked="leaveDialog = true"
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
            />

          </v-container>

          <div v-if="pastResults">
            <earlier-results/>
            <oval-button
              :primary="pastResults"
              :text="pastResultsText"
              @buttonClicked="alterPastResultsState"
            />
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
                          <v-spacer/>
                        </v-radio>
                      </v-col>
                      <v-col cols="4">
                        <v-radio
                          class="radio"
                          label="Remis"
                          value="0.5"
                        >
                          <v-spacer/>
                        </v-radio>
                      </v-col>
                      <v-col cols="4">
                        <v-radio
                          class="radio"
                          label="Sort seier"
                          value="0"
                        >
                          <v-spacer/>
                        </v-radio>
                      </v-col>
                    </v-radio-group>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    text
                    @click="resultDialog=false"
                  >
                    Avbryt
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    outlined
                    @click="registerResult"
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

          <!-- Dialog shown when player tries to leave the tournament -->
          <warning-dialog
          title="Forlat turneringen"
          action="forlate tuneringen"
          :show-dialog="leaveDialog"
          carry-on-button-text="Forlat turnering"
          @carryOn="leaveTournament()"
          @closeDialog="leaveDialog = false"
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
import WarningDialog from '../WarningDialog'
import { leavePageWarningMixin } from '../../mixins/leavePageWarning.mixin'
import { playerMixin } from '../../mixins/player.mixin'
import InformationDialog from '../InformationDialog'
import OvalButton from '../OvalButton'

export default {
  name: 'PlayerPlaying',
  components: {
    InformationDialog,
    WarningDialog,
    PlayerPaired,
    PlayerNotPaired,
    EarlierResults,
    OvalButton
  },
  mixins: [
    leavePageWarningMixin,
    playerMixin
  ],
  data() {
    return {
      resultDialog: false,
      leaveDialog: false,
      pastResults: false,
      pause: false,
      pauseButtonText: 'Ta pause',
      pastResultsText: 'Tidligere parti',
      result: '',
      suggestionIsSent: false,
      pathVar: 'player-lobby'
    }
  },
  computed: {
    ...mapState({
      paired: state => state.players.paired,
      opponentId: state => state.games.activeGame.opponent_id,
      opponentsDisagree: state => state.games.resultDialog.opponents_disagree,
      suggestedResult: state => state.games.resultDialog.suggested_result,
      gameId: state => state.games.resultDialog.game_id,
      validResult: state => state.games.resultDialog.valid,
      active: state => state.tournament.activeTournament
    }),
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
      'sendLeaveRequest',
      'sendGameResult',
      'sendPauseRequest',
      'sendUnpauseRequest',
      'sendValidationOfResult',
      'sendInvalidationOfResult'
    ]),
    ...mapMutations([
      'setPaired',
      'setSuggestedResult',
      'setOpponentsDisagree'
    ]),
    /*
        Register the result of the currently active game
      */
    registerResult() {
      let payload = {
        opponent: this.opponentId,
        result: this.result
      }
      this.sendGameResult(payload).then(res => {
        this.resultDialog = false
        this.suggestionIsSent = true
      })
    },
    /*
        Approve the result of the currently active game
      */
    approveResult() {
      this.sendValidationOfResult(this.gameId).then(res => {
        this.setSuggestedResult(undefined)
        this.setPaired(false)
      })
    },
    disapproveResult() {
      this.sendInvalidationOfResult(this.gameId).then(res => {
        this.setSuggestedResult(undefined)
      })
    },
    /*
        The player leaves the tournament
      */
    async leaveTournament() {
      this.sendLeaveRequest(this.active).then(res => {
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
    },
    alterLeavePageDialogState() {
      this.leaveDialog = !this.leaveDialog
    },
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
    }
  },
  mounted() {
    this.setupBrowserWarning()
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

  .btn {
    margin-top: 0.5em;
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
</style>
