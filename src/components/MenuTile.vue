<template>
    <v-card :color="color"
            :to="to"
            :tile=true
            width="20vw" height="20vw" max-height="300px" max-width="300px"
            min-height="230px" min-width="230px" class="ma-2" >
      <v-card-title class="justify-center">
        <span>{{ tileText }}</span>
      </v-card-title>
      <div id="tile-icon">
        <i :class="[commonClass, icon]"></i>
      </div>
    </v-card>
</template>

<script>
export default {
  name: 'MenuTile',
  props: {
    tileText: String,
    color: String,
    icon: String,
    to: String
  },
  data: function() {
    return {
      commonClass: 'fas fa-7x'
    }
  }
}
</script>

<style scoped>
  #tile-icon{
    text-align:center;
    margin-top:10%;
  }
</style>
