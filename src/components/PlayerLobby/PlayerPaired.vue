<template>
  <!-- This is loaded when system has found an opponent for player -->
    <span>
      <h1 class="bigInfo">Ditt neste parti:</h1>
      <h2 class="bigInfo">Bord: <strong>{{table}}</strong></h2>
      <h2 class="mediumInfo">Motstander: <strong>{{nextOpponent}}</strong></h2>
      <h2 class="buttomInfo">Farge: <strong>{{colour}}</strong></h2>
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
  .bigInfo{
    margin-top: 0.5em;
  }

   .mediumInfo{
     margin-top: 0.3em;
   }

  .buttomInfo{
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
</style>
