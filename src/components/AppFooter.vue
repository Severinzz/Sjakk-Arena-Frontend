<template>
  <v-footer color="#f5f5f5">
    <div class="footerTxt">
      <!-- help page -->
      <ul>
      <router-list-element
        link="/help"
        text="Hjelp"
      />
      <!-- about page -->
      <router-list-element
        link="/about"
        text="Om Sjakkarena"
      />
      <!-- chess clock -->
      <router-list-element
        link="/chess-clock"
        text="Sjakkur"
      />
      </ul>
    </div>
    <v-spacer></v-spacer>
    <div>&copy; {{ new Date().getFullYear() }}</div>
  </v-footer>
</template>
<script>

import RouterListElement from './Utilities/RouterListElement'

export default {
  name: 'AppFooter',
  components: { RouterListElement }
}
</script>

<style scoped>
  .footerTxt {
    font-size: 15px;
    margin-left: 10vw;
  }
  ul{
    list-style: none!important;
    color: black!important;
  }
</style>
