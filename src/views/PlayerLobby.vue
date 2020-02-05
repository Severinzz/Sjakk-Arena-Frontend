<template>
  <app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Spiller lobby</v-toolbar-title>
            </v-toolbar>
            <v-card-text align="center">
              <h1>Turneringsnavn</h1>
              <h5 class="gameTime">Spille tid: 00:00 -> 01:00</h5>
              <h2 class="gameTime">Spillernavn</h2>
              <h5 class="gameTime">Tuneringsinformasjon</h5>
            </v-card-text>
          </v-card>
        </v-row>
      </v-container>
    </v-content>
  </app>
</template>

<script>
export default {
  name: 'PlayerLobby'
}
</script>

<style scoped>
  .gameTime{
    margin-top: 1.2em;
  }
</style>
