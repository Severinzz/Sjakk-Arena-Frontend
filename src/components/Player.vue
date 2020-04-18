<template>
  <div class="player-wrapper">
    <p class="player-name"> {{ playerName }} </p>
    <i :class="playerPiece"></i>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    playerName: {
      type: String,
      required: true
    },
    playerPiece: {
      type: String,
      default: 'fas fa-chess-queen fa-3x',
      validator: value => {
        return value.indexOf('fa-') > -1 // Checks if the icon is from fontawesome
      }
    }
  }
}
</script>

<style scoped>
  .player-name{
    font-size: 1.3em;
    font-weight: bold;
  }

  .player-wrapper {
    margin: 3% auto auto auto;
    padding: 10px;
    width: 15%;
    min-width: 150px;
  }

  .player-wrapper:hover {
    text-decoration: line-through;
  }
</style>
