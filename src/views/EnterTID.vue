<template>
  <div class="EnterTID">
    <TileHeaderSpace></TileHeaderSpace>
    <v-content>
      <!-- // Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Fyll inn game pin</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <!-- No limits for the input field, might be needed to changed -->
                  <v-text-field v-model="game_pin" label="Game pin" placeholder="1337" type="text"/>
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" to="/">Send inn</v-btn>
                  <v-btn to="/">Avbryt</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import TileHeaderSpace from '@/components/TileHeaderSpace'
export default {
  name: 'enterTID',
  components: {
    TileHeaderSpace
  },
  data () {
    return {
      game_pin: ''
    }
  }
}
</script>

<style scoped>

</style>
