<template>
  <div>
    <p>Test side for bilde opplasting, skal ikke være med i pull request!</p>
    <v-file-input
      :rules="rules"
      v-model="selectedFile"
      accept="image/png, image/jpeg, image/jpg"
      placeholder="Maks 10MB .PNG, .jpg eller .jpeg"
      prepend-icon="mdi-camera"
      label="Last opp sluttstilling"
      counter
      :show-size="1000"
      @change="onFileSelected"
      />
    <v-btn @click="uploadFile">Last opp bilde</v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ImageUploader',
  data: () => ({
    selectedFile: null,
    data: null,
    rules: [
      value => !value || value.size < 10000000 || 'Bildet må være mindre enn 10 MB!'
    ]
  }),
  methods: {
    ...mapActions([
      'sendGameImage'
    ]),
    onFileSelected (event) {
      if (!this.selectedFile) { return console.log('Ikke valgt fil.') }
      this.selectedFile = event.target.files[0]
      console.log(this.selectedFile)
    },
    uploadFile () {
      if (!this.selectedFile) { this.data = 'Ingen bilde valgt.'; return this.data }
      const VM = this
      const FD = new FormData()
      FD.append('image', this.selectedFile, this.selectedFile.name)
      VM.sendGameImage(FD, 13).then(res => {
        console.log('Sent')
      })
    }
  }
}
</script>

<style scoped>

</style>
