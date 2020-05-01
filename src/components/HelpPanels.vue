<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="item in data" :key="item.title">
      <v-expansion-panel-header>{{ item.title }}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="content-container"
             v-for="(image, index) in item.images"
             :key="index+10">
          <img :src="image"/>
          <p>
            {{ item.texts[index] }}
          </p>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'HostHelp.vue',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
  .content-container{
    display: grid !important;
    grid-gap: 50px;
    text-align: left;
    grid-auto-flow: column dense;
  }
  h3{
    max-width: 60%;
    margin: auto auto 5% auto;
  }
  img{
    grid-column: 1/2;
    max-width: 100%;
    height: auto;
    margin-bottom: 50px
  }
  p{
    grid-column: 2/2;
  }
  h1{
    margin: 2% auto 2% auto;
  }
  @media(max-width: 800px){
    p{
      grid-column: 1/2;
      grid-row: 1/2;
    }
    img{
      grid-row: 2/2;
    }
    h3{
      max-width: 90%;
    }
  }
  @media(min-width: 801px){
    img{
      min-width: 450px;
    }
  }
</style>
