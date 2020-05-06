<template>
  <div>
    <v-container>
      <!-- Let the system decide what to load when we are waiting -->
      <!-- https://vuejs.org/v2/guide/conditional.html -->
      <div v-if="!isTournamentActive">
        <player-waiting
          :tournament-name="tournamentName"
          :tournament-start="tournamentStart"
          :tournament-end="tournamentEnd"
          :player-name="playerName"
          :points="points"
        />
      </div>

      <!-- Let the system decide what to load when we are not waiting -->
      <div v-else-if="isTournamentActive">
        <player-playing
          :tournament-name="tournamentName"
          :tournament-start="tournamentStart"
          :tournament-end="tournamentEnd"
          :player-name="playerName"
          :points="points"
        />
      </div>

      <!-- Something goes wrong -->
      <div v-else>
        <h1>Something wrong in PlayerLobby.vue. isTournamentActive = {{ activeTournament }}</h1>
      </div>

      <v-row
        class="justify-center"
        align="center"
      >
        <v-dialog
          v-model="kickedDialog"
          max-width="650px"
        >
          <v-card>
            <v-card-title class="justify-center title">Du har blitt kastet ut av turneringen!</v-card-title>
            <v-card-text class="card-text">
              <h2 v-if="kickedMessage !== ''"> Begrunnelse: {{ kickedMessage }}</h2>
              <h3> Går tilbake til startsiden om: </h3>
              <h1> {{ countDownNr }} </h1>
            </v-card-text>
            <v-card-actions>
              <!-- User has the option to either leave or go back -->
              <v-btn
                text
                color="primary"
                outlined
                @click="navigateHome"
              >
                Gå tilbake nå
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
    <v-spacer/>
  </div>
</template>

<script>
import PlayerWaiting from '../components/PlayerLobby/PlayerWaiting'
import PlayerPlaying from '../components/PlayerLobby/PlayerPlaying'
import storage from '../common/jwt.storage'
import WEBSOCKET from '../common/websocketApi'
import { mapActions, mapState } from 'vuex'
import { API_SERVICE } from '../common/api'

export default {
  name: 'PlayerLobby',
  components: {
    PlayerWaiting,
    PlayerPlaying
  },
  data() {
    return {
      waiting: false,
      kickedMessage: '',
      countDownNr: 15,
      intervalId: '',
      kickedDialog: false
    }
  },
  computed: {
    ...mapState({
      tournament: state => state.tournament,
      tournamentName: state => state.tournament.tournament.name,
      tournamentStart: state => state.tournament.tournament.start,
      tournamentEnd: state => state.tournament.tournament.end,
      isTournamentActive: state => state.tournament.activeTournament,
      playerName: state => state.players.player.name,
      points: state => state.players.points
    })
  },
  methods: {
    ...mapActions([
      'fetchPlayersTournament',
      'fetchPlayer',
      'subscribeToTournamentActive',
      'subscribeToActiveGame',
      'subscribeToPoints',
      'subscribeToSuggestedResult',
      'subscribeToPlayerKicked'
    ]),
    /**
     * Counts down, navigate home when finished.
     */
    countDown() {
      this.countDownNr--
      if (this.countDownNr === 0) {
        clearInterval(this.intervalId)
        this.kickedDialog = false
        this.navigateHome()
      }
    },
    /**
     * Navigate home.
     */
    navigateHome() {
      this.kickedDialog = false
      storage.deleteToken()
      clearInterval(this.intervalId)
      this.$router.replace('/')
    },
    /**
     * Start the kicked dialog countdown.
     */
    startCountDown() {
      this.intervalId = setInterval(this.countDown, 1000)
    },
    /**
     * Returns the public key from backend.
     * @returns {Promise<AxiosResponse<T>>} Axios promis. Contains public key.
     */
    fetchPublicKey() {
      return API_SERVICE.get('', 'pushnotification')
    },
    /**
     * Returns the service worker registration from the current page.
     * @returns {Promise<ReadonlyArray<ServiceWorkerRegistration>>}. Service worker registration from the current page.
     */
    getRegistration() {
      return navigator.serviceWorker.getRegistrations(process.env.VUE_APP_SJAKK_ARENA_ROOT_PAGE)
    },
    /**
     * Returns subscription from browser's push manager
     * @param registration Service worker registration
     * @param applicationServerKey Publickey from the backend.
     * @returns {Promise<PushSubscription>} Push subscription from the browsers push manager.
     */
    getSubscription(registration, applicationServerKey) {
      const subOptions = {
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      }
      return registration.pushManager.subscribe(subOptions)
    },
    /**
     * Send subscription object to backend.
     * @param subscription Subscription object from the browser.
     */
    sendSubscription(subscription) {
      API_SERVICE.post('pushnotification', subscription)
    },
    /**
     * Subscribes to push notifications
     */
    subscribeToPushNotifications() {
      this.fetchPublicKey().then(publicKey => {
        this.getRegistration().then(registration => {
          this.getSubscription(registration[0], publicKey.data).then(subscription => {
            this.sendSubscription(JSON.parse(JSON.stringify(subscription)))
          })
        })
      })
    },
    /**
     * Adapted from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
     * Unsubscribe from push notifications.
     * @returns {Promise<void>}
     */
    async unsubscribePushNotification() {
      await navigator.serviceWorker.ready.then(async reg => {
        await reg.pushManager.getSubscription().then(async subscription => {
          if (subscription !== null) {
            await subscription.unsubscribe().then(async res => {
              await API_SERVICE.delete('pushnotification', 'unsubscribe').then(res => {
              })
            }).catch(error => {
              console.log(error)
            })
          }
        })
      })
    },
    /**
     * Checks notification permission.
     * Granted: Start subscription chain.
     * Denied: Display warning in console
     * Ask(default): Ask for permission, start subscription chain if granted.
     * @returns {Promise<void>}
     */
    async setupPushNotifications() {
      const VM = this
      if ('PushManager' in window && 'Notification' in window) {
        await navigator.serviceWorker.ready.then(async function () {
          // Request notifiaction permission.
          switch (Notification.permission) {
            case 'granted':
              VM.subscribeToPushNotifications()
              break
            case 'denied':
              console.warn('Treng tilgang til notifikasjoner for å gi besked om nytt spill er funnet.')
              break
            default:
              // Make site "transparent" while user decides. To make "decision box" be more in focus.
              document.getElementById('root').style.opacity = '0.5'
              Notification.requestPermission().then(permission => {
                document.getElementById('root').style.opacity = '1'
                if (permission === 'granted') {
                  VM.subscribeToPushNotifications()
                } else {
                  console.warn('Treng tilgang til notifikasjoner for å gi besked om nytt spill er funnet.')
                }
              })
          }
        })
      }
    }
  },
  created() {
    this.fetchPlayersTournament()
    this.fetchPlayer()
    let vm = this
    let callback = function (res) {
      vm.kickedMessage = res.body
      vm.kickedDialog = true
      vm.startCountDown()
    }
    this.subscribeToTournamentActive({ userRole: 'player' })
    this.subscribeToActiveGame()
    this.subscribeToPoints()
    this.subscribeToSuggestedResult()
    this.subscribeToPlayerKicked(callback)
    this.setupPushNotifications()
  },
  async beforeRouteLeave(to, from, next) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      await this.unsubscribePushNotification()
    }
    next()
  },
  destroyed() {
    WEBSOCKET.unsubscribeAll()
    WEBSOCKET.close()
  }
}
</script>

<style scoped>
  button {
    margin: auto
  }

  .card-text {
    justify-content: center;
    text-align: center;
  }

  h1 {
    margin-top: 1em;
  }

  h3 {
    margin-top: 1em;
  }

  .title {
    word-break: keep-all;
  }
</style>
