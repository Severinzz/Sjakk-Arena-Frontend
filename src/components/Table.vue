<template>
  <!-- Adapted from https://vuetifyjs.com/en/components/simple-tables/ -->
  <div class="table">
    <div class="tableMenu">
    <v-switch
      class="switch"
      v-if="autoScrollOption"
      v-model="autoScroll"
      :label="switchLabel"
    />
    </div>
  <v-data-table
  :headers="headingList"
  :items="objectList"
  @click:row="onEntryClicked"
  :page.sync="page"
  :items-per-page.sync="prPage"
  >
  </v-data-table>
  </div>
</template>

<script>

export default {
  name: 'Table',
  props: {
    objectList: { type: Array, required: true },
    headingList: { type: Array, required: false },
    autoScrollOption: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      entryStart: 0,
      switchLabel: 'Automatisk bla i tabell (30 sek)',
      autoScroll: false,
      page: 1,
      prPage: 10
    }
  },
  methods: {
    onEntryClicked(entry) {
      this.$emit('entryClicked', entry)
    }
  },
  computed: {
    lastButton () {
      let lastButton = Math.ceil(this.objectList.length / this.prPage)
      return lastButton > 0 ? lastButton : 1
    }
  },
  watch: {
    autoScroll: function(autoScroll) {
      const VM = this
      if (autoScroll) {
        this.intervalId = setInterval(function () {
          VM.page === VM.lastButton ? VM.page = 1 : VM.page = VM.page + 1
        }, 30000)
      } else {
        clearInterval(this.intervalId)
      }
    }
  }
}
</script>

<style scoped>
  td{
  text-align: left;
  }
  th{
    color: black !important;
    font-size: 17px;
    background-color: rgb(200, 200, 200);
  }
  .switch{
  display: inline-block;
  margin-left: 5em;
  }
  .tableMenu{
    display: flex;
  }
</style>
