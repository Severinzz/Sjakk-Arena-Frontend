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
          <p class="gameDetail">Neste parti: {{TnextOpponent}}</p>
          <p class="gameDetail">Farge: {{Tcolour}}</p>
          <p class="gameDetail">Bord: {{Tbord}}</p>
          <p class="gameDetail body-2">Spille tid: {{Tstart}} -> {{Tend}} </p>
          <v-spacer />
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PlayerPlaying',
  data() {
    return {
      Tname: 'NTNU Open',
      Tstart: '13:00',
      Tend: '15:30',
      Tpin: '13376',
      Tpoints: '13',
      TnextOpponent: 'Magnus Carlsen',
      Usernamne: 'Ola Nordmann',
      Tcolour: 'Sort',
      Tbord: '1'
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
