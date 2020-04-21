<template>
  <v-footer color="#f5f5f5">
    <p>Trenger du hjelp eller ønsker å vite mer om applikasjonen trykk
      <strong>
        <router-link to="/about" target="_blank">her.
        </router-link>
      </strong>
    </p>
    <v-spacer></v-spacer>
    <div>&copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>
<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
</style>
