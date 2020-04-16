<template>
    <v-card
    :color="color"
    height="50%"
    class="mx-3"
    @click="clicked"
    :style="cardStyle"
    >
      <v-card-text
        :class="color === 'white' ? 'black--text' : 'white--text'"
        class="text-center display-3"> {{ time }}</v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'ChessClockButton',
  props: {
    color: String,
    rotate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      time: '80:00',
      timeColor: 'red'
    }
  },
  methods: {
    clicked: function () {
    }
  },
  computed: {
    cardStyle () {
      if (this.rotate) {
        return { transform: 'rotate(' + 180 + 'deg)' }
      }
      return ''
    }
  }
}
</script>

<style scoped>
</style>
