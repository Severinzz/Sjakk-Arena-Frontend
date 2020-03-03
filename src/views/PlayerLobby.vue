<template>
  <div>
    <v-container>
      <!-- Let the system decide what to load when we are waiting -->
      <!-- https://vuejs.org/v2/guide/conditional.html -->
      <div v-if="waiting">
        <PlayerWaiting
          :tournament-name="tournamentName"
          :tournament-start="tournamentStart"
          :tournament-end="tournamentEnd"
          :player-name="playerName"
          :points="points"
        >
        </PlayerWaiting>
      </div>

      <!-- Let the system decide what to load when we are not waiting -->
      <div v-else-if="!waiting">
        <PlayerPlaying
          :tournament-name="tournamentName"
          :tournament-start="tournamentStart"
          :tournament-end="tournamentEnd"
          :player-name="playerName"
          :points="points"
        >
        </PlayerPlaying>
      </div>

      <!-- Something goes wrong -->
      <div v-else>
        <h1>Something wrong in PlayerLobby.vue. waiting = {{ waiting }}</h1>
      </div>
    </v-container>
    <v-spacer/>
  </div>
</template>

<script>
import PlayerWaiting from '../components/PlayerLobby/PlayerWaiting'
import PlayerPlaying from '../components/PlayerLobby/PlayerPlaying'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'PlayerLobby',
  components: {
    PlayerWaiting,
    PlayerPlaying
  },
  computed: mapState({
    tournamentName: state => state.tournament.name,
    tournamentStart: state => state.tournament.start,
    tournamentEnd: state => state.tournament.end,
    playerName: state => state.player.name,
    points: state => state.player.points
  }),
  methods: {
    ...mapActions([
      'fetchPlayersTournament',
      'fetchPlayer'
    ])
  },
  data () {
    return {
      waiting: false
    }
  },
  mounted() {
    this.fetchPlayersTournament()
    this.fetchPlayer()
  }
}
</script>

<style scoped>

</style>
