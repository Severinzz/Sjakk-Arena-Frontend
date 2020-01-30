<template>
    <v-card :color="color"
            :to="`/about`"
            tile=true width="20vw" height="20vw" max-height="300px" max-width="300px"
            min-height="230px" min-width="230px" class="ma-2" >
      <v-card-title class="justify-center">
        <span>{{choice}}</span>
      </v-card-title>
      <v-img :src="require('@/assets/' + imageName + '')"></v-img>
    </v-card>
</template>

<script>
export default {
  name: 'MenuTile',
  props: {
    choice: String,
    color: String,
    imageName: String
  }
}
</script>

<style scoped>
</style>
