<template>
  <div class="dateTimeContainer">
  <v-row>
    <v-col>
      <!-- Start time -->
      <v-menu
        ref="menu"
        v-model="menuOpen"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        absolute
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
            :rules="rules"
            @click="openDateMenu()"
            @change="onChange"
          >
          </v-text-field>
        </template>
        <v-date-picker
          full-width
          v-if="dateMenu"
          v-model="date"
          :min="minDate"
          :max="maxDate">
          <v-btn text
            color="primary"
            :disabled="date === ''"
            @click="openTimeMenu()">OK</v-btn>
          <v-btn text
            color="primary"
            @click="dateMenu = false">Cancel</v-btn>
          <v-btn text
                 color="primary"
                 @click="clearMenu()">Clear</v-btn>
        </v-date-picker>
        <v-time-picker
          v-if="timeMenu"
          v-model="time"
          format="24hr"
          full-width
          :min="calcMinTime"
          :max="maxTime"
          :color="formColor"
          @click:minute="$refs.menu.save(dateTime)"
          @click="onChange"
          @input="onChange"
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
    eventName: { type: String }, // Name of the event that should be emitted
    rules: { type: Array }, // Rules of the input field. See https://vuetifyjs.com/en/components/text-fields
    minTime: { type: String }, // The minimum time that can be picked
    minDate: { type: String }, // The minimum date that can be picked
    maxTime: { type: String }, // The highest the clock wil allow
    maxDate: { type: String } // The furthest calender wil allow
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
    onChange() {
      this.dateTime = this.date + 't' + this.time
      this.$emit(this.eventName, this.dateTime)
    }
  },
  computed: {
    formattedDateTime() {
      return this.date + '  ' + this.time
    },
    calcMinTime() {
      let currentDate = new Date().toISOString().slice(0, 10)
      if (this.date === currentDate) {
        return this.minTime
      }
      return null
    }
  }
}
</script>

<style scoped>
  .dateTimeContainer{
    width: 100%;
  }
</style>
