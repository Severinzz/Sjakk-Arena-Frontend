<template>
  <div>
    <p class="player-name"> {{ playerName }} </p>
    <i :class="playerPiece"></i>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    playerName: { type: String, required: true },
    playerPiece: { type: String, required: false }
  }
}
</script>

<style scoped>
  .player-name{
    font-size: 1.3em;
    font-weight: bold;
  }
</style>
