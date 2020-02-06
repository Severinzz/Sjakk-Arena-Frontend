<template>
  <v-app>
    <v-content transition="slide-x-transition">
      <AppHeader></AppHeader>
      <TileHeaderSpace></TileHeaderSpace>
      <router-view></router-view>
      <AppFooter></AppFooter>
    </v-content>
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import TileHeaderSpace from './components/TileHeaderSpace'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, TileHeaderSpace }
}
</script>

<style>
</style>
