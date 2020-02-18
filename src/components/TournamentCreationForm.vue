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
      <!-- Name of tournament host -->
      <v-text-field
        v-model="name"
        label="Navn"
        :rules="nameRules"
        required
      >
      </v-text-field>
      <!-- email address of tournament host -->
      <v-text-field
        v-model="email"
        label="E-post"
        :rules="emailRules"
        required>
      </v-text-field>
      <!-- Name of tournament -->
      <v-text-field
        v-model="tournamentName"
        label="Navn på turnering"
        :rules="tournamentNameRules"
        required
      ></v-text-field>
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
              @click:minute="$refs.firstmenu.save(startTime)"
              :color="formColor"
              :max="endTime"
              format="24hr"
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
      <!-- Length of pause between games-->
      <v-text-field
        v-model="pause"
        label="Tid mellom parti (i minutter)"
        type="number"
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
      <v-switch label="Start når to spillere er påmeldt" v-model="earlyStart"></v-switch>
      <v-switch label="Bruk sluttid" v-model="useEndTime"></v-switch>
      <!-- code from https://vuetifyjs.com/en/components/time-pickers-->
      <v-row>
      <v-col cols="12" sm="5">
      <!-- End time -->
      <v-menu
        ref="secondmenu"
        v-model="endTimeMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="endTime"
        v-if="useEndTime"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="endTime"
            label="Sluttid"
            readonly
            v-on="on"
            :rules="endTimeRules"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="endTimeMenu"
          v-model="endTime"
          full-width
          @click:minute="$refs.secondmenu.save(endTime)"
          :color="formColor"
          :min="startTime"
          format="24hr"
        ></v-time-picker>
      </v-menu>
      </v-col>
      </v-row>
      <!-- end of code from vuetifyjs.com -->
      <v-btn id="submit-btn" class="mr-4" color="primary" @click="validate">Send</v-btn>
      <v-btn id="clear-btn" @click="clear">Tøm</v-btn>
      <v-btn id="cancel-btn" @click="cancel">Avbryt</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AlertBox from './AlertBox'
export default {
  name: 'TournamentCreationForm',
  components: { AlertBox },
  data () {
    return {
      startTime: '', // start time of tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      endTime: '', // end time of tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      startTimeMenu: false,
      endTimeMenu: false,
      name: '', // name of tournament host // TODO TRENG VI VIRKELI DINNA?
      email: '', // email address of tournament host
      tournamentName: '', // name of tournament
      tables: '', // number of tables used in the tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      pause: '', // length of pause between games // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      rounds: '', // maximum number of rounds in the tournament // TODO CHECK DATABASE FOR MAX VALUE (MIGHT ALSO WANT TO CHANGE IT)
      earlyStart: false, // true if the tournament will start when two players are registered
      formColor: 'blue', // color to be used in form elements
      isLoading: false,
      errorMessage: '',
      error: false,
      useEndTime: false,
      // rules
      nameRules: [
        v => !!v || 'Navn er påkrevd',
        v => (v && v.length <= 20) || 'Navn må innholde færre enn 20 karakterer'
      ],
      emailRules: [
        v => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(v) || 'Du må skrive inn en gyldig e-postadresse'
      ],
      tournamentNameRules: [
        v => !!v || 'Turneringsnavn er påkrevd',
        v => (v && v.length <= 20) || 'Turneringsnavn må innholde færre enn 20 karakterer'
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
    clear() {
      this.$refs.form.reset()
    },
    async submit () {
      this.error = false
      this.isLoading = true
      let payload = {
        'tournament_name': this.name,
        'admin_email': this.email,
        'start': this.startTime,
        'end': this.endTime,
        'tables': parseInt(this.tables),
        'max_rounds': parseInt(this.rounds),
        'early_start': this.early_start
      }
      await this.createTournament(payload).then(res => {
        let tournament = this.getTournament()
        this.$router.push('/lobby/' + tournament.id)
        this.isLoading = false
      }).catch(err => {
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
    checkTime() {
      let startTimeH = this.startTime.toString().split(':')[0]
      let endTimeH = this.endTime.toString().split(':')[0]
      if (parseInt(startTimeH) < parseInt(endTimeH)) {
        return true
      } else {
        let startTimeM = this.lastNumberInTime(this.startTime)
        let endTimeM = this.lastNumberInTime(this.endTime)
        return parseInt(startTimeM) < parseInt(endTimeM)
      }
    },
    lastNumberInTime(timeString) {
      return parseInt(timeString.toString().split(':')[1])
    },
    cancel() {
      this.clear()
      this.$router.go(-1)
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
