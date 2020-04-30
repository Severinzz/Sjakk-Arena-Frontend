<template>
  <div>
    <p>Test side for bilde opplasting, skal ikke være med i pull request!</p>
    <v-file-input
      :rules="rules"
      accept="image/png, image/jpeg, image/jpg"
      placeholder="Maks 10MB .PNG, .jpg eller .jpeg"
      prepend-icon="mdi-camera"
      label="Last opp sluttstilling"
      counter
      :show-size="1000"
      id="game_image"
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
    onFileSelected () {
      this.selectedFile = document.getElementById('game_image').files[0]
      if (!this.selectedFile) { return console.log('Ikke valgt fil.') }
      console.log(this.selectedFile)
    },
    uploadFile () {
      this.selectedFile = document.getElementById('game_image').files[0]
      const FD = new FormData()
      FD.append('image', this.selectedFile, this.selectedFile.name)
      this.sendGameImage(FD).then(res => {
        console.log('Sent ' + FD.get(this.selectedFile))
      })
    }
  }
}
</script>

<style scoped>

</style>
