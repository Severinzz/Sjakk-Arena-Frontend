<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container class="justify-center form">
    <!-- Adapted from: https://stackoverflow.com/questions/48969510/the-form-is-not-center-aligned-vertically-centered-middle -->
    <v-row
      row
      wrap
      align-center
    >
      <v-col>
        <v-alert
        type="error"
        v-if="alertError"
        >
          {{ errorMessage }}
        </v-alert>
    <v-card>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>Turneringsinformasjon</v-toolbar-title>
      </v-toolbar>
      <!-- Name of tournament -->
      <div class="formstyle">
      <v-text-field
        v-model="tournamentName"
        :rules="tournamentNameRules"
        label="Navn på turnering"
        required
      >
      </v-text-field>
      <!-- email address of tournament host -->
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-post"
        required>
      </v-text-field>
      <!-- code from https://vuetifyjs.com/en/components/time-pickers-->
      <v-row>
        <v-col cols="11" sm="5">
          <!-- Start time -->
          <v-menu
            ref="firstmenu"
            v-model="startTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="startTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startTime"
                label="Starttid"
                readonly
                required
                v-on="on"
                :error="missingStartTime"
              >
              </v-text-field>
            </template>
            <v-time-picker
              v-if="startTimeMenu"
              v-model="startTime"
              full-width
              format="24hr"
              @click:minute="$refs.firstmenu.save(startTime)"
              :color="formColor"
              :max="calcStartTime"
              :min="minStartTime"
            >
            </v-time-picker>
          </v-menu>
        </v-col>
        <v-spacer>
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
            v-if="isLoading === true"
          >
          </v-progress-circular>
        </v-spacer>
      </v-row>
      <!-- end of code from vuetifyjs.com -->
      <!-- Number of tables -->
      <v-text-field
        v-model="tables"
        label="Antall bord"
        type="number"
        :min="0"
        :rules="numberFieldRules"
      >
      </v-text-field>
      <!-- Maximum number of rounds -->
      <v-text-field
        v-model="rounds"
        label="Max antall runder"
        type="number"
        :rules="numberFieldRules"
      >
      </v-text-field>
      <v-switch
        label="Start når to spillere er påmeldt"
        v-model="earlyStart">
      </v-switch>
      <v-switch
        label="Bruk sluttid"
        v-model="useEndTime"
      >
      </v-switch>
      <!-- code from https://vuetifyjs.com/en/components/time-pickers-->
      <v-row>
      <v-col
        cols="12"
        sm="5"
      >
      <!-- End time and date-->
        <date-time
          v-if="useEndTime"
          :min-time="startTime"
          :rules="endTimeRules"
          :event-name="'endDateTime'"
          @endDateTime="onEndDateTime"
        />
      </v-col>
      </v-row>
      <!-- end of code from vuetifyjs.com -->
      <v-btn
        id="submit-btn"
        class=""
        color="primary"
        @click="validate"
      >
        Send
      </v-btn>
      <v-btn
        id="clear-btn"
        @click="clear"
      >
        Tøm
      </v-btn>
      <v-btn
        id="cancel-btn"
        @click="cancel"
      >
        Avbryt
      </v-btn>
      </div>
    </v-form>
    </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import DateTime from './DateTime'

export default {
  name: 'TournamentCreationForm',
  components: { DateTime },
  data () {
    return {
      startTime: '', // start time of tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      endTime: '', // end time of tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT) // TODO: burde kunne endre senere
      currentDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      startTimeMenu: false,
      minStartTime: new Date().getHours().toString() + ':' + new Date().getMinutes().toString(),
      email: '', // email address of tournament host
      tournamentName: '', // name of tournament
      tables: '', // number of tables used in the tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      rounds: '', // maximum number of rounds in the tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      earlyStart: false, // true if the tournament will start when two players are registered
      formColor: 'blue', // color to be used in form elements
      isLoading: false,
      useEndTime: false,
      missingStartTime: false,
      alertError: false,
      errorMessage: '',
      // rules
      emailRules: [
        v => /^[A-ZÆØÅa-zæøå0-9._%+-]+@[A-ZÆØÅa-zæøå0-9.-]+\.[A-ZÆØÅa-zæøå]{2,6}$/.test(v) || 'Du må skrive inn en gyldig e-postadresse'
      ],
      tournamentNameRules: [
        v => !!v || 'Turneringsnavn er påkrevd',
        v => (v && v.length <= 40) || 'Turneringsnavn må innholde færre enn 20 karakterer'
      ],
      numberFieldRules: [
        v => /^\d+$/.test(v) || 'Bare tall i dette feltet!', // If not included the number field can contain + and -
        v => v < 256 || 'Må vær mindre enn 256!' // TODO MIGHT NOT WANT IT TO BE THE SAME FOR EACH NUMBER FIELD
      ],
      endTimeRules: [
        v => !v || this.checkTime() ||
          'Sluttid kan ikke vær lik eller mindre start tiden!'
      ],
      startTimeRules: [
        v => !!v || 'Starttid er påkrevd',
        v => (v.length = 0) || 'fisk'
      ]
    }
  },
  methods: {
    ...mapActions([
      'sendTournament'
    ]),
    ...mapMutations([
      'clearPlayers'
    ]),

    /**
     * Clears all input fields and errors from the form.
     */
    clear() {
      this.$refs.form.reset()
    },

    /**
     * Submit the form to the backend.
     * @returns {Promise<void>} Void, returns nothing to stop execution if the start time is missing.
     */
    async submit () {
      if (this.validateTime()) {
        this.missingStartTime = true
        return
      }
      this.alertError = false
      this.isLoading = true
      // Setup the JSON object to be sent to the server
      let payload = {
        'tournament_name': this.tournamentName,
        'admin_email': this.email,
        'start': this.startTime !== '' ? this.currentDate + 'T' + this.startTime : null,
        'end': this.useEndTime && this.endDate !== '' ? this.endDate + 'T' + this.endTime : null,
        'tables': parseInt(this.tables),
        'max_rounds': parseInt(this.rounds),
        'early_start': this.earlyStart
      }
      // Sends the given information in the form to the server.
      await this.sendTournament(payload).then(res => {
        // Grabs the tournament from store so the correct tournament_id is used in the dynamic link.
        this.$router.push('/lobby/' + this.tournament.user_id)
        this.isLoading = false
      }).catch(err => {
        // Hides the loading circle and display error message
        this.alertError = true
        this.errorMessage = err + '. Prøv igjen senere'
        this.isLoading = false
      })
    },

    /**
     * Validate the form.
     */
    validate() {
      if (this.$refs.form.validate()) {
        this.submit()
      }
    },
    /**
     * Checks if start time is missing
     * @returns {boolean} true if start time is missing, false if not.
     */
    validateTime() {
      return this.startTime === ''
    },

    /**
     * Checks if end time is after start time and not before or equal
     * @returns {boolean} True if start time is equal or smaller than end time.
     */
    checkTime() {
      if (this.endTime === undefined || this.endDate !== this.currentDate) { return true }
      let startTimeH = this.startTime.toString().split(':')[0]
      let endTimeH = this.endTime.toString().split(':')[0]
      if (parseInt(startTimeH) < parseInt(endTimeH)) {
        // Error displayed since the start time is smaller than the end time
        return true
      } else {
        // Displays error only if start time is exaclty equal to end time.
        let startTimeM = this.lastNumberInTime(this.startTime)
        let endTimeM = this.lastNumberInTime(this.endTime)
        return parseInt(startTimeM) < parseInt(endTimeM)
      }
    },

    /**
     * Grabs the minutes from the time string.
     * @param timeString Time string on the format HH:MM / HH:MM:SS etc...
     * @returns {number} The minutes of the time string.
     */
    lastNumberInTime(timeString) {
      return parseInt(timeString.toString().split(':')[1])
    },

    /**
     * Clears the form and all its errors and sends user back to homepage.
     */
    cancel() {
      this.clear()
      this.$router.push('/')
    },

    /**
     * Handles the end date and end time changed event.
     * @param value The new end date and end time values.
     */
    onEndDateTime(value) {
      let dateTimeArray = value.split('t')
      if (dateTimeArray.length === 2) {
        this.endDate = dateTimeArray[0]
        this.endTime = dateTimeArray[1]
      } else {
        this.endDate = ''
        this.endTime = ''
      }
    }
  },
  computed: {
    ...mapState({
      tournament: state => state.tournament.tournament
    }),

    /**
     * Calculates the max value of the start time based on the end time.
     * @returns {string|null} String if end time is given, null if not.
     */
    calcStartTime() {
      if (this.currentDate === this.endDate) {
        return this.endTime
      }
      return null
    }
  },
  created() {
    this.clearPlayers()
  }
}

</script>

<style scoped>
  .form{
    margin-bottom: 15px;
  }
  .formstyle{
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
  #cancel-btn, #clear-btn{
    margin-left: 1%;
  }
  #cancel-btn, #submit-btn, #clear-btn{
    margin-bottom: 10px;
  }
</style>
