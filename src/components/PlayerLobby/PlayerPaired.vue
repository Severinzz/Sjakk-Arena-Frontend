<template>
    <span>
      <p class="gameDetail">Neste parti: {{TnextOpponent}}</p>
      <p class="gameDetail">Farge: {{Tcolour}}</p>
      <p class="gameDetail">Bord: {{Tbord}}</p>
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
    margin-top: 1.2em;
  }
</style>
