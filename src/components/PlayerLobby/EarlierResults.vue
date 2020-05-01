<template>
  <!-- https://codepen.io/anon/pen/mBwMrm?editors=1000 -->
  <v-card
    height="auto"
    class="pa-0"
  >
    <v-layout
      column
      fill-height
    >
      <v-toolbar
        dense
        flat
        class="primary"
      >
        <v-toolbar-title>Dine resultater</v-toolbar-title>
      </v-toolbar>
      <v-container
        fluid
        fill-height
      >
        <v-layout>
          <!-- https://stackoverflow.com/a/54836170/12885810 -->
          <v-alert
            type="error"
            v-if="error"
            >
            {{ errMsg }}
          </v-alert>
          <ul v-if="!error">
            <h6
              v-if="gameList.length == 0"
              class="body-1">
              Du har jo ikke spilt enda!</h6>
            <li
              v-for="(games, index) in gameList"
              v-bind:key="index"
            >
              <h6
                v-if="games.white_player_name === playerName"
                class="body-1"
              >
                Parti {{ gameList.length - index }}, Mot: {{ games.black_player_name }}
              </h6>
              <h6
                v-if="games.black_player_name === playerName"
                class="body-1"
              >
                Parti {{ gameList.length - index }}, Mot: {{ games.white_player_name }}
              </h6>
              <p
                v-if="games.white_player_name === playerName"
                class="body-2 resultDetails"
              >
                Farge: Hvit
              </p>
              <p
                v-if="games.black_player_name === playerName"
                class="body-2 resultDetails"
              >
                Farge: Sort
              </p>
              <!-- 1 = hvit seier, 0 = sort seier -->
              <p
                v-if="games.white_player_points == 1"
                class="body-2 resultDetails"
              >
                Resultat: Hvit Seier
              </p>
              <p
                v-if="games.white_player_point == 0.5"
                class="body-2 resultDetails"
              >
                Resultat: Remis
              </p>
              <p
                v-if="games.white_player_point == 0"
                class="body-2 resultDetails"
              >
                Resultat: Sort Seier
              </p>
              <p
                v-if="games.result === null"
                class="body-2 resultDetails"
              >
                Her har det skjedd en feil!
              </p>
              <v-divider inset/> <!-- Seperator line between elements -->
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
  data() {
    return {
      limit: 10,
      timeInterval: 5000,
      spillArray: [],
      error: false,
      errMsg: ''
    }
  },
  methods: {
    ...mapActions([
      'fetchResults'
    ]),
    loadResults () {
      this.intervalID = setInterval(this.requestEarlierResults, this.timeInterval)
    },
    requestEarlierResults() {
      this.fetchResults().then(res => {
        this.spillArray = res.data
      }).catch(err => {
        this.handleErr(err)
      })
    },
    handleErr(err) {
      this.error = true
      clearInterval(this.intervalID)
      if (err.response !== undefined) {
        this.handleErrorResponse(err.response)
      } else {
        this.errMsg = err + '. Prøv igjen senere!'
      }
    },
    handleErrorResponse(response) {
      if (response.status === 404) {
        this.errMsg = '404, finner ikke resultatlisten. Kontakt vert/systemansvarlig'
      } else {
        this.errMsg = 'Error code: ' + response.status + ', ' + response.data.message
      }
    }
  },
  computed: {
    gameList() {
      return this.limit ? this.spillArray.slice(0, this.limit) : this.result
    },
    ...mapState({
      playerName: state => state.players.player.name
    })
  },
  created () {
    this.requestEarlierResults()
    this.loadResults()
  },
  destroyed() {
    clearInterval(this.intervalID)
  }
}
</script>

<style scoped>
  ul {
    text-align: left;
  }

  .resultDetails {
    display: inline-flex;
    margin-right: 1.5em;
  }
</style>
