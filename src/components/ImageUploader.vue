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
      @change="onFileSelected"
      />
    <v-btn @click="uploadFile">Last opp bilde</v-btn>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  data: () => ({
    selectedFile: null,
    rules: [
      value => !value || value.size < 10000000 || 'Bildet må være mindre enn 10 MB!'
    ]
  }),
  methods: {
    onFileSelected (event) {
      this.selectedFile = event.target.files[0]
      console.log(this.selectedFile)
    },
    uploadFile () {
      const FD = new FormData()
      FD.append('image', this.selectedFile, this.selectedFile.name)
    }
  }
}
</script>

<style scoped>

</style>
