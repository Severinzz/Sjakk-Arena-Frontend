<template>
<div>
  <p class="pinTitle">PIN:</p>
  <p class="pin">
    {{ tournament.user_id }}
  </p>
  <h5 class="name">{{ this.tournament.tournament_name }} </h5>
  <p class="time" v-if="!started">
    Starter: {{ formatTime(this.tournament.start) }}
  </p>
  <p class="time" v-if="tournament.end">
    Slutter: {{ formatTime(this.tournament.end) }}
  </p>
  <p class="date" v-if="endDate">
    Dato: {{ formatEndDate() }}
  </p>
  <warning-dialog
    :title="endDialogTitle"
    action="avslutte turneringen"
    carry-on-button-text="Avslutt turnering"
    :show-dialog="endDialog"
    @carryOn="endTournament"
    @closeDialog="alterEndDialogState">
  </warning-dialog>
</div>
</template>

<script>
import WarningDialog from '../components/WarningDialog'

export default {
  name: 'TournamentInfo',
  props: {
    tournament: { type: Object, required: true },
    started: { type: Boolean, required: true }
  },
  components: {
    WarningDialog
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
  data () {
    return {
      pathVar: '',
      endDialog: false,
      endDialogTitle: 'Avslutt turnering'
    }
  },
  methods: {
    // Returns the start time in the correct format.
    formatTime(dateTime) {
      if (dateTime.includes('loading')) { return dateTime }
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
    },
    alterEndDialogState() {
      this.endDialog = !this.endDialog
      this.endDialogTitle = 'Avslutt turnering'
    },
    endTournament() {
      this.sendEndRequest().then(res => {
        this.$router.push('/')
      })
    },
    /*
      Set pathVar to correct value, if tournament is started or not.
     */
    setPathVar() {
      if (this.started) {
        this.pathVar = 'tournament/'
      } else {
        this.pathVar = 'lobby/'
      }
    }
  },
  mounted() {
    this.setPathVar()
    /*
      Send warning to user when back button is pressed.
      adapted from from: https://stackoverflow.com/questions/12381563/how-to-stop-browser-back-button-using-javascript
    */
    let VM = this
    let tournamentPin = window.location.href.split('/').pop()
    // above adapted from: https://developer.mozilla.org/en-US/docs/Web/API/Window/location
    // and https://stackoverflow.com/questions/4092325/how-to-remove-part-of-a-string-before-a-in-javascript
    // hent det som er etter siste '/'-tegnet
    window.location.hash = this.pathVar + tournamentPin
    window.location.hash = this.pathVar + tournamentPin // Varsel vil nå dukke opp to ganger
    window.onhashchange = function() {
      window.onpopstate = function() { VM.alterEndDialogState() }
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
    margin: 20% 0 10% 0;
    font-size: 3em;
  }
  .date{
    font-size: 2em;
  }
  .name{
    font-size: 3em;
  }
</style>
