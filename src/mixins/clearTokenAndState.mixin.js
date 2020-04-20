export const clearTokenAndStateMixin = {
  created() {
    this.$store.dispatch('resetAllStatesAndToken')
  }
}
