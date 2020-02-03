<template>
  <div class="home">
    <AppHeader></AppHeader>
    <TileHeaderSpace></TileHeaderSpace>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-row
                align="center"
                justify="center"
              >
                <router-link to="/about">
                  <MenuTile choice="Spill turnering" color="red" icon="fa-chess-knight"></MenuTile>
                </router-link>
                <router-link to="/about">
                  <MenuTile choice="Opprett turnering" color="blue" icon="fa-chess-board"></MenuTile>
                </router-link>
                <router-link to="/enterTID">
                  <MenuTile choice="Skriv inn turneringsID" color="deep-purple" icon="fa-id-card"></MenuTile>
                </router-link>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
    <AppFooter></AppFooter>
  </div>
</template>
<script>
// @ is an alias to /src
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import MenuTile from '@/components/MenuTile.vue'
import TileHeaderSpace from '@/components/TileHeaderSpace'

export default {
  name: 'home',
  components: {
    TileHeaderSpace,
    AppHeader,
    AppFooter,
    MenuTile
  }
}
</script>
