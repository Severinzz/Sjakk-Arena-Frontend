<template>
<div>
  <p class="pin">PIN:</p>
  <p class="pin">{{ tournament.id }}</p>
  <p class="time" v-if="!started">Starter: {{ tournament.start }}</p>
  <p class="time" v-if="started">Slutter: {{ tournament.end }}</p>
</div>
</template>

<script>

export default {
  name: 'TournamentInfo',
  props: {
    tournament: { type: Object, required: true },
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
