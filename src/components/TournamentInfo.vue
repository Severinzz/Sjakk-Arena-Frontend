<template>
<div>
  <!-- Game pin -->
  <p class="pinTitle">PIN:</p>
  <p
    class="pin"
    data-cy="game-pin"
  >
    {{ tournament.user_id }}
  </p>

  <!-- Tournament name -->
  <h5 class="name">{{ this.tournament.tournament_name }} </h5>

  <!-- Tournament start time -->
  <p
    class="time"
    v-if="!started"
    data-cy="start-time"
  >
    Starter: {{ formatTime(this.tournament.start) }}
  </p>

  <!-- Tournament end time -->
  <p
    class="time"
    v-if="tournament.end"
    data-cy="end-time"
  >
    Slutter: {{ formatTime(this.tournament.end) }}
  </p>

  <!-- Tournament end date -->
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

    /**
     * Returns the date and time in the correct format.
     * @param dateTime Date and time string or Time string.
     * @returns {string|*} Retruns the formatted date and time string.
     */
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

    /**
     * Formats the end date
     * @returns {parser.Node[] | * | string} Formatted end date.
     */
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
