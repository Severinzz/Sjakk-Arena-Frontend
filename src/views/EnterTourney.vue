<template>
    <div class="EnterTourney">
      <!-- Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Fyll in game pin og spillenavn</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-text-field v-model="gamePin"
                                  :min="0"
                                  :max="10000"
                                  :rules="[ v => !!v || 'Game Pin er påkrevd']"
                                  label="Game Pin"
                                  placeholder="1234"
                                  type="number"
                    />
                    <v-spacer></v-spacer>
                    <v-text-field v-model="playerName"
                                  label="Spillernavn"
                                  placeholder="Ola Nordmann"
                                  :rules="[ v => !!v || 'Navn er påkrevd']"
                                  type="text"
                    />
                    <div id="error">{{ errorMessage }}</div>
                  </v-form>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="validate">Delta</v-btn>
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
export default {
  name: 'EnterTourney',
  components: {
  },
  props: {
    source: String
  },
  methods: {
    ...mapActions([
      'createPlayer'
    ]),
    async submit() {
      let payload = {
        'name': this.playerName,
        'tournament': parseInt(this.gamePin)
      }
      await this.createPlayer(payload).then(res => {
        this.$router.push('/player-lobby')
      }).catch(err => {
        console.log(err)
        this.errorMessage = 'Er game pin riktig? Prøv et annet spillernavn!'
      })
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.submit()
      }
    }
  },
  data () {
    return {
      gamePin: '',
      playerName: '',
      errorMessage: ''
      // TODO avgrense input felt
    }
  }
}
</script>

<style scoped>
  #error{
    color: #FF5252;
  }
</style>
