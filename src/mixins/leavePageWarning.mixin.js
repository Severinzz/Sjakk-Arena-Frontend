import WEBSOCKET from '../common/websocketApi'

export const leavePageWarningMixin = {
  data() {
    return {
      leaveDialog: false,
      wantToLeave: null
    }
  },
  methods: {

    /**
     * Alter the leave warning dialog viability state.
     */
    alterLeavePageDialogState() {
      this.wantToLeave = false
      this.leaveDialog = !this.leaveDialog
      this.$router.push(this.pathVar).catch(res => { this.wantToLeave = null })
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.wantToLeave === null) {
      this.leaveDialog = true
      next(false)
    } else if (this.wantToLeave) {
      WEBSOCKET.unsubscribeAll()
      next()
    } else {
      this.wantToLeave = null
      next(from.fullPath)
    }
  }
}
