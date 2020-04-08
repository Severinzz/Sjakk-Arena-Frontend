<template>
  <!-- Adapted from https://vuetifyjs.com/en/components/simple-tables/ -->
  <div class="table">
    <v-select
      class="dropdown"
      v-model="prPage"
      :items="dropDownValues"
      :label="'Pr side'"
    />
  <v-simple-table>
    <template v-slot:default>
      <thead>
      <tr>
        <th
        v-for="heading in headingList"
        :key="heading">
          {{ heading }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="object in slicedList"
        :key="object.id"
        @click="onEntryClicked(object)"
      >
        <td
          v-for="attribute in attributeList"
          :key="attribute">
          {{ object[attribute] }}
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
    <pagination-buttons
      :number-of-items="objectList.length"
      :pr-page="prPage"
      @pageChanged="handlePageChange"
    ></pagination-buttons>
  </div>
</template>

<script>
import PaginationButtons from './PaginationButtons'
import _ from 'lodash'

export default {
  name: 'Table',
  components: { PaginationButtons },
  props: {
    objectList: { type: Array, required: true },
    attributeList: { type: Array, required: true },
    headingList: { type: Array, required: false },
    prPage: { type: Number, required: false, default: 5 }
  },
  data() {
    return {
      entryStart: 0,
      dropDownValues: [1, 5, 10, 15, 20, 25, 30, 50, 70, 100]
    }
  },
  methods: {
    onEntryClicked(entry) {
      this.$emit('entryClicked', entry)
    },
    // From code with mosh, React course pagination (https://codewithmosh.com/courses/357787/lectures/5706707)
    handlePageChange(page) {
      this.entryStart = (page - 1) * this.prPage
    }
  },
  computed: {
    slicedList() {
      // From code with mosh, React course pagination (https://codewithmosh.com/courses/357787/lectures/5706707)
      return _(this.objectList).slice(this.entryStart).take(this.prPage).value()
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
  }
</style>
