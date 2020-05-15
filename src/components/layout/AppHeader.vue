<template>
  <v-toolbar
    extended
    app
    color="blue darken-4"
  >
    <img
      id="logo"
      alt="Sjakk arena Logo"
      :src="require('@/assets/Logo-v11.png')"
    >
  </v-toolbar>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
  #logo{
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    height: 200%;
  }
</style>
