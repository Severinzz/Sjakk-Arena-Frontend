<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="form">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-toolbar dark color="blue">
        <v-toolbar-title >Turneringsinformasjon</v-toolbar-title>
      </v-toolbar>
      <v-text-field
        v-model="name"
        label="Navn"
        required
      ></v-text-field>
      <v-text-field
        v-model="tournamentName"
        label="Navn på turnering"
        required
      ></v-text-field>
      <!-- code from https://vuetifyjs.com/en/components/time-pickers-->
      <v-row>
        <v-col cols="11" sm="5">
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
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="startTimeMenu"
              v-model="startTime"
              full-width
              @click:minute="$refs.firstmenu.save(startTime)"
            ></v-time-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="11" sm="5">
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
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
      <!-- end of copied code -->
      <v-text-field
        v-model="tables"
        label="Antall bord"
        required
      ></v-text-field>
      <v-text-field
        v-model="pause"
        label="Tid mellom parti (i minutter)"
        required
      ></v-text-field>
      <v-text-field
        v-model="rounds"
        label="Max antall runder"
        required
      ></v-text-field>
      <v-switch label="Start når to spillere er påmeldt" v-model="earlyStart"></v-switch>
      <v-btn class="mr-4" @click="submit">Send</v-btn>
      <v-btn @click="clear">Tøm</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'TournamentCreationForm',
  data () {
    return {
      startTime: null,
      endTime: null,
      startTimeMenu: false,
      endTimeMenu: false,
      name: '',
      tournamentName: '',
      tables: '',
      pause: '',
      rounds: '',
      earlyStart: false
    }
  },
  methods: {
    clear() {
      this.startTime = null
      this.endTime = null
      this.name = ''
      this.tournamentName = ''
      this.tables = ''
      this.pause = ''
      this.rounds = ''
      this.earlyStart = false
    },
    submit() {
      alert('Navn: ' + this.name + '\nTurneringsnavn: ' + this.tournamentName +
      '\nStarttid: ' + this.startTime + '\nSluttid: ' + this.endTime +
        '\nAntall bord: ' + this.tables + '\nMax antall runder: ' + this.rounds +
      '\nStart når to spillere er påmeldt: ' + this.earlyStart)
    }
  }
}

</script>

<style scoped>
  .form{
    margin: 5vw 20vw 0 20vw;
  }
</style>
