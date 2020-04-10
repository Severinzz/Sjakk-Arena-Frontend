<template>
  <div class="EnterTID">
    <!-- // Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <alert-box
            v-if="error"
            :errorMessage="errorMessage"
            :errorIcon="'fas fa-plug'"
          />
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Fyll inn turneringsID</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-progress-circular
                  class="loadingCircle"
                  :size="50"
                  :width="7"
                  color="purple"
                  indeterminate
                  v-if="isLoading === true"
                ></v-progress-circular>
                <!-- No limits for the input field, might be needed to changed -->
                <v-text-field v-model="tournamentId" label="TurneringsID" placeholder="1337" type="text"/>
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="submit">Send inn</v-btn>
                <v-btn to="/">Avbryt</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AlertBox from '../components/AlertBox'
export default {
  name: 'enterTID',
  components: {
    AlertBox
  },
  data () {
    return {
      tournamentId: '',
      errorMessage: '',
      error: false,
      isLoading: false
    }
  },
  methods: {
    ...mapActions([
      'fetchTournament',
      'signInUUID',
      'deleteTokenAndSetStateToDefault'
    ]),
    ...mapGetters([
      'getTournament'
    ]),
    ...mapMutations([
      'clearPlayers'
    ]),
    async submit() {
      this.error = false
      this.isLoading = true
      let vm = this
      this.signInUUID(this.tournamentId).then(res => {
        vm.fetchTournament().then(res => {
          vm.isLoading = false
          let tournament = vm.getTournament()
          if (tournament.active) {
            this.$router.push('/tournament/' + `${tournament.user_id}`)
          } else {
            this.$router.push('/lobby/' + `${tournament.user_id}`)
          }
        })
      }).catch(err => {
        this.isLoading = false
        this.error = true
        if (err.response.status === 404) {
          this.errorMessage = 'Denne IDen: "' + this.tournamentId + '", finnes ikke!'
        } else {
          this.errorMessage = 'Error code: ' + err.response.status + ', ' + err.response.data.message
        }
      })
    },
    created() {
      this.clearPlayers()
      this.deleteTokenAndSetStateToDefault()
    }
  }
}
</script>

<style scoped>
  .loadingCircle{
    margin-left: 45%;
  }
</style>
