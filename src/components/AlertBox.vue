<template>
  <v-alert
    color="red"
    dark
    :icon="this.errorIcon"
    transition="scale-transition">
    {{ errorMessage }}
  </v-alert>
</template>

<script>
export default {
  name: 'AlertBox',
  props: {
    errorMessage: { type: String, required: true },
    errorIcon: { type: String, required: true }
  }
}
</script>

<style scoped>

</style>
