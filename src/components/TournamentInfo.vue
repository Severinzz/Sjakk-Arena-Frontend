<template>
<div>
  <p class="pin">PIN:</p>
  <p class="pin">{{ tournament[0].pin }}</p>
  <p class="time" v-if="!started">Starter: {{ tournament[0].start }}</p>
  <p class="time" v-if="started">Slutter: {{ tournament[0].end }}</p>
</div>
</template>

<script>
export default {
  name: 'TournamentInfo',
  props: {
    tournament: { type: Array, required: true },
    started: { type: Boolean, required: true }
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
