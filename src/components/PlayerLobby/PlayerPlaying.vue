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
          <h1>{{ Tname }}</h1>
          <h3 class="gameDetail">{{ Usernamne }}</h3>
          <h3 class="gameDetail">Poeng: {{ Tpoints }}</h3>
          <!-- Do player have an opponent? -->
          <div v-if="paired">
            <PlayerPaired></PlayerPaired>
          </div>
          <div v-else-if="!paired">
            <PlayerNotPaired></PlayerNotPaired>
          </div>
          <!-- If something goes wrong this shows up -->
          <div v-else>
            <p>Systemet kan ikke sette deg opp mot noen, Vennligst prøv igjen.</p>
          </div>
          <v-container>
            <div v-if="!paired">
            <v-btn class="btns" block rounded depressed disabled>Registrer resultat</v-btn>
            </div>
            <div v-if="paired">
              <v-btn class="btns" block rounded depressed>Registrer resultat</v-btn>
            </div>
            <v-btn class="btns" block rounded depressed>Tidligere parti</v-btn>
            <v-btn class="btns" block rounded depressed>Forlat turnering</v-btn>
            <v-btn class="btns" block rounded depressed>Ta pause</v-btn>
          </v-container>
          <p class="gameDetail body-2">Spilletid: {{ Tstart }} -> {{ Tend }} </p>
          <v-spacer />
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PlayerPaired from './PlayerPaired'
import PlayerNotPaired from './PlayerNotPaired'

export default {
  name: 'PlayerPlaying',
  components: {
    PlayerPaired,
    PlayerNotPaired
  },
  data() {
    return {
      Tname: 'NTNU Open',
      Tstart: '13:00',
      Tend: '15:30',
      Usernamne: 'Ola Nordmann',
      Tpoints: '13',
      paired: false
    }
  }
}
</script>

<style scoped>
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
