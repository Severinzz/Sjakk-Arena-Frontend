<template>
  <!-- https://codepen.io/anon/pen/mBwMrm?editors=1000 -->
      <v-card height="auto" class="pa-0">
        <v-layout column fill-height>
          <v-toolbar dense class="primary">
            <v-toolbar-title>Dine resultater</v-toolbar-title>
          </v-toolbar>
          <v-container fluid fill-height>
            <v-layout>
              <!-- https://stackoverflow.com/a/54836170/12885810 -->
              <ul>
                <h6 v-if="gameList.length == 0" class="body-1">Du har jo ikke spilt enda!</h6>
                <li v-for="(games, index) in gameList" v-bind:key="index">
                  <h6 v-if="games.white_player_name === playerName" class="body-1">
                    Parti: {{gameList.length - index}} Mot: {{games.black_player_name}}
                  </h6>
                  <h6 v-if="games.black_player_name === playerName" class="body-1">
                    Parti: {{gameList.length - index}} Mot: {{games.white_player_name}}
                  </h6>
                  <p v-if="games.white_player_name === playerName" class="body-2 dumdum">Farge: Hvit</p>
                  <p v-if="games.black_player_name === playerName" class="body-2 dumdum">Farge: Sort</p>
                  <!-- 1 = hvit seier, 0 = sort seier -->
                    <p v-if="games.result == 1" class="body-2 dumdum">Resultat: Hvit Seier</p>
                    <p v-if="games.result == 0.5" class="body-2 dumdum">Resultat: Remis</p>
                    <p v-if="games.result == 0" class="body-2 dumdum">Resultat: Sort Seier</p>
                  <p v-if="games.result === null" class="body-2 dumdum">Her har den sjedd en feil!</p>
                  <v-divider inset></v-divider> <!-- Seperator line between elements -->
                </li>
              </ul>
            </v-layout>
          </v-container>
        </v-layout>
      </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'EarlierResults',
  data () {
    return {
      limit: 10,
      timeInterval: 3000,
      spillArray: []
    }
  },
  methods: {
    ...mapActions([
      'fetchResults',
      'fetchPlayer'
    ]),
    loadResults () {
      const VM = this
      this.intervalID = setInterval(async function () {
        await VM.fetchResults().then(res => {
          VM.spillArray = res.data
          console.log(VM.spillArray)
        }).catch(err => {
          throw err
        })
      }, this.timeInterval)
    },
    initialResults () {
      const VM = this
      this.fetchResults().then(res => {
        VM.spillArray = res.data
      })
    }
  },
  computed: {
    gameList () {
      return this.limit ? this.spillArray.slice(0, this.limit) : this.result
    },
    ...mapState({ playerName: state => state.player.name })
  },
  Created () {
    this.loadResults()
  },
  destroyed () {
    clearInterval(this.intervalID)
  },
  mounted () {
    this.initialResults()
    this.loadResults()
  }
}
</script>

<style scoped>
  ul {
    text-align: left;
  }

  .dumdum {
    display: inline-flex;
    margin-right: 1.5em;
  }
</style>
