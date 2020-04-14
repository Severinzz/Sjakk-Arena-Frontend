<template>
  <div class="about">
    <div class="heading">
      <v-alert
        class="sucsess"
        v-if="removed"
        :color="color"
        dark
        :icon="`fas fa-${icon}`"
        transition="scale-transition">
        {{ removedMessage }}
      </v-alert>
      <h1 class="name" v-if="player !== null"> {{ player.name }}</h1>
      <h2 class="points" v-if="player !== null">Poeng: {{ player.points }}</h2>
    </div>
    <div>
      <Table
        :objectList="playerList"
        :headingList="headingList"
        @entryClicked="handleEntryClicked"
      />
      <v-btn
        class="error"
        @click="kickDialog = true"
      >Fjern spiller
      </v-btn>
    </div>
    <v-row class="justify-center" align="center">
      <v-dialog v-model="kickDialog" max-width="650px">
        <v-card>
          <v-card-title class="justify-center title">Oppgi begrunnelse for utkasting av spilleren</v-card-title>
          <v-card-text class="card-text">
            <p>Kan vær blankt, men annbefales å gi begrunnelse!</p>
            <v-text-field
              v-model="msg"
              label="Begrunnelse"
              required>
            </v-text-field>
          </v-card-text>
          <v-card-actions class="actions">
            <!-- User has the option to either leave or go back -->
            <v-btn text class="error" @click="removePlayerFromTournament">OK</v-btn>
            <v-btn text outlined @click="kickDialog = false">Avbryt</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import Table from '@/components/Table'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { Table },
  name: 'PlayerDetails',
  data() {
    return {
      player: null,
      removed: false,
      removedMessage: '',
      msg: '',
      kickDialog: false,
      color: '',
      icon: '',
      // TODO: FETCH FROM SERVER
      playerList: [{
        id: 1,
        table: 1,
        name: 'Magnus',
        opponent: 'Anand',
        score: '1-0',
        start: '20:30'
      }, {
        id: 2,
        table: 1,
        name: 'Magnus',
        opponent: 'Ding Liren',
        score: '0-1',
        start: '20:30'
      }, {
        id: 3,
        table: 1,
        name: 'Magnus',
        opponent: 'Maxim VL',
        score: '0-1',
        start: '20:30'
      }, {
        id: 4,
        table: 1,
        name: 'Magnus',
        opponent: 'Wang Hao',
        score: '1-0',
        start: '20:30'
      }, {
        id: 5,
        table: 1,
        name: 'Magnus',
        opponent: '(ノಠ益ಠ)ノ彡┻━┻',
        score: '0.5-0.5',
        start: '20:30'
      }, {
        id: 6,
        table: 1,
        name: 'Magnus',
        opponent: '(ノಠ益ಠ)ノ彡┻━┻',
        score: '1-0',
        start: '20:30'
      }],
      attributeList: ['table', 'name', 'opponent', 'score', 'start'],
      headingList: [
        {
          text: 'Bord',
          align: 'start',
          value: 'table'
        },
        {
          text: 'Hvit',
          value: 'name'
        },
        {
          text: 'Sort',
          value: 'opponent'
        },
        {
          text: 'Poeng',
          value: 'score'
        },
        {
          text: 'Startet',
          value: 'start'
        }]
    }
  },
  methods: {
    ...mapGetters([
      'getAllPlayers'
    ]),
    ...mapActions([
      'removePlayer',
      'hostFetchPlayer'
    ]),
    handleEntryClicked(game) {
      alert(game)
    },
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
        if (err.response.status === 400) {
          this.removedMessage = 'Denne spilleren tilhører ikke din turnering!'
        } else {
          this.removedMessage = 'Noe gikk galt'
        }
        this.icon = 'plug'
        this.color = 'error'
      })
      this.removed = true
    }
  },
  async created() {
    let payload = {
      id: this.$route.params.index
    }
    await this.hostFetchPlayer(payload).then(res => {
      this.player = res.data
    }).catch(err => {
      this.icon = 'plug'
      this.color = 'error'
      this.removed = true
      if (err.response.status === 400) {
        this.removedMessage = 'Feilmelding: ' + err.response.status + '. ' + 'Du har ikke tilgang til denne spilleren, eller den finnes ikke!'
      } else {
        this.removedMessage = 'Error code: ' + err.response.status + ', ' + err.response.data.message
      }
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
</style>
