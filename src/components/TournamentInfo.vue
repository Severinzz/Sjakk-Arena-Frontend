<template>
<div>
  <h1>PIN:</h1>
  <h1>{{ tournament[0].pin }}</h1>
  <h2 v-if="!started">Starter: {{ tournament[0].start }}</h2>
  <h2 v-if="started">Slutter: {{ tournament[0].end }}</h2>
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
</style>
