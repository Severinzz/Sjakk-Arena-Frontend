<template>
    <div class="EnterTourney">
      <!-- Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
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
                {{ errorMessage }}
              </v-alert>
              <v-card class="elevation-12">
                <v-toolbar
                  color="primary"
                  dark
                  flat
                >
                  <v-toolbar-title>Fyll in game pin og spillenavn</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form
                    ref="form"
                    lazy-validation
                  >
                    <v-text-field v-model="gamePin"
                                  :min="0"
                                  :max="10000"
                                  :rules="[ v => !!v || 'Game Pin er påkrevd']"
                                  label="Game Pin"
                                  placeholder="1234"
                                  type="number"
                    />
                    <v-spacer></v-spacer>
                    <v-progress-circular
                      class="loadingCircle"
                      :size="50"
                      :width="7"
                      color="purple"
                      indeterminate
                      v-if="isLoading === true"
                    />
                    <v-text-field v-model="playerName"
                                  label="Spillernavn"
                                  placeholder="Ola Nordmann"
                                  :rules="[ v => !!v || 'Navn er påkrevd']"
                                  type="text"
                                  @keydown="limit"
                    />
                    <div id="error">{{ errorMessage }}</div>
                  </v-form>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="validate"
                    >
                      Delta
                    </v-btn>
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
import { mapActions } from 'vuex'
import { clearTokenAndStateMixin } from '../mixins/clearTokenAndState.mixin'

export default {
  name: 'EnterTourney',
  mixins: [
    clearTokenAndStateMixin
  ],
  data () {
    return {
      gamePin: '',
      playerName: '',
      errorAlertMessage: '',
      errorMessage: '',
      alertError: false,
      isLoading: false
    }
  },
  methods: {
    ...mapActions([
      'sendPlayer'
    ]),

    /**
     * Sends the game-pin and wanted nickname to the backend.
     * @returns {Promise<void>}
     */
    async submit() {
      this.isLoading = true
      let payload = {
        'name': this.playerName,
        'tournament': parseInt(this.gamePin)
      }
      await this.sendPlayer(payload).then(res => {
        this.isLoading = false
        // TODO: Dynamic routing
        this.$router.push('/player-lobby')
      }).catch(err => {
        this.isLoading = false
        if (err.response !== undefined) {
          this.alertError = false
          this.handleErrorResponse(err.response)
        } else {
          this.alertError = true
          this.errorMessage = err + '. Prøv igjen senere!'
        }
      })
    },

    /**
     * Sets the error message
     * @param response Axios error.response object
     */
    handleErrorResponse (response) {
      if (response.status === 409) {
        this.errorMessage = 'Navnet er tatt, prøv et nytt ett!'
      } else {
        this.errorMessage = 'Game pin finnes ikke!'
      }
    },

    /**
     * Validates the form
     */
    validate() {
      if (this.$refs.form.validate()) {
        this.submit()
      }
    },
    // https://stackoverflow.com/a/46290037
    limit(e) {
      if (this.playerName.length >= 20) {
        if (e.keyCode >= 48 || e.keyCode === 32) {
          e.preventDefault()
        }
      }
    }
    // End of stack overflow
  },
  watch: {
    playerName: function () {
      if (this.playerName.length > 20) {
        // https://stackoverflow.com/a/8499776
        this.playerName = this.playerName.substring(0, Math.min(this.playerName.length, 20))
      }
    }
  }
}
</script>

<style scoped>
  #error{
    color: #FF5252;
  }
  .loadingCircle{
    position: absolute;
    margin: -3% 0 0% 40%;
  }
</style>
