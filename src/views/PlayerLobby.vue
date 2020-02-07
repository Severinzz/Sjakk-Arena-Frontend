<template>
<v-content>
  <!-- Let the system decide what to load when we are waiting -->
  <!-- https://vuejs.org/v2/guide/conditional.html -->
  <div v-if="waiting">
  <PlayerWaiting></PlayerWaiting>
  </div>
  <!-- Let the system decide what to load when we are not waiting -->
  <div v-else-if="!waiting">
    <PlayerPlaying></PlayerPlaying>
  </div>
  <!-- Let the system decide what to load when something goes wrong -->
  <div v-else>
    <h1>Shit...</h1>
  </div>
</v-content>
</template>

<script>
import PlayerWaiting from '../components/PlayerLobby/PlayerWaiting'
import PlayerPlaying from '../components/PlayerLobby/PlayerPlaying'

export default {
  name: 'PlayerLobby',
  components: {
    PlayerWaiting,
    PlayerPlaying
  },
  data () {
    return {
      waiting: false
    }
  }
}
</script>

<style scoped>

</style>
