<template>
  <div>
    <!-- [<<] button -->
    <v-btn
      class="left"
      @click="jumpLeft"
      v-if="showJumpLeft"
    >
      &laquo;
    </v-btn>
    <!-- The list of number buttons -->
    <v-btn
      v-for="page in visibleButtons"
      :key="page"
      :id="'button' + page"
      class="nrButton"
    @click="changePage(page)"
    :class="page === activeButton ?'active-button' : ''"
    >
      {{ page }}
    </v-btn>
    <!-- [>>] button -->
    <v-btn
      class="right"
      @click="jumpRight"
    v-if="showJumpRight"
    >
      &raquo;
    </v-btn>
    <!-- Current page -->
      <p>Side {{ activeButton }} av {{ lastButton }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaginationButtons',
  props: {
    prPage: {
      type: Number,
      default: 5
    },
    numberOfItems: {
      type: Number,
      required: true
    },
    maxVisibleButtons: { // This is without the "<<" and ">>" buttons
      type: Number,
      default: 5
    },
    autoScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeButton: 1,
      intervalId: '',
      showJumpLeft: false,
      showJumpRight: false
    }
  },
  methods: {

    /**
     * Change active button and emit update:page event.
     * @param page The page to change to
     */
    changePage(page) {
      this.activeButton = page
      this.$emit('update:page', page)
    },

    /**
     * Returns if there is any buttons to the left outside of the visible ones
     */
    hasButtonsLeft() {
      return this.minButtonNr() >= 1
    },

    /**
     * Checks if there is any buttons to the right outside of the visible ones
     */
    hasButtonsRight() {
      return this.maxButtonNr() < this.lastButton
    },

    /**
     * Returns the index of the lowest visible number
     */
    minButtonNr() {
      return Math.floor(this.activeButton - (this.maxVisibleButtons / 2))
    },

    /**
     * Returns the highest number that should be visible.
     */
    maxButtonNr() {
      return Math.floor(this.activeButton + (this.maxVisibleButtons / 2))
    },

    /**
     * Jumps to the first button outside of the visible left range, if button 1 is visible that wil be jumped to.
     */
    jumpLeft() {
      if (this.minButtonNr() <= 0) {
        this.changePage(1)
      } else {
        this.changePage(this.minButtonNr())
      }
    },

    /**
     * Jumps to the first button outside of the visible right range,
     * if button last button is visible that wil be jumped to.
     */
    jumpRight() {
      if (this.maxButtonNr() >= this.lastButton) {
        this.changePage(this.lastButton)
      } else {
        this.changePage(this.maxButtonNr() + 1)
      }
    },

    /**
     * Hides or displays the [<<] button.
     * @param show Boolean value to deside if [<<] should be shown
     */
    alterShowJumpLeft(show) {
      this.showJumpLeft = show
    },

    /**
     * Hides or displays the [>>] button.
     * @param show Boolean value to deside if [>>] should be shown
     */
    alterShowJumpRight(show) {
      this.showJumpRight = show
    }
  },
  computed: {

    /**
     * Returns an array consisting of the number of the buttons that should be visible.
     * @returns {[]|*[]} Array consisting of the number of the buttons that should be visible.
     */
    visibleButtons () {
      let button = 1
      let buttonsArr = []
      // Creates an array of all the buttons.
      while (buttonsArr.length < this.lastButton) {
        buttonsArr.push(button)
        button++
      }
      switch (true) {
        case this.maxVisibleButtons >= this.lastButton:
          this.alterShowJumpLeft(false)
          this.alterShowJumpRight(false)
          return buttonsArr

        // If there are no buttons to the left of the visible range
        case !this.hasButtonsLeft():
          this.alterShowJumpLeft(false)
          this.alterShowJumpRight(true)
          return buttonsArr.slice(0, this.maxVisibleButtons)

        // No buttons to the right of the visible range
        case !this.hasButtonsRight():
          this.alterShowJumpLeft(true)
          this.alterShowJumpRight(false)
          return buttonsArr.slice(this.lastButton - this.maxVisibleButtons, this.lastButton)

        default:
          this.alterShowJumpLeft(true)
          this.alterShowJumpRight(true)
          // There are buttons to both right and left of the visible range.
          return buttonsArr.slice(this.minButtonNr(), this.maxButtonNr())
      }
    },

    /**
     * Returns the last button
     * @returns {number} The last button
     */
    lastButton () {
      let lastButton = Math.ceil(this.numberOfItems / this.prPage)
      return lastButton > 0 ? lastButton : 1
    }
  },
  watch: {

    /**
     * Go the the next button every 30 sec. When the last button is reached, start from the beginning.
     * @param autoScroll Boolean value to tell if it should auto scroll or not.
     */
    autoScroll: function(autoScroll) {
      const VM = this
      if (autoScroll) {
        this.intervalId = setInterval(function () {
          VM.activeButton === VM.lastButton ? VM.activeButton = 1 : VM.activeButton = VM.activeButton + 1
          VM.changePage(VM.activeButton)
        }, 30000)
      } else {
        clearInterval(this.intervalId)
      }
    }
  },
  destroyed() {
    clearInterval(this.intervalId)
  }
}
</script>

<style scoped>
  p{
    margin-top: 1em;
  }
  .active-button{
    background-color: rgb(200, 200, 200) !important;
  }
</style>
