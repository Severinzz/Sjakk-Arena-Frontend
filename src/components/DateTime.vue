<template>
  <div>
  <v-row>
    <v-col cols="11" sm="5">
      <!-- Start time -->
      <v-menu
        ref="menu"
        v-model="menuOpen"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="formattedDateTime"
            label="Dato og tid"
            readonly
            required
            v-on="on"
            @click="openDateMenu()"
          >
          </v-text-field>
        </template>
        <v-date-picker v-if="dateMenu" :min="currentDate" v-model="date">
          <v-btn text color="primary" :disabled="date === ''" @click="openTimeMenu()">OK</v-btn>
          <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="clearMenu()">Clear</v-btn>
        </v-date-picker>
        <v-time-picker
          v-if="timeMenu"
          v-model="time"
          full-width
          @click:minute="$refs.menu.save(dateTime) + okHandler()"
          :color="formColor"
          format="24hr"
        >
        </v-time-picker>
        </v-menu>
    </v-col>
  </v-row>
  </div>
</template>

<script>
export default {
  name: 'DateTime',
  data() {
    return {
      currentDate: new Date().toISOString().slice(0, 10),
      date: '',
      time: '',
      menuOpen: false,
      dateTime: '',
      dateMenu: false,
      timeMenu: false,
      formColor: 'blue'
    }
  },
  props: {
    eventName: { type: String }
  },
  methods: {
    openTimeMenu() {
      this.dateMenu = false
      this.timeMenu = true
    },
    openDateMenu() {
      this.dateMenu = true
      this.timeMenu = false
    },
    clearMenu() {
      this.date = ''
      this.time = ''
      this.dateTime = ''
    },
    okHandler() {
      console.log('afdsfdas' + this.dateTime)
      this.dateTime = this.date + 't' + this.time
      this.$emit(this.eventName, this.dateTime)
    }
  },
  computed: {
    formattedDateTime() {
      return this.date + '  ' + this.time
    }
  }
}
</script>

<style scoped>
div{
  margin-left: .2%;
}
</style>
