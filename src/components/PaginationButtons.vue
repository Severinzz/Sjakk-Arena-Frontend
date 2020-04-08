<template>
  <div>
    <v-btn
      class="left"
      @click="jumpLeft"
      v-if="activeButton !== 1">
      &laquo;
    </v-btn>
    <v-btn
      v-for="page in visibleButtons"
      :key="page"
      :id="'button' + page"
      class="nrButton"
    @click="changePage(page)"
    :class="page === activeButton ?'active-button' : ''"
    >{{ page }}</v-btn>
    <v-btn
      class="right"
      @click="jumpRight"
    v-if="activeButton !== lastButton">
      &raquo;
    </v-btn>
      <p>Side {{ activeButton }} av {{ lastButton }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaginationButtons',
  props: {
    prPage: { type: Number, required: true },
    numberOfItems: { type: Number, required: true },
    maxVisibleButtons: { type: Number, required: false, default: 5 }, // This is without the "<<" and ">>" buttons
    autoScroll: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      activeButton: 1,
      intervalId: ''
    }
  },
  methods: {
    changePage(page) {
      this.activeButton = page
      this.$emit('pageChanged', page)
    },
    // Returns if there is any buttons to the left outside of the visible ones
    hasButtonsLeft() {
      return this.minButtonNr() >= 1
    },
    // Checks if there is any buttons to the right outside of the visible ones
    hasButtonsRight() {
      return this.maxButtonNr() <= this.lastButton
    },
    // Returns the index of the lowest visible number
    minButtonNr() {
      return Math.floor(this.activeButton - (this.maxVisibleButtons / 2))
    },
    // Returns the highest number that should be visible.
    maxButtonNr() {
      return Math.floor(this.activeButton + (this.maxVisibleButtons / 2))
    },
    /*
     Jumps to the first button outside of the visible left range, if button 1 is visible that wil be jumped to.
     */
    jumpLeft() {
      if (this.minButtonNr() <= 0) {
        this.changePage(1)
      } else {
        this.changePage(this.minButtonNr())
      }
    },
    /*
    Jumps to the first button outside of the visible right range,
    if button last button is visible that wil be jumped to.
     */
    jumpRight() {
      if (this.maxButtonNr() >= this.lastButton) {
        this.changePage(this.lastButton)
      } else {
        this.changePage(this.maxButtonNr() + 1)
      }
    }
  },
  computed: {
    visibleButtons () {
      let button = 1
      let buttonsArr = []
      // Creates an array of all the buttons.
      while (buttonsArr.length < this.lastButton) {
        buttonsArr.push(button)
        button++
      }
      switch (true) {
        // If there are no buttons to the left of the visible range
        case !this.hasButtonsLeft():
          return buttonsArr.slice(0, this.maxVisibleButtons)
        // No buttons to the right of the visible range
        case !this.hasButtonsRight():
          return buttonsArr.slice(this.lastButton - this.maxVisibleButtons, this.lastButton)
        default:
          // There are buttons to both right and left of the visible range.
          return buttonsArr.slice(this.minButtonNr(), this.maxButtonNr())
      }
    },
    lastButton () {
      return Math.ceil(this.numberOfItems / this.prPage)
    }
  },
  watch: {
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
