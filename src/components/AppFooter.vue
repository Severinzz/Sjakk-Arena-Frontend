<template>
  <v-footer color="#f5f5f5">
    <div class="footerTxt">Trenger du hjelp eller ønsker å vite mer om applikasjonen
      <strong>
        <router-link to="/about" target="_blank"> trykk her.
        </router-link>
      </strong>
    </div>
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
  .footerTxt {
    font-size: 12px;
  }
</style>
