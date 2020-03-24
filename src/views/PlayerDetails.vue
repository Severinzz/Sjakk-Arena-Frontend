<template>
  <div class="about">
    <div class="heading">
      <v-alert
        class="sucsess"
        v-if="removed"
        color="green"
        dark
        :icon="`fas fa-check`"
        transition="scale-transition">
        {{ okMessage }}
      </v-alert>
      <h1 class="name" v-if="player !== null"> {{ player.name }}</h1>
      <h2 class="points" v-if="player !== null">Poeng: {{ player.points }}</h2>
    </div>
    <div>
      <Table
        :objectList="playerList"
        :attributeList="attributeList"
        :headingList="headingList"
        :prPage="5"
        @entryClicked="handleEntryClicked"
      />
      <v-btn
        class="error"
        @click="removeFromTournamentPlayer"
      >Fjern spiller</v-btn>
    </div>
  </div>
</template>
<script>
import Table from '@/components/Table'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { Table },
  name: 'PlayerDetails',
  data () {
    return {
      player: null,
      removed: false,
      okMessage: 'Spiller fjernet!',
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
      headingList: ['table', 'white', 'black', 'score', 'start']
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
    removeFromTournamentPlayer() {
      let payload = {
        id: this.player.id,
        started: true
      }
      this.removePlayer(payload).then(res => {
        if (res.status === 200) {
          this.removed = true
        }
      })
    }
  },
  async created () {
    let payload = {
      id: this.$route.params.index
    }
    await this.hostFetchPlayer(payload).then(res => {
      this.player = res.data
    })
  }
}
</script>
<style scoped>
  /deep/ Table{
    max-width: 80%;
    margin: 2em auto;
  }
  /deep/ thead{
  }
  .about{
    text-align: center;
  }
  .sucsess{
    max-width: 80%;
    margin: auto;
    text-align: center;
  }
</style>
