import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import config from './config'
import jwt from './jwt.storage'

let socket
let client

const WEBSOCKET = {
  connect(path, callback) {
    init()
    client.connect(this.setupHeader(), function() {
      client.subscribe('/user/queue/' + path, callback)
    })
  },
  unsubscribe(subscriptionId) {
    client.unsubscribe(subscriptionId)
  },
  setupHeader() {
    return {
      'jwt': jwt.getToken()
    }
  }
}

function init() {
  socket = SockJS(config.API_URL + '/ws')
  client = Stomp.over(socket)
}

export default WEBSOCKET
