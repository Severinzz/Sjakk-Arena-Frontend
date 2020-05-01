<template>
  <div class="home">
    <TileHeaderSpace></TileHeaderSpace>
    <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-row
                align="center"
                justify="center"
              >
                  <menu-tile
                    tileText="Spill turnering"
                    color="red"
                    icon="fa-chess-knight"
                    link="/enter-tourney"
                  />
                  <menu-tile
                    tileText="Bruk Sjakkur"
                    color="orange"
                    icon="fa-stopwatch"
                    link="/chess-clock"
                    />
                  <menu-tile
                    tileText="Opprett turnering"
                    color="blue"
                    icon="fa-chess-board"
                    link="/tournament-creation"
                  />
                  <menu-tile
                    tileText="Skriv inn adminID"
                    color="#dbf436"
                    icon="fa-id-card"
                    link="/enter-AID"
                  />
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
