<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="form">
    <v-form
      ref="form"
      lazy-validation
    >
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
        <v-spacer></v-spacer>
        <v-col cols="11" sm="5">
          <!-- End time -->
          <v-menu
            ref="secondmenu"
            v-model="endTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="endTime"
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
      <v-btn id="submit-btn" class="mr-4" color="primary" @click="validate">Send</v-btn>
      <v-btn id="clear-btn" @click="clear">Tøm</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'TournamentCreationForm',
  data () {
    return {
      startTime: null, // start time of tournament
      endTime: null, // end time of tournament
      startTimeMenu: false,
      endTimeMenu: false,
      name: '', // name of tournament host
      email: '', // email address of tournament host
      tournamentName: '', // name of tournament
      tables: '', // number of tables used in the tournament
      pause: '', // length of pause between games
      rounds: '', // maximum number of rounds in the tournament
      earlyStart: false, // true if the tournament will start when two players are registered
      formColor: 'blue', // color to be used in form elements

      // rules
      nameRules: [
        v => !!v || 'Navn er påkrevd',
        v => (v && v.length <= 20) || 'Navn må innholde færre enn 20 karakterer'
      ],
      emailRules: [
        v => /.+@.+\..+/.test(v) || 'Du må skrive inn en gyldig e-postadresse'
      ],
      tournamentNameRules: [
        v => !!v || 'Turneringsnavn er påkrevd',
        v => (v && v.length <= 20) || 'Turneringsnavn må innholde færre enn 20 karakterer'
      ],
      numberFieldRules: [
        v => /^\d+$/.test(v) || 'Bare tall i dette feltet!' // If not included the number field can contain + and -
      ]
    }
  },
  methods: {
    clear() {
      this.$refs.form.reset()
    },
    submit() {
      alert('Navn: ' + this.name + '\nEmail: ' + this.email + '\nTurneringsnavn: ' + this.tournamentName +
      '\nStarttid: ' + this.startTime + '\nSluttid: ' + this.endTime +
        '\nAntall bord: ' + this.tables + '\nMax antall runder: ' + this.rounds +
      '\nStart når to spillere er påmeldt: ' + this.earlyStart)
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.submit()
      }
    }
  }
}

</script>

<style scoped>
  .form{
    margin: 5vw 20vw 20vh 20vw;
  }
</style>
