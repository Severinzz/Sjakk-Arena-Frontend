<template>
  <v-alert
    color="red"
    dark
    :icon="errorIcon"
    transition="scale-transition">
    {{ errorMessage }}
  </v-alert>
</template>

<script>
export default {
  name: 'AlertBox',
  props: {
    errorMessage: {
      type: String,
      required: true
    },
    errorIcon: {
      type: String,
      required: true,
      validator: value => {
        return value.indexOf('fa-') > -1 // Checks if the icon is from fontawesome
      }
    }
  }
}
</script>

<style scoped>

</style>
