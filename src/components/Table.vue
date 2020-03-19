<template>
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
        v-for="object in objectList"
        :key="object.name"
        @click="onClick(object)"
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
</template>

<script>
export default {
  name: 'Table',
  props: {
    objectList: { type: Array, required: true },
    attributeList: { type: Array, required: true },
    headingList: { type: Array, required: false },
    onClick: { type: Function, required: false }
  }
}
</script>

<style scoped>

</style>
