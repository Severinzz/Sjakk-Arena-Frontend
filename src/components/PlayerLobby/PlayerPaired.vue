<template>
  <!-- This is loaded when system has found an opponent for player -->
    <span>
      <h1 class="gameDetail">Ditt neste parti:</h1>
      <h2 class="gameDetail">Bord: <strong>{{table}}</strong></h2>
      <h2 class="gameDetail">Motstander: <strong>{{nextOpponent}}</strong></h2>
      <h2 class="gameDetail">Farge: <strong>{{colour}}</strong></h2>
    </span>
</template>

<script>
export default {
  name: 'PlayerPaired',
  data () {
    return {
      nextOpponent: 'Magnus Carlsen',
      colour: 'Sort',
      table: '1'
    }
  }
}
</script>

<style scoped>
  .gameDetail{
    margin-top: 0.5em;
  }
</style>
