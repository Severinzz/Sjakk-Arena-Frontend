<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="form">
    <v-form
      ref="form"
      lazy-validation
    >
     <alert-box
     v-if="error"
     :errorMessage="errorMessage"
     :errorIcon="'fas fa-plug'"
     />
      <v-toolbar dark color="primary">
        <v-toolbar-title>Turneringsinformasjon</v-toolbar-title>
      </v-toolbar>
      <!-- Name of tournament -->
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
          ></v-progress-circular>
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
      ></v-text-field>
      <v-switch
        label="Start når to spillere er påmeldt"
        v-model="earlyStart">
      </v-switch><v-switch
        label="Bruk sluttid"
        v-model="useEndTime"></v-switch>
      <!-- code from https://vuetifyjs.com/en/components/time-pickers-->
      <v-row>
      <v-col cols="12" sm="5">
      <!-- End time and date-->
        <date-time
          v-if="useEndTime"
          :min-date="new Date().toISOString().slice(0, 10)"
          :min-time="startTime"
          :rules="endTimeRules"
          :event-name="'endDateTime'"
          @endDateTime="onEndDateTime"></date-time>
      </v-col>
      </v-row>
      <!-- end of code from vuetifyjs.com -->
      <v-btn
        id="submit-btn"
        class="mr-4"
        color="primary"
        @click="validate">
        Send
      </v-btn>
      <v-btn
        id="clear-btn"
        @click="clear">
        Tøm
      </v-btn>
      <v-btn
        id="cancel-btn"
        @click="cancel">
        Avbryt
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AlertBox from './AlertBox'
import DateTime from './DateTime'
export default {
  name: 'TournamentCreationForm',
  components: { AlertBox, DateTime },
  data () {
    return {
      startTime: '', // start time of tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      endTime: '', // end time of tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT) // TODO: burde kunne endre senere
      currentDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      startTimeMenu: false,
      endTimeMenu: false,
      email: 'test@test.test.com', // email address of tournament host
      tournamentName: 'testTournament', // name of tournament
      tables: '14', // number of tables used in the tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      rounds: '14', // maximum number of rounds in the tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      earlyStart: false, // true if the tournament will start when two players are registered
      formColor: 'blue', // color to be used in form elements
      isLoading: false,
      errorMessage: '',
      error: false,
      useEndTime: false,
      // rules
      emailRules: [
        v => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(v) || 'Du må skrive inn en gyldig e-postadresse'
      ],
      tournamentNameRules: [
        v => !!v || 'Turneringsnavn er påkrevd',
        v => (v && v.length <= 40) || 'Turneringsnavn må innholde færre enn 20 karakterer' // TODO Litt kort me 20
      ],
      numberFieldRules: [
        v => /^\d+$/.test(v) || 'Bare tall i dette feltet!', // If not included the number field can contain + and -
        v => v < 256 || 'Må vær mindre enn 256!' // TODO MIGHT NOT WANT IT TO BE THE SAME FOR EACH NUMBER FIELD
      ],
      endTimeRules: [
        v => !v || this.checkTime() ||
          'Sluttid kan ikke vær lik eller mindre start tiden!'
      ]
    }
  },
  methods: {
    ...mapActions([
      'createTournament'
    ]),
    ...mapGetters([
      'getTournament'
    ]),
    // Clears all input fields and errors from the form.
    clear() {
      this.$refs.form.reset()
    },
    async submit () {
      this.error = false
      this.isLoading = true
      // Setup the JSON object to be sent to the server
      let payload = {
        'tournament_name': this.tournamentName,
        'admin_email': this.email,
        'start': this.currentDate + 'T' + this.startTime,
        'end': null,
        'tables': parseInt(this.tables),
        'max_rounds': parseInt(this.rounds),
        'early_start': this.early_start
      }
      if (this.endTime.length > 0) {
        payload.end = this.endDate + 'T' + this.endTime
      }
      // Sends the given information in the form to the server.
      await this.createTournament(payload).then(res => {
        // Grabs the tournament from store so the correct tournament_id is used in the dynamic link.
        let tournament = this.getTournament()
        this.$router.push('/lobby/' + tournament.id)
        this.isLoading = false
      }).catch(err => {
        // Hides the loading circle and display error message
        this.isLoading = false
        this.error = true
        this.errorMessage = err + '. Prøv igjen senere!'
      })
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.submit()
      }
    },
    // Checks if start time is before the end time and not after or equal.
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
    // Grabs the minutes from the time string.
    lastNumberInTime(timeString) {
      return parseInt(timeString.toString().split(':')[1])
    },
    // Clears the form and all its errors and sends user back to homepage.
    cancel() {
      this.clear()
      this.$router.push('/')
    },
    onEndDateTime(value) {
      let dateTimeArray = value.split('t')
      if (dateTimeArray.length === 2) {
        this.endDate = dateTimeArray[0]
        this.endTime = dateTimeArray[1]
      }
    }
  },
  computed: {
    calcStartTime() {
      if (this.currentDate === this.endDate) {
        return this.endTime
      }
      return null
    }
  }
}

</script>

<style scoped>
  .form{
    margin: 5vw 20vw 20vh 20vw;
  }
  #cancel-btn{
    margin-left: 1%;
  }
</style>
