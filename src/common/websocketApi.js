import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import config from './config'
import jwt from './jwt.storage'

let socket
let client
let subscriptions = {}
let connected

const WEBSOCKET = {
  /*
  Subscribes to the correct endpoint on the backend.
   */
  connect(path, tag, callback) {
    // If a stomp is connected to the backend, just subscribe. Else connect to the backend and subscribe.
    if (connected === true) {
      subscriptions[tag] = client.subscribe('/user/queue/' + path, callback)
      client.send('/app/' + path, function (msg) {})
    } else {
      init()
      client.connect(this.setupHeader(), function() {
        connected = true
        subscriptions[tag] = client.subscribe('/user/queue/' + path, callback)
        client.send('/app/' + path, function (msg) {})
      })
    }
  },
  /*
  Unsubscribe from the backend
  @param subscription An subscription object containing subscription id and a unsubscribe function.
   */
  unsubscribe(subscription) {
    if (subscriptions[subscription] !== undefined) {
      subscriptions[subscription].unsubscribe()
      delete subscriptions[subscription]
    }
  },
  /*
  Checks if a websocket is open, does nothing if not. Closes the socket if there is one open
   */
  close() {
    if (socket !== null && socket !== undefined) {
      socket.close()
      connected = false
    }
  },
  setupHeader() {
    return {
      'jwt': jwt.getToken()
    }
  }
}

/*
Initialises the socket. Connect to backend
 */
function init() {
  socket = SockJS(config.API_URL + '/ws')
  client = Stomp.over(socket)
}

export default WEBSOCKET
