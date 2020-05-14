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
                    data-cy="play"
                  />
                  <menu-tile
                    tileText="Opprett turnering"
                    color="blue"
                    icon="fa-chess-board"
                    link="/tournament-creation"
                    data-cy="create-tournament"
                  />
                  <menu-tile
                    tileText="Logg på med adminID"
                    color="#dbf436"
                    icon="fa-id-card"
                    link="/enter-AID"
                    data-cy="login-adminID"
                  />
              </v-row>
            </v-col>
          </v-row>
        </v-container>
  </div>
</template>
<script>
// @ is an alias to /src
import MenuTile from '@/components/Props/MenuTile.vue'
import TileHeaderSpace from '@/components/Props/TileHeaderSpace'
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

<style scoped>
  ul {
    list-style: none;
  }
</style>
