<template>
    <v-card
    :color="cardColor"
    height="40%"
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
    player: {
      type: String,
      required: true
    },
    rotate: {
      type: Boolean,
      default: false
    },
    initialTimePrPlayer: {
      type: Number,
      required: true
    },
    additionalTimePrMove: {
      type: Number,
      required: true
    },
    countDown: {
      type: Boolean,
      required: true
    },
    reset: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      secondToMillisecondRatio: 1000,
      minuteToSecondRatio: 60,
      intervalStart: 0,
      timeLeft: this.initialTimePrPlayer * 1000, // in ms
      countDownInterval: undefined
    }
  },
  methods: {
    clicked: function () {
      if (this.countDown) {
        this.timeLeft += this.additionalTimePrMove * this.secondToMillisecondRatio
        clearInterval(this.countDownInterval)
        this.$emit('update:count-down', false)
      }
    },
    decrementTimeLeft: function() {
      if (this.timeLeft > 0) {
        let now = new Date().getTime()
        this.timeLeft -= now - this.intervalStart
        this.intervalStart = now
      } else {
        this.$emit('times-up')
      }
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
      let minutes = Math.floor(this.timeLeft / (this.minuteToSecondRatio * this.secondToMillisecondRatio))
      let seconds = Math.floor((this.timeLeft % (this.minuteToSecondRatio * this.secondToMillisecondRatio)) / this.secondToMillisecondRatio)
      let secondsString = seconds < 10 ? '0' + `${seconds}` : `${seconds}`
      return minutes + ':' + secondsString
    },
    cardColor () {
      return this.player === 'white' ? 'blue-grey lighten-3' : 'blue darken-4'
    }
  },
  watch: {
    countDown: function (countDown) {
      if (countDown && !this.reset) {
        this.intervalStart = new Date().getTime()
        this.countDownInterval = setInterval(this.decrementTimeLeft, 100)
      }
    },
    reset: function (reset) {
      if (reset) {
        clearInterval(this.countDownInterval)
        this.timeLeft = this.initialTimePrPlayer * this.secondToMillisecondRatio
        this.$emit('update:reset', false)
      }
    }
  }
}
</script>

<style scoped>
</style>
