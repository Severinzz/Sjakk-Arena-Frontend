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

    <input type="file" style="display: none" @change="onFileSelected" ref="fileInput" capture="camera">
    <v-btn @click="$refs.fileInput.click()">Velg bilde</v-btn>
    <v-btn @click="uploadFile">Last opp bilde</v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Coverage as uploadEvent } from 'istanbul-lib-coverage'

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
      this.selectedFile = event.target.files[0]
      // this.selectedFile = document.getElementById('game_image').files[0]
      if (!this.selectedFile) { return console.log('Ikke valgt fil.') }
      console.log(this.selectedFile)
    },
    uploadFile () {
      if (!this.selectedFile) { return console.log('Vennligst velg et bilde') }
      const FD = new FormData()
      FD.append('image', this.selectedFile, this.selectedFile.name)
      this.sendGameImage(FD, {
        onUploadProgess: upLoadEvent => { console.log('Upload Progress: ' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%') } }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
