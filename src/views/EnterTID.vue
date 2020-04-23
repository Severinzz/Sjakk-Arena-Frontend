<template>
  <div class="EnterTID">
    <!-- // Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Fyll inn adminID</v-toolbar-title>
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
                <div id="error">{{ errorMessage }}</div>
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
import { mapActions, mapState } from 'vuex'
import { clearTokenAndStateMixin } from '../mixins/clearTokenAndState.mixin'

export default {
  name: 'enterTID',
  mixins: [
    clearTokenAndStateMixin
  ],
  data() {
    return {
      tournamentId: '',
      errorMessage: '',
      isLoading: false
    }
  },
  methods: {
    ...mapActions([
      'fetchTournament',
      'signInUUID',
      'deleteTokenAndSetStateToDefault'
    ]),
    async submit() {
      this.error = false
      this.isLoading = true
      let vm = this
      this.signInUUID(this.tournamentId).then(res => {
        vm.fetchTournament().then(res => {
          vm.isLoading = false
          if (vm.tournament.active) {
            this.$router.push('/tournament/' + `${vm.tournament.user_id}`)
          } else {
            this.$router.push('/lobby/' + `${vm.tournament.user_id}`)
          }
        })
      }).catch(err => {
        this.$emit('error', err)
        if (err.response !== undefined) {
          this.handleErrorResponse(err.response)
        }
      })
    },
    handleErrorResponse(response) {
      this.isLoading = false
      if (response.status === 404) {
        this.errorMessage = 'Denne IDen: "' + this.tournamentId + '", finnes ikke!'
      } else {
        this.errorMessage = 'Error code: ' + response.status + ', ' + response.data.message
      }
    }
  },
  computed: {
    ...mapState({
      tournament: state => state.tournament.tournament
    })
  }
}
</script>

<style scoped>
  .loadingCircle {
    margin-left: 45%;
  }
  #error{
    color: #FF5252;
  }
</style>
