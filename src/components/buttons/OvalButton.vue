<template>
  <v-btn
    class="btn"
    :color="buttonColor"
    block
    rounded
    depressed
    @click="buttonClicked"
  >
    {{ text }}
  </v-btn>

</template>

<script>
export default {
  name: 'OvalButton',
  props: {
    primary: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    buttonColor: function () {
      if (this.primary) {
        return 'primary'
      } else {
        return ''
      }
    }
  },
  methods: {
    buttonClicked: function () {
      this.$emit('buttonClicked')
    }
  }
}
</script>

<style scoped>
  .btn {
    margin-top: 0.5em;
  }
</style>
