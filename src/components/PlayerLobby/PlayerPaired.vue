<template>
  <!-- This is loaded when system has found an opponent for player -->
    <span>
      <h1 class="gameDetail">Ditt neste parti:</h1>
      <h2 class="gameDetail">Bord: <strong>{{Tbord}}</strong></h2>
      <h2 class="gameDetail">Neste parti: <strong>{{TnextOpponent}}</strong></h2>
      <h2 class="gameDetail">Farge: <strong>{{Tcolour}}</strong></h2>
    </span>
</template>

<script>
export default {
  name: 'PlayerPaired',
  data () {
    return {
      TnextOpponent: 'Magnus Carlsen',
      Tcolour: 'Sort',
      Tbord: '1'
    }
  }
}
</script>

<style scoped>
  .gameDetail{
    margin-top: 0.5em;
  }
</style>
