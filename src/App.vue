<template>
  <v-app>
    <v-content transition="slide-x-transition">
      <AppHeader></AppHeader>
      <router-view></router-view>
      <AppFooter></AppFooter>
    </v-content>
  </v-app>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter }
}
</script>

<style>
</style>
