<template>
  <div class="about">
    <div class="heading">
      <!-- Alert box used for network errors -->
      <v-alert
        class="sucsess"
        v-if="removed"
        :color="color"
        :icon="`fas fa-${icon}`"
        transition="scale-transition"
        data-cy="alert-box"
      >
        {{ removedMessage }}
      </v-alert>

      <!-- If player is no longer in the tournament -->
      <v-alert
        class="info-box"
        v-if="player !== null && !player.in_tournament" type="info"
        data-cy="info-box"
      >
        Spilleren er ikke i turneringen lenger
      </v-alert>

      <!-- player's name -->
      <h1
        class="name"
        v-if="player !== null"
        data-cy="name"
      >
        {{ player.name }}
      </h1>
      <!-- player's points -->
      <h2
        class="points"
        v-if="player !== null"
        data-cy="points"
      >
        Poeng: {{ player.points }}
      </h2>
    </div>
    <!-- Table containing the games of the player -->
    <div>
      <Table
        :objectList="games"
        :headingList="headingList"
        data-cy="table"
      />
      <v-btn
        class="error"
        :disabled="(player === null ? false : !player.in_tournament) || removed || player === null"
        data-cy="remove"
        @click="kickDialog = true"
      >
        Fjern spiller
      </v-btn>
    </div>
    <v-row
      class="justify-center"
      align="center"
    >
      <!-- A dialog box the tournament host can use to remove a player from the tournament -->
      <v-dialog
        v-model="kickDialog"
        max-width="650px"
      >
        <v-card>
          <v-card-title class="justify-center title">Oppgi begrunnelse for utkasting av spilleren</v-card-title>
          <v-card-text class="card-text">
            <p>Kan vær blankt, men annbefales å gi begrunnelse!</p>
            <v-text-field
              v-model="msg"
              label="Begrunnelse"
              required
              data-cy="reasoning"
            >
            </v-text-field>
          </v-card-text>
          <v-card-actions class="actions">
            <!-- Kick player dialog buttons. -->
            <v-btn
              text
              class="error"
              @click="removePlayerFromTournament"
              data-cy="remove-confirm"
            >
              OK
            </v-btn>
            <v-btn
              text
              outlined
              @click="kickDialog = false"
              data-cy="remove-cancel"
            >
              Avbryt
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import Table from '@/components/Table'
import { mapActions } from 'vuex'

export default {
  components: { Table },
  name: 'PlayerDetails',
  data() {
    return {
      player: null,
      removed: false, // whether the player is removed
      removedMessage: '', // A message shown when the player is removed
      msg: '', // a message sent to the removed player
      kickDialog: false, // whether to show the kick dialog
      color: '', // the color of the alert box
      icon: '', // the icon of the alert boc
      games: [], // the player's games
      headingList: [ // headings used in the game table
        {
          text: 'Bord',
          align: 'start',
          value: 'table'
        },
        {
          text: 'Farge',
          value: 'colour'
        },
        {
          text: 'Motstander',
          value: 'opponent'
        },
        {
          text: 'Resultat',
          value: 'result'
        },
        {
          text: 'Startet',
          value: 'start'
        }]
    }
  },
  methods: {
    ...mapActions([
      'removePlayer',
      'hostFetchPlayer',
      'fetchPlayersInactiveGames'
    ]),

    /**
     * Removes the player from the tournament
     */
    removePlayerFromTournament() {
      this.kickDialog = false
      let payload = {
        id: this.player.user_id,
        started: true,
        msg: this.msg !== '' ? this.msg : 'blank'
      }
      this.removePlayer(payload).then(res => {
        this.color = 'green'
        this.removedMessage = 'Spiller fjernet! Du kan nå lukke denne fanen'
        this.icon = 'check'
      }).catch(err => {
        this.handleError(err)
      })
      this.removed = true
    },

    /**
     * Sets the error message
     * @param response Axios error.response object
     */
    handleErrorResponse (response) {
      if (response.status === 400 || response.status === 403) {
        this.removedMessage = 'Feilmelding: ' + response.status + '. ' + 'Du har ikke tilgang til denne spilleren!'
      } else {
        this.removedMessage = 'Error code: ' + response.status + ', ' + response.data.message
      }
      this.icon = 'plug'
      this.color = 'error'
    },

    /**
     * Sets custom error message.
     * @param err Axios error.
     */
    handleError(err) {
      if (err.response !== undefined) {
        this.handleErrorResponse(err.response)
      } else {
        this.removedMessage = err + '. Prøv igjen senere!'
        this.icon = 'plug'
        this.color = 'error'
      }
    }
  },

  async created() {
    let payload = {
      id: this.$route.params.index
    }
    // Fetch player from backend
    await this.hostFetchPlayer(payload).then(res => {
      this.player = res.data
    }).catch(err => {
      this.handleError(err)
      this.removed = true
    })
    // Fetch the previous played games of the player.
    await this.fetchPlayersInactiveGames(payload).then(res => {
      this.games = res.data
    }).catch(err => {
      this.handleError(err)
    })
  }
}
</script>
<style scoped>
  /deep/ .table {
    max-width: 80%;
    margin: 2em auto;
  }

  /deep/ thead {
  }

  .about {
    text-align: center;
    margin-bottom: 1%;
  }

  .sucsess {
    max-width: 80%;
    margin: auto;
    text-align: center;
  }

  .card-text {
    justify-content: center;
    text-align: center;
  }

  .actions {
    justify-content: center;
  }
  .info-box{
    display: inline-block;
    margin: auto;
    min-width: 410px;
  }
  @media(max-width: 410px){
    .info-box{
      min-width: 100%;
    }
  }
</style>
