import { API_SERVICE } from '../../common/api'

export const actions = {
  /**
   * Upload a file to the server
   *
   * @param commit
   * @param file The file to upload
   */
  uploadFile ({ commit }, file) {
    if (!file) {
      return console.log('Please choose a image to upload.')
    }
    let formData = new FormData()
    formData.append('Image', file)
    console.log(file)
    API_SERVICE.post('/player/file/upload', formData).then(result => {
      console.log('Image uploaded sucessfully')
    }).catch(error => {
      console.log(error.message)
    })
  },
  /**
   * Fetches a files belonging to the specified gameID from the server
   *
   * @param gameID
   */
  async getImages ({ commit }, gameID) {
    try {
      let response = await API_SERVICE.get('/tournament/file/download/' + gameID, { responseType: 'arraybuffer' })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
