<template>
  <!-- This is loaded when player is waiting for game start -->
  <v-container class="justify-center" fluid>
    <v-row class="justify-center" align="center">
      <v-card class="elevation-12, card">
        <v-toolbar color="primary" dark flat>
          <v-spacer />
          <v-toolbar-title>Venter på spillstart...</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-card-text align="center">
          <v-spacer />
          <h1>{{ tournamentName }}</h1>
          <h5 class="gameDetail body-2">Spilletid: {{tournamentStart}} -> {{tournamentEnd}} </h5>
          <h2 class="gameDetail">{{ playerName }}</h2>
          <v-spacer />
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PlayerWaiting',
  props: {
    tournamentName: String,
    tournamentStart: String,
    tournamentEnd: String,
    playerName: String,
    points: Number
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
