export const leavePageWarningMixin = {
  methods: {
    setupBrowserWarning() {
      /*
          Send warning to user when back button is pressed.
          adapted from from: https://stackoverflow.com/questions/12381563/how-to-stop-browser-back-button-using-javascript
        */
      let VM = this
      window.location.hash = this.pathVar
      window.location.hash = this.pathVar // Varsel vil nå dukke opp to ganger
      window.onhashchange = function() {
        window.onpopstate = function() { VM.alterLeavePageDialogState() }
      }
    },
    fuckof() {
      alert('fuckof')
    }
  }
}
