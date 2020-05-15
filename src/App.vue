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
import { API_SERVICE } from './common/api'
import AppFooter from './components/layout/AppFooter'
import AppHeader from './components/layout/AppHeader'
import TileHeaderSpace from './components/TileHeaderSpace'
import jwtService from './common/jwt.storage'

export default {
  name: 'App',
  components: { AppHeader, AppFooter, TileHeaderSpace },
  async created() {
    if (jwtService.getToken() !== null) {
      API_SERVICE.setHeader()
    }
    let sw
    await navigator.serviceWorker.getRegistrations(process.env.VUE_APP_SJAKK_ARENA_ROOT_PAGE).then(res => {
      sw = res
    })
    if (sw === undefined || sw.length < 1) {
      await navigator.serviceWorker.register('./serviceworker.js')
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
