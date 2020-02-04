<template>
    <div class="EnterTourney">
      <AppHeader></AppHeader>
      <TileHeaderSpace></TileHeaderSpace>
      <v-content>
      <!-- Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Fyll in game pin og spillenavn</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="game_pin" hide-details :min="0" :max="10000" label="Game Pin" placeholder="1234" type="number"/>
                    <v-text-field v-model="playerName" label="Spillernavn" placeholder="Ola Nordmann" type="text"/>
                  </v-form>
                  <v-card-actions>
                    <v-spacer />
                    <router-link to="/">
                    <v-btn color="red" dark>Avbryt</v-btn>
                    </router-link>
                    <v-btn color="primary">Delta</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
      <AppFooter></AppFooter>
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import TileHeaderSpace from '@/components/TileHeaderSpace'

export default {
  name: 'EnterTourney',
  components: {
    AppHeader,
    TileHeaderSpace,
    AppFooter
  },
  props: {
    source: String
  },
  methods: {
  },
  data () {
    return {
      game_pin: '',
      playerName: ''
    }
  }
}
</script>

<style scoped>

</style>
