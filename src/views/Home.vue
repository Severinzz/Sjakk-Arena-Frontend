<template>
  <div class="home">
    <TileHeaderSpace></TileHeaderSpace>
    <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-row align="center" justify="center">
                  <MenuTile tileText="Spill turnering" color="red" icon="fa-chess-knight" link="/enter-tourney"/>
                  <MenuTile tileText="Bruk Sjakkur" color="orange" icon="fa-chess-board" link="/chess-clock"/> <!-- TODO: make our own clock logo -->
                  <MenuTile tileText="Opprett turnering" color="blue" icon="fa-chess-board" link="/tournament-creation"/>
                  <MenuTile tileText="Skriv inn adminID" color="#dbf436" icon="fa-id-card" link="/enter-TID"/>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
  </div>
</template>
<script>
// @ is an alias to /src
import MenuTile from '@/components/MenuTile.vue'
import TileHeaderSpace from '@/components/TileHeaderSpace'
import { clearTokenAndStateMixin } from '../mixins/clearTokenAndState.mixin'
import WEBSOCKET from '../common/websocketApi'

export default {
  name: 'home',
  components: {
    MenuTile,
    TileHeaderSpace
  },
  mixins: [
    clearTokenAndStateMixin
  ],
  created() {
    WEBSOCKET.close()
  }
}
</script>
