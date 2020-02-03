<template>
    <div class="EnterTourneyPin">
      <AppHeader></AppHeader>
      <TileHeaderSpace></TileHeaderSpace>
      <v-content>
      <!-- // Kilde: https://github.com/vuetifyjs/vuetify/blob/master/packages/docs/src/layouts/layouts/demos/centered.vue -->
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Fill in game pin and you name.</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="numberValue" hide-details label="Game pin" name="gamePin" type="number"/>
                    <v-text-field label="Player name" name="playerName" type="text"/>
                  </v-form>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="error">Cancel</v-btn>
                    <v-btn color="success">Enter Game</v-btn>
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

export default {
  name: 'EnterTourney',
  components: {
    AppHeader,
    AppFooter
  },
  props: {
    source: String
  }
}
</script>

<style scoped>

</style>
