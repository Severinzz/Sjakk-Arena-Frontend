<template>
    <v-card
    :color="cardColor"
    height="50%"
    class="mx-3"
    @click="clicked"
    :style="cardStyle"
    >
      <v-card-text
        class="white--text text-center display-3"
        > {{ time }}</v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'ChessClockButton',
  props: {
    player: String,
    rotate: {
      type: Boolean,
      default: false
    },
    initialTimePrPlayer: {
      type: Number,
      required: true
    },
    additionalTimePrMove: Number,
    countDown: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      timeLeft: this.initialTimePrPlayer,
      countDownInterval: undefined
    }
  },
  methods: {
    clicked: function () {
      if (this.countDown) {
        this.timeLeft += this.additionalTimePrMove
        clearInterval(this.countDownInterval)
        this.$emit('update:count-down', false)
      }
    },
    decrementTimeLeft: function() {
      this.timeLeft -= 1
    }
  },
  computed: {
    cardStyle () {
      if (this.rotate) {
        return { transform: 'rotate(' + 180 + 'deg)' }
      }
      return ''
    },
    time () {
      let minutes = Math.floor(this.timeLeft / 60)
      let seconds = Math.floor(this.timeLeft % 60)
      let secondsString = seconds < 10 ? '0' + `${seconds}` : `${seconds}`
      return minutes + ':' + secondsString
    },
    cardColor () {
      return this.player === 'white' ? 'blue-grey lighten-3' : 'blue darken-4'
    }
  },
  watch: {
    countDown: function (countDown) {
      if (countDown) {
        this.countDownInterval = setInterval(this.decrementTimeLeft, 1000)
      }
    }
  }
}
</script>

<style scoped>
</style>
