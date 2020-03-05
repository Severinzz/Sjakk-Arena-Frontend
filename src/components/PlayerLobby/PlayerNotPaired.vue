<template>
  <!-- This is loaded while user waits for a match -->
    <span>
      <h3 class="gameDetail">Vent mens vi setter opp et parti for deg!</h3>
      <!-- https://vuetifyjs.com/en/components/progress-circular -->
      <v-progress-circular
        :size="70"
        :width="7"
        color="indigo"
        indeterminate
        class="progress_style"
      ></v-progress-circular>
    </span>
</template>

<script>
export default {
  name: 'PlayerNotPaired'
}
</script>

<style scoped>
  .gameDetail{
    margin-top: 1.2em;
  }
  .progress_style{
    margin-top: 10px;
  }
</style>
