<template>
  <div class="EnterAdminID">
    <!-- // Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-alert
            type="error"
            v-if="alertError"
          >
            {{ alertErrorMessage }}
          </v-alert>
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Fyll inn adminID</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form
                ref="form"
                lazy-validation
              >
                <v-progress-circular
                  class="loadingCircle"
                  :size="50"
                  :width="7"
                  color="purple"
                  indeterminate
                  data-cy="loadingCircle"
                  v-if="isLoading === true"
                />
                <!-- No limits for the input field, might be needed to changed -->
                <v-text-field
                  v-model="adminID"
                  label="adminID"
                  placeholder="1337"
                  type="text"
                  :rules="adminIdRules"
                  required
                  data-cy="adminId"
                />
                <div id="error">{{ errorMessage }}</div>
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="submit"
                  data-cy="submit"
                >
                  Send inn
                </v-btn>
                <v-btn
                  to="/"
                  data-cy="cancel"
                >
                  Avbryt
                </v-btn>
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
import { clearTokenAndStateMixin } from '@/mixins/clearTokenAndState.mixin'

export default {
  name: 'EnterAdminID',
  mixins: [
    clearTokenAndStateMixin
  ],
  data() {
    return {
      adminID: '',
      errorMessage: '',
      isLoading: false,
      alertError: false,
      adminIdRules: [
        v => !!v || 'Du må skrive inn adminID'
      ]
    }
  },
  methods: {
    ...mapActions([
      'fetchTournament',
      'signInUUID',
      'deleteTokenAndSetStateToDefault'
    ]),

    /**
     * Sends the AdminID.
     * @returns {Promise<void>}
     */
    async submit() {
      if (this.$refs.form.validate()) {
        this.error = false
        this.isLoading = true
        let vm = this
        this.signInUUID(this.adminID).then(res => {
          vm.fetchTournament().then(res => {
            vm.isLoading = false
            if (vm.tournament.active) {
              this.$router.push('/tournament/' + `${vm.tournament.user_id}`)
            } else {
              this.$router.push('/lobby/' + `${vm.tournament.user_id}`)
            }
          })
        }).catch(err => {
          this.isLoading = false
          if (err.response !== undefined) {
            this.handleErrorResponse(err.response)
          } else {
            this.errorMessage = ''
            this.alertError = true
            this.alertErrorMessage = err + '. Prøv igjen senere!'
          }
        })
      }
    },

    /**
     * Sets the error message
     * @param response Axios error.response object
     */
    handleErrorResponse(response) {
      this.isLoading = false
      if (response.status === 404) {
        this.alertError = false
        this.errorMessage = 'Denne IDen: "' + this.adminID + '", finnes ikke!'
      } else {
        this.errorMessage = ''
        this.alertErrorMessage = 'Error code: ' + response.status + ', ' + response.data.message
        this.alertError = true
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
