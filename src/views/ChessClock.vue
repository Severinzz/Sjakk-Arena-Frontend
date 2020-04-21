<template>

  <!-- Player with black chessmen's button -->
  <div id="chess-clock">
    <chess-clock-button
      player="black"
      :rotate=true
      :initial-time-pr-player="initialTimePrPlayer"
      :additional-time-pr-move="additionalTimePrMove"
      :count-down.sync="blackCountDown"
      :reset.sync="blackReset"
      @times-up="handleTimesUpEvent('black')"
    />

    <!-- Config button -->
    <v-row justify="center">
      <v-card
        height="10%"
        width="50vw"
        color="deep-orange darken-3"
        class="mx-3 my-2"
        @click="configurationDialog = true"
      >
        <v-card-text class="fas fa-sliders-h text-center white--text">
          Konfigurer klokke
        </v-card-text>
      </v-card>
    </v-row>

    <!-- Player with white chessmen's button -->
    <chess-clock-button
      player="white"
      :initial-time-pr-player="initialTimePrPlayer"
      :additional-time-pr-move="additionalTimePrMove"
      :count-down.sync="whiteCountDown"
      :reset.sync="whiteReset"
      @times-up="handleTimesUpEvent('white')"
    />

    <!-- Configuration dialog -->
    <v-row class="justify-center" align="center">
      <v-dialog v-model="configurationDialog">
        <v-card>
          <v-card-title class="justify-center">Konfigurer klokke</v-card-title>
          <div class="mx-2">
            <v-form
            ref="form"
            lazy-validation
            >
              <v-text-field
                v-model="configMinutes"
                label="Antall minutter spillere starter med"
                type="number"
                :rules="[nonNegativeNumberRule]"
                />
              <v-text-field
                v-model="configSeconds"
                label="Antall sekunder spillere starter med (0-59)"
                type="number"
                :rules="[nonNegativeNumberRule, lessThenAMinuteRule]"
              />
              <v-text-field
                v-model="configAdditionalTimePrMove"
                label="Ekstratid pr. trekk (sekunder)"
                type="number"
                :rules="[nonNegativeNumberRule]"
              />
            <v-btn
              text
              @click="configurationDialog = false"
            >Avbryt</v-btn>
            <v-btn
              text
              @click="updateClock"
            >Oppdater</v-btn>
            </v-form>
          </div>
        </v-card>
      </v-dialog>
    </v-row>

    <information-dialog
      :show-dialog="showTimesUpDialog"
      :title="timesUpTitle"
      text="Lukk denne dialogboksen for å resette klokken"
      @closeDialog="closeTimesUpDialog"
    />
  </div>
</template>

<script>
import ChessClockButton from '../components/ChessClockButton'
import InformationDialog from '../components/InformationDialog'

export default {
  name: 'ChessClock',
  components: { ChessClockButton, InformationDialog },
  computed: {
    timesUpTitle: function () {
      return this.playerWhoRunOutOfTime + ' gikk tom for tid'
    }
  },
  data() {
    return {
      initialTimePrPlayer: 900, // in seconds
      additionalTimePrMove: 10, // in seconds
      blackCountDown: false,
      whiteCountDown: true,
      configurationDialog: false,
      configMinutes: undefined,
      configSeconds: undefined,
      configAdditionalTimePrMove: undefined,
      whiteReset: false,
      blackReset: false,
      showTimesUpDialog: false,
      playerWhoRunOutOfTime: '',
      nonNegativeNumberRule: v => v >= 0 || 'Kan ikke være mindre enn 0',
      lessThenAMinuteRule: v => v < 60 || 'Kan maksimalt være 59'
    }
  },
  methods: {
    updateClock: function () {
      if (this.$refs.form.validate()) {
        this.initialTimePrPlayer = parseInt(this.configMinutes) * 60 + parseInt(this.configSeconds)
        this.additionalTimePrMove = parseInt(this.configAdditionalTimePrMove)
        this.configurationDialog = false
        this.resetClock()
      }
    },
    resetClock: function () {
      this.whiteCountDown = true
      this.blackCountDown = false
      this.whiteReset = true
      this.blackReset = true
    },
    handleTimesUpEvent: function (player) {
      if (player === 'white') {
        this.playerWhoRunOutOfTime = 'Hvit'
      } else {
        this.playerWhoRunOutOfTime = 'Sort'
      }
      this.showTimesUpDialog = true
    },
    closeTimesUpDialog: function () {
      this.resetClock()
      this.showTimesUpDialog = false
      this.playerWhoRunOutOfTime = ''
    }
  },
  watch: {
    whiteCountDown: function(whiteCountDown) {
      if (!whiteCountDown) {
        this.blackCountDown = true
      }
    },
    blackCountDown: function(blackCountDown) {
      if (!blackCountDown) {
        this.whiteCountDown = true
      }
    }
  }
}
</script>

<style scoped>
  #chess-clock {
    height:80vh;
  }
</style>
