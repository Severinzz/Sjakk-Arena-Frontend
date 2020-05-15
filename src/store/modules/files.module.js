import { API_SERVICE } from '../../common/api'

export const actions = {
  /**
   * Upload a file to the server
   *
   * @param commit
   * @param file The file to upload
   */
  async uploadFile ({ commit }, file) {
    if (file !== undefined) {
      let formData = new FormData()
      formData.append('Image', file)
      await API_SERVICE.post('/player/file/upload', formData)
    }
  },
  /**
   * Fetches a files belonging to the specified gameID from the server
   *
   * @param gameID
   */
  async getImages ({ commit }, gameID) {
    try {
      let response = await API_SERVICE.getWithParam('/tournament/file/download/' + gameID, { responseType: 'arraybuffer' })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
