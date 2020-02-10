<template>
  <!-- This is loaded while user waits for a match -->
    <span>
      <p class="gameDetail">Vent mens vi setter opp et parti for deg!</p>
      <!-- https://vuetifyjs.com/en/components/progress-circular -->
      <v-progress-circular
        :size="70"
        :width="7"
        color="indigo"
        indeterminate
      ></v-progress-circular>
    </span>
</template>

<script>
export default {
  name: 'Player!Paired'
}
</script>

<style scoped>
  .gameDetail{
    margin-top: 1.2em;
  }
</style>
