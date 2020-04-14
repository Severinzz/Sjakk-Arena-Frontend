<template>
  <!-- Adapted from https://vuetifyjs.com/en/components/simple-tables/ -->
  <div class="table">
    <div class="tableMenu">
      <v-select
        class="dropdown"
        v-model="prPage"
        :items="dropDownValues"
        :label="'Pr side'"
      />
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
  hide-default-footer
  > </v-data-table>
    <pagination-buttons
      :number-of-items="objectList.length"
      :pr-page="prPage"
      :autoScroll="autoScroll"
      :page.sync="page"
    ></pagination-buttons>
  </div>
</template>

<script>

import PaginationButtons from './PaginationButtons'

export default {
  name: 'Table',
  components: { PaginationButtons },
  props: {
    objectList: { type: Array, required: true },
    headingList: { type: Array, required: false },
    autoScrollOption: { type: Boolean, required: false, default: false }
  },
  data() {
    return {
      entryStart: 0,
      dropDownValues: [1, 5, 10, 15, 20, 25, 30, 50, 70, 100],
      switchLabel: 'Automatisk bla i tabell (30 sek)',
      autoScroll: false,
      page: 1,
      prPage: 5
    }
  },
  methods: {
    onEntryClicked(entry) {
      this.$emit('entryClicked', entry)
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
  .dropdown {
    max-width: 100px;
    display: inline-block;
  }
  .switch{
  display: inline-block;
  margin-left: 5em;
  }
  .tableMenu{
    display: flex;
  }
</style>
