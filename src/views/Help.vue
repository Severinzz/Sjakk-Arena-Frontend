<template>
  <div id="helpRoot">
  <v-tabs
    v-model="tab"
    color="#910002"
    grow
      >
        <v-tab
          v-for="item in items"
          :key="item"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          VERT
        </v-tab-item>

        <v-tab-item>
          SPILLER
        </v-tab-item>

        <v-tab-item>
          <NotificationHelp v-if="browserHasNotifications"/>
          <div v-if="!browserHasNotifications">
          <h1 class="not-supported">
            Beklager! Din enhet eller nettleser støtter ikke push-varsler
          </h1>
          <h3>
            Om du mener dette er feil, kontakt system ansvarlig
          </h3>
          </div>
        </v-tab-item>
      </v-tabs-items>
  </div>
</template>

<script>
import NotificationHelp from '../components/NotificationHelp'
export default {
  name: 'Help',
  components: { NotificationHelp },
  data () {
    return {
      tab: 2,
      items: [
        'Vert', 'Spiller', 'Notifikasjoner'
      ],
      browserHasNotifications: 'PushManager' in window && 'Notification' in window && 'serviceWorker' in navigator
    }
  }
}
</script>

<style scoped>
  .active-tab{
    background-color: #626e60;
  }
  .not-supported{
    color: red
  }
  #helpRoot{
    text-align: center;
  }
</style>
