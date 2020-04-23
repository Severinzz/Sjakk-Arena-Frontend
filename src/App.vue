<template>
  <v-app>
      <div class="app-container">
      <AppHeader class="header"></AppHeader>
        <v-btn @click="Notification.permission = 'denied'"></v-btn>
      <TileHeaderSpace class="tile-space"></TileHeaderSpace>
        <div class="route-view">
      <router-view class=""></router-view>
          </div>
      <AppFooter class="footer"></AppFooter>
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

  created() {
    jwtService.addToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQTEFZRVIiLCJqdGkiOiI1OSJ9.ui-YSuskHGOdyo6MkZC-6lORNaU3KPcQ3uDtiv0fqC0')
    if (jwtService.getToken() !== null) {
      API_SERVICE.setHeader()
    }
    // console.log('serviceWorker' in navigator)
    // console.log('PushManager' in window)
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      // Registrer service worker

      // Unregister for hver gang. dvs I chrome gå til konsollen --> application --> service workers --> unregister localhost
      navigator.serviceWorker.register('/serviceworker.js').then(registration => {
        navigator.serviceWorker.ready.then(async function() {
          // Request notifiaction permission.
          switch (Notification.permission) {
            case 'granted':

              // Hent public key
              API_SERVICE.get('', 'pushnotification').then(res => {
                // let arr = Array.from(res.data)
                // let unit8Array = Uint8Array.from(arr)
                // console.log(unit8Array)
                // console.log('fuck')
                // console.log(res.data)
                // console.log(res.data)

                // Subscription options som må sendes.
                const subOptions = {
                  userVisibleOnly: true,
                  applicationServerKey: res.data
                }

                registration.pushManager.subscribe(subOptions).then(res => {
                  // console.log('---------------------------------------------')
                  // console.log(res)
                  // console.log(JSON.stringify(res))
                  // console.log(res.data)
                  // console.log(res.auth)
                  // console.log(res.endpoint)
                  // console.log(res.key)

                  // finnes bedre måter å gjør dette på.
                  let jsonString = JSON.stringify(res)
                  // console.log(res)
                  let job = JSON.parse(jsonString)
                  // console.log(job)

                  // Send subscription objektet.
                  API_SERVICE.post('pushnotification', job).then(res => {
                    console.log(res)
                  })
                })
                // res.data.arrayBuffer()
              })
              // .then(key => {
              //   const subOptions = {
              //     userVisibleOnly: true,
              //     applicationServerKey: key.data
              //   }
              //   console.log(subOptions)
              //   registration.pushManager.subscribe(subOptions)
              // })
              break
            case 'denied':
              console.warn('Treng tilgang til notifikasjoner for å gi besked om nytt spill er funnet.')
              break
            default:
              // console.log('weee wooo')
              // console.log(document.getElementById('root'))
              document.getElementById('root').style.opacity = '0.5'
              Notification.requestPermission().then(permission => {
                document.getElementById('root').style.opacity = '1'
                if (permission === 'granted') {
                } else {
                  console.warn('Treng tilgang til notifikasjoner for å gi besked om nytt spill er funnet.')
                }
              })
          }
        }).then(pushSubScription => {
          console.log(JSON.stringify(pushSubScription))
        })
      })
    }
  },
  beforeCreate() {
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
