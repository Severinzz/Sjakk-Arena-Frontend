<template>
  <v-container class="content-wrapper" fluid>
    <v-row>
      <v-col cols="2">
        <div class="info-wrapper">
          <tournament-info
            :tournament="tournament"
            :started="false"
          />
          <p class="numberOfPlayers">
            Antall spillere: {{ this.getPlayerCount }}
          </p>
          <div class="button-wrapper">
            <v-btn id="start" color="primary" class="mr-4">
              Start
            </v-btn>
            <v-btn id="cancel" class="mr-4">
              Avbryt
            </v-btn>
          </div>
        </div>
      </v-col>
      <!-- The player list. Offset to better fit smaller screens -->
      <v-col
        offset="5"
        offset-sm="3"
        offset-md="2"
        offset-lg="1"
        offset-xl="0"
      >
        <v-row
          align="start"
          justify="start"
          class="text-center"
        >
          <!-- The individual players -->
            <player
              v-for="(player, index) in players"
              @click.native="handleRemovePlayer(index, player.id)"
              :player-name="player.name"
              :player-piece="player.icon"
              :key="index"
              :id="'player' + index"
            />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import Player from '@/components/Player'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'Lobby',
  components: {
    TournamentInfo,
    Player
  },
  data () {
    return {
      intervalId: ''
    }
  },
  computed: {
    // TODO: Use mapGetters instead?
    ...mapState([
      'tournament',
      'players'
    ]),
    ...mapGetters([
      'getPlayerCount'
    ])
  },
  methods: {
    ...mapActions([
      'fetchPlayers',
      'removePlayer',
      'addPlayer',
      'fetchTournament'
    ]),
    handleRemovePlayer (index, id) {
      let payload = {
        index: index,
        path: '/tournament/delete-player/',
        id: id
      }
      this.removePlayer(payload)
    },
    loadPlayers(reference) {
      this.intervalId = setInterval(async function() {
        await reference.fetchPlayers('/tournament/player-lobby-information').then(res => {
        }).catch(err => {
          throw err
        })
      }, 3000)
    }
  },
  mounted() {
    this.loadPlayers(this)
  },
  created () {
    if (this.tournament.tournament_name === undefined) {
      this.fetchTournament()
    }
  },
  destroyed () {
    clearInterval(this.intervalId)
  }

}
</script>

<style>
  .content-wrapper {
    padding: 0 0 2% 0;
  }

  .numberOfPlayers {
    font-size: 1.5em;
  }

  .info-wrapper {
    text-align: center;
    display: inline-block;
    height: 100%;
    padding-top: 20%;
    margin: auto auto auto 10%;
  }

  .button-wrapper {
    margin: 5% 1% 0 1%;
    display: inline-block;
  }

  div.col {
    height: 100%;
    padding: 0;
  }
</style>
