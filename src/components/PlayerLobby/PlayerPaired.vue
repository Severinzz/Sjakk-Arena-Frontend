<template>
  <!-- This is loaded when system has found an opponent for player -->
  <span>
      <h1 class="compTitle">Ditt neste parti:</h1>
      <h2 class="Info">Bord:
        <strong>{{ table }}</strong></h2>
      <h2 class="Info">Farge: <strong>{{ colour }}</strong></h2>
      <h2 class="buttomInfo">Motstander: <strong>{{ opponent }}</strong></h2>
    </span>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'PlayerPaired',
  computed: {
    ...mapState({
      table: state => state.games.activeGame.table,
      colour: state => state.games.activeGame.colour,
      opponent: state => state.games.activeGame.opponent
    })
  }
}
</script>

<style scoped>
  .compTitle {
    margin-top: 0.5em;
    font-size: 18px;
  }

  .Info {
    margin-top: 0.5em;
    font-size: 22px;
  }

  .buttomInfo {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-size: 18px;
  }
</style>
