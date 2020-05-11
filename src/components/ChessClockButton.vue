<template>
    <v-card
    :color="cardColor"
    height="40%"
    class="mx-3"
    @click="clicked"
    :style="cardStyle"
    >
      <v-card-text class="white--text text-center display-3"> {{ time }}</v-card-text>
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
    },
    firstClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      millisecondToSecondRatio: 1000,
      secondToMinuteRatio: 60,
      intervalStart: 0,
      remainingTime: this.initialTimePrPlayer * 1000, // in ms
      countDownInterval: undefined
    }
  },
  methods: {

    /**
     * Adds additional time to the clock
     * Stops countdown
     * Emits the 'update:count-down' event to parent.
     */
    clicked: function () {
      if (this.countDown) {
        if (!this.firstClick) {
          this.remainingTime += this.additionalTimePrMove * this.millisecondToSecondRatio
        }
        clearInterval(this.countDownInterval)
        this.$emit('update:count-down', false)
        this.$emit('update:firstClick', false)
      }
    },

    /**
     * Reduces the remaining time and stops the clock when the time is up.
     */
    reduceRemainingTime: function() {
      if (this.remainingTime > 0) {
        let now = new Date().getTime()
        this.remainingTime -= (now - this.intervalStart)
        this.intervalStart = now
      } else {
        clearInterval(this.countDownInterval)
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

    /**
     * Calculates the remaining time
     * @returns {string} Returns the remaining time.
     */
    time () {
      let minutes = Math.floor(this.remainingTime / (this.secondToMinuteRatio * this.millisecondToSecondRatio))
      let seconds = Math.floor((this.remainingTime % (this.secondToMinuteRatio * this.millisecondToSecondRatio)) / this.millisecondToSecondRatio)
      let secondsString = seconds < 10 ? '0' + `${seconds}` : `${seconds}`
      return minutes >= 0 ? minutes + ':' + secondsString : '0:00'
    },

    /**
     * Sets the color for the buttons.
     * @returns {string} Button color.
     */
    cardColor () {
      return this.player === 'white' ? 'blue-grey lighten-3' : 'blue darken-4'
    }
  },
  watch: {

    /**
     * Counts down the time
     * @param countDown Boolean value to tell if it should count down.
     */
    countDown: function (countDown) {
      if (countDown && !this.reset) {
        this.intervalStart = new Date().getTime()
        this.countDownInterval = setInterval(this.reduceRemainingTime, 100)
      }
    },

    /**
     * Resets the time
     * @param reset Boolean value to tell if it should reset.
     */
    reset: function (reset) {
      if (reset) {
        clearInterval(this.countDownInterval)
        this.remainingTime = this.initialTimePrPlayer * this.millisecondToSecondRatio
        this.$emit('update:reset', false)
      }
    }
  },
  destroyed() {
    clearInterval(this.countDownInterval)
  }
}
</script>

<style scoped>
</style>
