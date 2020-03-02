<template>
  <!-- This page is only loaded when tournament has started -->
  <v-container class="justify-center" fluid>
    <v-row class="justify-center" align="center">
      <v-card class="elevation-12, card">
        <v-toolbar color="primary" dark flat>
          <v-spacer />
          <v-toolbar-title>Spillet har startet!</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text align="center">
          <v-spacer />

          <!-- Basic user details -->
          <h1>{{ tournamentName }}</h1>
          <h3 class="gameDetail">{{ playerName }}</h3>
          <h3 class="gameDetail">Poeng: {{ points }}</h3>

          <!-- Do player have an opponent? -->
          <div v-if="paired && !pause">
            <PlayerPaired></PlayerPaired>
          </div>

          <!-- Player do not have opponent and is not on a break -->
          <div v-else-if="!paired && !pause">
            <PlayerNotPaired></PlayerNotPaired>
          </div>

          <!-- If user is on a break and not in a game this shows -->
          <div v-else-if="!paired && pause">
            <p>Du har nå pause. For å spille mer avslutt pausen.</p>
          </div>

          <!-- If all goe to shit this shows up -->
          <div v-else>
            <p>System is not able to pair you. Please try again..</p>
            <p>Feil: pause: {{pause}} og paired: {{paired}}</p>
          </div>

          <!-- Buttons always visible -->
          <v-container>
            <div v-if="!paired">
            <v-btn class="btns" block rounded depressed disabled>Registrer resultat</v-btn>
            </div>
            <div v-if="paired">
              <v-btn class="btns" color="primary" block rounded depressed @click="resultDialog = true">Registrer resultat</v-btn>
            </div>
            <v-btn class="btns" block rounded depressed @click="leaveDialog = true">Forlat turnering</v-btn>
            <!-- If user is NOT paired or in a break -->
            <div v-if="!pause && !paired">
              <v-btn class="btns" block rounded depressed @click="pause = !pause">Ta pause</v-btn>
            </div>
            <!-- If user if NOT paired and in a break -->
            <div v-if="pause && !paired">
              <v-btn class="btns" color="primary" block rounded depressed @click="pause = !pause">Avslutt pause</v-btn>
            </div>
            <div v-if="!pastResults">
              <v-btn class="btns" block rounded depressed @click="pastResults = true">Tidligere parti</v-btn>
            </div>
            <div v-if="pastResults">
              <v-btn class="btns" color="primary" block rounded depressed @click="pastResults = false">Fjern resultatliste</v-btn>
            </div>
          </v-container>

          <div v-if="pastResults">
            <EarlierResults></EarlierResults>
            <v-btn class="btns" color="primary" block rounded depressed @click="pastResults = false">Fjern resultatliste</v-btn>
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
                    v-model="radios"
                    :mandatory="true"
                    inline-block
                  >
                    <v-col cols="4">
                      <v-radio class="radioa" label="Hvit seier">
                        <v-spacer />
                      </v-radio>
                    </v-col>
                    <v-col cols="4">
                      <v-radio class="radioa" label="Remis">
                        <v-spacer />
                      </v-radio>
                    </v-col>
                    <v-col cols="4">
                      <v-radio class="radioa" label="Sort seier">
                        <v-spacer />
                      </v-radio>
                    </v-col>
                  </v-radio-group>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="resultDialog = false">Avbryt</v-btn>
                <v-btn text color="primary" outlined @click="result_registered">Send inn</v-btn>
              </v-card-actions>
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
                  <!-- User has the option to either leave or go back USERID IS HARDCODED! -->
                  <v-btn text @click="set_player_inactive()">Forlat turneringen</v-btn>
                  <v-btn text color="primary" outlined @click="leave_dialog = false">Avbryt</v-btn>
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
import { mapActions } from 'vuex'

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
  data() {
    return {
      resultDialog: false, // Endres av bruker
      leaveDialog: false, // Endres av bruker
      pastResults: false, // Endres av bruker
      pause: false, // Endres av bruker
      paired: false // Endres av systemet
    }
  },
  methods: {
    ...mapActions([
      'inactivatePlayer'
    ]),
    result_registered () {
      this.paired = false
      this.result_dialog = false
    },
    async set_player_inactive () {
      let payload = {
        path: '/player/set-inactive/'
      }
      await this.inactivatePlayer(payload).then(res => {
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .radioa{
    margin-bottom: 1em;
  }

  .btns{
    margin-top: 0.5em;
  }

  .card{
    display: inline;
    width: auto;
    min-width: 8em;
    max-width: 70em;
    height: auto;
  }

  .gameDetail{
    margin-top: 0.8em;
  }
</style>
