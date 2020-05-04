<template>
  <div>
    <!-- Notification navigation tabs -->
    <v-tabs
      v-model="tab"
      color="#910002"
      grow
    >
      <v-tab
        v-for="item in data"
        :key="item.title">
        <v-icon>
          {{ item.icon }}
        </v-icon>
        <v-icon v-if="item.icon2">
          {{ item.icon2}}
        </v-icon>
        <v-label v-if="item.label">
          {{ item.label }}
        </v-label>
      </v-tab>
    </v-tabs>
    <!-- Checkbox to tell if notifications is available or not -->
    <v-tabs-items class="content" v-model="tab">
      <v-checkbox class="checkbox"
                  :label="checkBoxLabel"
                  disabled
                  v-model="notificationsEnabled"
      />
      <!-- Notification content -->
      <v-tab-item v-for="(item, index) in data"
                  :key="index">
      <h1>
        {{item.title}}
      </h1>
        <h3 v-if="item.description">
          {{ item.description }}
        </h3>
        <!-- Image and text container -->
        <div class="content-container" v-for="(image, index) in item.images"
             :key="index+10">
        <img :src="image"
             :title="item.altTags[index]"
             :alt="item.altTags[index]"/>
        <p>
          {{ item.texts[index] }}
        </p>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import notificationHelpPageData from '@/data/notificationHelpPageData'

export default {
  name: 'NotificationHelp',
  data () {
    return {
      tab: null,
      notificationsEnabled: Notification.permission === 'granted',
      data: notificationHelpPageData
    }
  },
  computed: {
    /**
     * Changes text-box label.
     * @returns {string} String that tells user if they have activated notifications or not
     */
    checkBoxLabel() {
      return this.notificationsEnabled ? 'Du har aktivert notfikasjoner' : 'Du har ikke aktivert notifikasjoner'
    }
  }
}
</script>

<style scoped>
  .content{
    justify-content: center;
  }
  .content-container{
    margin: auto 5% auto 5%;
    display: grid;
    grid-gap: 50px;
    text-align: left;
    grid-auto-flow: column dense;
  }
  h3{
    max-width: 60%;
    margin: auto auto 5% auto;
  }
  img{
    grid-column: 1/2;
    max-width: 100%;
    height: auto;
    min-width: 300px;
    margin-bottom: 50px
  }
  p{
    grid-column: 2/2;
  }
  .checkbox{
    display: inline-block;
  }
  h1{
    margin: 2% auto 2% auto;
  }
  @media(max-width: 800px){
    p{
      grid-column: 1/2;
      grid-row: 1/2;
    }
    img{
      grid-row: 2/2
    }
    h3{
      max-width: 90%;
    }
  }
</style>
