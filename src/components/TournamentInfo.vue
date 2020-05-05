<template>
<div>
  <p class="pinTitle">PIN:</p>
  <p class="pin">
    {{ tournament.user_id }}
  </p>
  <h5 class="name">{{ this.tournament.tournament_name }} </h5>
  <p
    class="time"
    v-if="!started"
  >
    Starter: {{ formatTime(this.tournament.start) }}
  </p>
  <p
    class="time"
    v-if="tournament.end"
  >
    Slutter: {{ formatTime(this.tournament.end) }}
  </p>
  <p
    class="date"
    v-if="endDate"
  >
    Dato: {{ formatEndDate() }}
  </p>
</div>
</template>

<script>
export default {
  name: 'TournamentInfo',
  props: {
    tournament: {
      type: Object,
      required: true,
      validator: value => {
        const valueHasId = value.user_id !== undefined || null
        const valueHasName = value.tournament_name !== '' || undefined || null
        const hasStartTime = value.start !== ''
        return valueHasId && valueHasName && hasStartTime
      }
    },
    started: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    endDate() {
      if (this.tournament.end !== undefined && this.tournament.end !== null) {
        let endDate = this.formatEndDate()
        let currentDate = new Date().toISOString().slice(0, 10)
        return endDate !== currentDate
      }
      return false
    }
  },
  methods: {
    // Returns the start time in the correct format.
    formatTime(dateTime) {
      if (dateTime.includes('loading')) {
        return dateTime
      }
      let timeArr
      if (dateTime.includes('T')) {
        timeArr = dateTime.split('T')
      } else {
        timeArr = dateTime.split(' ')
      }
      if (timeArr.length > 1) {
        return timeArr[1].substring(0, 5)
      } else {
        return timeArr[0]
      }
    },
    formatEndDate() {
      if (this.tournament.end.includes('T')) {
        return this.tournament.end.split('T')[0]
      } else {
        return this.tournament.end.split(' ')[0]
      }
    }
  }
}
</script>
<style scoped>
  div{
    display: inline-block;
    margin: auto;
  }
  .pinTitle{
    font-size: 3.5em;
    font-weight: bold;
  }
  .pin{
    font-size: 5.5em;
    font-weight: bold;
  }
  .time{
    margin: 10% 0 5% 0;
    font-size: 3em;
  }
  .date{
    font-size: 2em;
  }
  .name{
    font-size: 3em;
  }
</style>
