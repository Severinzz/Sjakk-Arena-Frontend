<template>
  <!-- This is loaded when system has found an opponent for player -->
    <span>
      <h1 class="title">Ditt neste parti:</h1>
      <h2 class="Info">Bord: <strong>{{ table }}</strong></h2>
      <h2 class="Info">Farge: <strong>{{ colour }}</strong></h2>
      <h2 class="buttomInfo">Motstander: <strong>{{ nextOpponent }}</strong></h2>
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
  .title{
    margin-top: 0.5em;
    font-size: 18px;
  }

  .Info{
    margin-top: 0.5em;
    font-size: 22px;
  }

  .buttomInfo{
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-size: 18px;
  }
</style>
