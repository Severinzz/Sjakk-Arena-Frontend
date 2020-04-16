<template>
  <div id="chess-clock">
    <chess-clock-button
      player="black"
      :rotate=true
      :initial-time-pr-player="initialTimePrPlayer"
      :additional-time-pr-move="additionalTimePrMove"
      :count-down.sync="blackCountDown"
    />
    <chess-clock-button
      player="white"
      :initial-time-pr-player="initialTimePrPlayer"
      :additional-time-pr-move="additionalTimePrMove"
      :count-down.sync="whiteCountDown"
    />
  </div>
</template>

<script>
import ChessClockButton from '../components/ChessClockButton'

export default {
  name: 'ChessClock',
  components: { ChessClockButton },
  data() {
    return {
      initialTimePrPlayer: 900, // in seconds
      additionalTimePrMove: 10, // in seconds
      blackCountDown: false,
      whiteCountDown: true
    }
  },
  watch: {
    whiteCountDown: function(whiteCountDown) {
      if (!whiteCountDown) {
        this.blackCountDown = true
      }
    },
    blackCountDown: function(blackCountDown) {
      if (!blackCountDown) {
        this.whiteCountDown = true
      }
    }
  }
}
</script>

<style scoped>
  #chess-clock {
    height:100%;
  }
</style>
