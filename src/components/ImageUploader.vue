<template>
  <div>
    <p>Test side for bilde opplasting, skal ikke være med i pull request!</p>

    <input type="file" style="display: none" @change="onFileSelected" ref="fileInput" capture="camera">
    <v-btn @click="$refs.fileInput.click()">Velg bilde</v-btn>

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
      if (!this.selectedFile) { return console.log('Ikke valgt fil.') }
      this.uploadFile()
    },
    uploadFile () {
      if (!this.selectedFile) {
        return console.log('Vennligst velg et bilde')
      }
      const formData = new FormData()
      formData.append('Image', this.selectedFile, this.selectedFile.name)
      this.sendGameImage(formData, {
        onUploadProgess: upLoadEvent => {
          console.log('Upload Progress: ' + Math.round(uploadEvent.loaded / uploadEvent.total * 100) + '%')
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
