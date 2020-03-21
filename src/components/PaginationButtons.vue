<template>
  <div>
    <v-btn class="left"> &laquo; </v-btn>
    <v-btn
      v-for="page in visibleButtons"
      :key="page"
    @click="changePage(page)"
    :class="page === activePage ?'active-button' : ''"
    >{{ page }}</v-btn>
    <v-btn class="right"> &raquo; </v-btn>
      <p>Side {{ activePage }} av {{ lastButton }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaginationButtons',
  props: {
    prPage: { type: Number, required: true },
    numberOfItems: { type: Number, required: true },
    maxVisibleButtons: { type: Number, required: false, default: 5 }
  },
  data() {
    return {
      activePage: 1,
      lastButton: this.numberOfItems / this.prPage
    }
  },
  methods: {
    changePage(page) {
      this.activePage = page
    },
    hasButtonsLeft() {
      return this.minButtonNr() >= 1
    },
    hasButtonsRight() {
      return this.maxButtonNr() <= this.lastButton
    },
    minButtonNr() {
      return Math.floor(this.activePage - (this.maxVisibleButtons / 2))
    },
    maxButtonNr() {
      return Math.floor(this.activePage + (this.maxVisibleButtons / 2))
    }
  },
  computed: {
    visibleButtons() {
      let button = 1
      let buttonsArr = []
      while (buttonsArr.length < this.lastButton) {
        buttonsArr.push(button)
        button++
      }
      switch (true) {
        case !this.hasButtonsLeft():
          return buttonsArr.slice(0, this.maxVisibleButtons)
        case !this.hasButtonsRight():
          return buttonsArr.slice(this.lastButton - this.maxVisibleButtons, this.lastButton)
        default:
          return buttonsArr.slice(this.minButtonNr(), this.maxButtonNr())
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
