<template>
  <v-app>
      <div class="app-container">
        <app-header class="header"/>
        <tile-header-space class="tile-space"/>
          <alert-box
            v-if="error"
            :errorMessage="errorMessage"
            errorIcon="fas fa-plug"
          />
        <div class="route-view">
        <router-view
          class=""
          @error="showErrorMessage"
        />
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
import AlertBox from './components/AlertBox'

export default {
  name: 'App',
  components: { AlertBox, AppHeader, AppFooter, TileHeaderSpace },
  data() {
    return {
      error: false,
      errorMessage: ''
    }
  },
  created () {
    if (jwtService.getToken() !== null) {
      API_SERVICE.setHeader()
    }
  },
  methods: {
    showErrorMessage(err) {
      if (err.response === undefined) {
        this.error = true
        this.errorMessage = err + '. Prøv igjen senere!'
      } else {
        this.error = false
      }
    }
  },
  watch: {
    $route() {
      this.error = false
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
