<template>
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
          <h1>{{ Tname }}</h1>
          <h2 class="gameDetail">{{Usernamne}}</h2>
          <h2 class="gameDetail">Poeng: {{Tpoints}}</h2>
          <div v-if="paired">
            <PlayerPaired></PlayerPaired>
          </div>
          <div v-else-if="!paired">
            <p class="gameDetail">Please wait while we try to pair you up!</p>
            <v-progress-circular
              :size="70"
              :width="7"
              color="indigo"
              indeterminate
            ></v-progress-circular>
          </div>
          <div v-else>
            <p>System is unable to pair you up, please try again.</p>
          </div>
          <p class="gameDetail body-2">Spille tid: {{Tstart}} -> {{Tend}} </p>
          <v-spacer />
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PlayerPaired from './PlayerPaired'

export default {
  name: 'PlayerPlaying',
  components: {
    PlayerPaired
  },
  data() {
    return {
      Tname: 'NTNU Open',
      Tstart: '13:00',
      Tend: '15:30',
      Tpin: '13376',
      Usernamne: 'Ola Nordmann',
      Tpoints: '13',
      paired: false
    }
  }
}
</script>

<style scoped>
  .card{
    display: inline;
    width: auto;
    min-width: 8em;
    max-width: 65em;
    height: auto;
  }

  .gameDetail{
    margin-top: 1.2em;
  }
</style>
