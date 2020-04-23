<template>
  <!-- Adapted from https://vuetifyjs.com/en/components/grids/ -->
  <v-container class="content-wrapper mb-12" fluid>
    <v-row>
      <v-col cols="2">
        <div class="info-wrapper">
          <tournament-info
            :tournament="this.tournament"
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
              class="player"
              v-for="(player, index) in this.getAllPlayers"
              @click.native="handleRemovePlayer(player, player.user_id)"
              :player-name="player.name"
              :player-piece="player.icon"
              :key="index"
              :id="'player' + index"
            />
        </v-row>
      </v-col>
    </v-row>
    <warning-dialog
      title="Avslutt turneringen"
      action="avslutte tuneringen"
      :show-dialog="leaveWarn"
      carry-on-button-text="Avslutt turnering"
      @carryOn="endTournament()"
      @closeDialog="alterLeavePageDialogState"
    ></warning-dialog>
  </v-container>
</template>

<script>
import TournamentInfo from '@/components/TournamentInfo'
import Player from '@/components/Player'
import { mapActions, mapGetters, mapState } from 'vuex'
import WarningDialog from '@/components/WarningDialog'
import { leavePageWarningMixin } from '../mixins/leavePageWarning.mixin'
import { tournamentAndLobbyMixin } from '../mixins/tournamentAndLobby.mixin'
import WEBSOCKET from '../common/websocketApi'

export default {
  name: 'Lobby',
  components: {
    TournamentInfo,
    Player,
    WarningDialog
  },
  mixins: [
    leavePageWarningMixin,
    tournamentAndLobbyMixin
  ],
  data () {
    return {
      intervalId: '',
      active: false,
      leaveWarn: false,
      pathVar: 'lobby/'
    }
  },
  computed: {
    ...mapGetters([
      'getPlayerCount',
      'getAllPlayers'
    ]),
    ...mapState({
      tournament: state => state.tournament.tournament,
      isTournamentActive: state => state.tournament.activeTournament
    }),
    playerCount() {
      return this.getPlayerCount
    }
  },
  methods: {
    ...mapActions([
      'removePlayer',
      'addPlayer',
      'fetchTournament',
      'unsubscribeAll',
      'sendStartRequest',
      'subscribeToPlayers',
      'subscribeToTournamentActive'
    ]),
    handleRemovePlayer (player, id) {
      let payload = {
        player: player,
        id: id,
        msg: '' // Custom message player should receive when they are kicked. Is optional/future feature.
      }
      this.removePlayer(payload)
    },
    cancel() {
      this.$router.go(-1)
    },
    startTournament() {
      this.sendStartRequest()
        .then(res => {
          this.$router.replace('/tournament/' + this.tournament.user_id)
        }).catch(err => {
          this.$emit('error', err)
        })
    },
    endTournament() {
      this.$router.push('/')
    },
    alterLeavePageDialogState() {
      this.leaveWarn = !this.leaveWarn
    }
  },
  watch: {
    playerCount: function(playerCount) {
      if (this.tournament.early_start !== true) { } else {
        if (playerCount >= 2) {
          this.startTournament()
        }
      }
    },
    isTournamentActive: function (active) {
      if (active) {
        this.startTournament()
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'tournament') {
      WEBSOCKET.unsubscribe('tournament/players')
    } else {
      WEBSOCKET.unsubscribeAll()
    }
    next()
  }
}
</script>

<style scoped>
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
  /deep/ .player-wrapper {
    margin: auto 5% auto 5%
  }
</style>
