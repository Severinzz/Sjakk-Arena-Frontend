<template>
  <v-app>
      <div class="app-container">
        <app-header class="header"/>
        <tile-header-space class="tile-space"/>
        <div class="route-view">
          <router-view/>
        </div>
        <app-footer class="footer"/>
    </div>
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter'
import AppHeader from './components/AppHeader'
import TileHeaderSpace from './components/TileHeaderSpace'
import { API_SERVICE } from './common/api'
import jwtService from './common/jwt.storage'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, TileHeaderSpace },
  created () {
    if (jwtService.getToken() !== null) {
      API_SERVICE.setHeader()
    }
  }
}
</script>

<style>
  .v-application--wrap{
    min-height: 0 !important;
  }
  .app-container{
    flex-direction: column;
    display: flex;
    height: 97vh;
  }
   .header{
     max-height: 112px;
  }
  .route-view{
    flex: 1 0 auto;
  }
  .footer{
    flex-shrink: 0;
    margin-bottom: -1.2%;
  }
</style>
