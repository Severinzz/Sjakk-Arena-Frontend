<template>
<v-content>
  <div v-if="waiting">
  <PlayerWaiting></PlayerWaiting>
  </div>
  <div v-else-if="!waiting">
    <PlayerPlaying></PlayerPlaying>
  </div>
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
