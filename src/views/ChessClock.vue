<template>
  <div id="chess-clock">
    <chess-clock-button
      color="white"
      rotate=true />
    <chess-clock-button
      color="grey darken-4"/>
  </div>
</template>

<script>
import ChessClockButton from '../components/ChessClockButton'

export default {
  name: 'ChessClock',
  components: { ChessClockButton }
}
</script>

<style scoped>
  #chess-clock {
    height:100%;
  }
</style>
