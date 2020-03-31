<template>
  <v-container class="content-wrapper" fluid>
    <v-row>
      <v-col cols="2">
        <div class="info-wrapper">
          <tournament-info
            :tournament="this.getTournament"
            :started="false"
          />
          <p class="numberOfPlayers">
            Antall spillere: {{ playerCount }}
          </p>
          <div class="button-wrapper">
            <v-btn
              id="start"
              color="primary"
              class="mr-4"
              @click="startTournament">
              Start
            </v-btn>
            <v-btn id="cancel"
                   class="mr-4"
                   @click="cancel">
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
          v-if="this.getAllPlayers.length !== undefined"
        >
          <!-- The individual players -->
            <player
              v-for="(player, index) in this.getAllPlayers"
              @click.native="handleRemovePlayer(player, player.id)"
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Lobby',
  components: {
    TournamentInfo,
    Player
  },
  data () {
    return {
      intervalId: '',
      subscribed: false,
      subscription: 'players'
    }
  },
  computed: {
    ...mapGetters([
      'getPlayerCount',
      'getTournament',
      'getAllPlayers'
    ]),
    playerCount() {
      return this.getPlayerCount
    }
  },
  methods: {
    ...mapActions([
      'fetchPlayers',
      'removePlayer',
      'addPlayer',
      'fetchTournament',
      'unsubscribe'
    ]),
    handleRemovePlayer (player, id) {
      let payload = {
        player: player,
        id: id,
        msg: '' // Custom message player should receive when they are kicked. Is optional
      }
      this.removePlayer(payload)
    },
    cancel() {
      this.$router.go(-1)
    },
    startTournament() {
      this.$router.replace('/tournament/' + this.getTournament.id)
    }
  },
  watch: {
    playerCount: function(playerCount) {
      if (this.getTournament.early_start !== true) { } else {
        if (playerCount >= 2) {
          this.startTournament()
        }
      }
    }
  },

  async created () {
    let started = false
    if (this.getTournament.tournament_name === undefined) {
      await this.fetchTournament()
    }
    this.fetchPlayers(started)
  },
  destroyed () {
    this.unsubscribe(this.subscription)
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
