<template>
<div>
  <p class="pin">PIN:</p>
  <p class="pin">{{ tournament.id }}</p>
  <p class="time" v-if="!started">Starter: {{ startTime }}</p>
  <p class="time" v-if="started">Slutter: {{ tournament.end.substring(0, tournament.start.length-3) }}</p>
</div>
</template>

<script>
export default {
  name: 'TournamentInfo',
  props: {
    tournament: { type: Object, required: true },
    started: { type: Boolean, required: true }
  },
  computed: {
    // Returns the start time in the correct format.
    startTime() {
      let startArr
      if (this.tournament.start.includes('T')) {
        startArr = this.tournament.start.split('T')
      } else {
        startArr = this.tournament.start.split(' ')
      }
      if (startArr.length > 1) {
        return startArr[1].substring(0, 5)
      } else {
        return startArr[0]
      }
    }
  }
}
</script>
<style scoped>
  div{
    display: inline-block;
    margin: auto;
  }
  .pin{
    font-size: 5.5em;
    font-weight: bold;
  }
  .time{
    margin: 20% 0 10% 0;
    font-size: 3em;
  }
</style>
