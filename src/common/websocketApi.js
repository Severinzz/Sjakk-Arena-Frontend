import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import config from './config'
import jwt from './jwt.storage'

let socket
let client
let subscriptions = {}

const WEBSOCKET = {
  /*
  Subscribes to the correct endpoint on the backend.
   */
  connect(newSubscriptions) {
    init()
    client.connect(this.setupHeader(), function() {
      for (let i in newSubscriptions) {
        subscriptions[newSubscriptions[i].path] = client.subscribe('/user/queue/' + newSubscriptions[i].path, newSubscriptions[i].callback)
        client.send('/app/' + newSubscriptions[i].path, function (msg) {})
      }
    })
  },
  /*
  Unsubscribe from the backend
  @param subscription An subscription object containing subscription id and a unsubscribe function.
   */
  unsubscribeAll() {
    for (let tag in subscriptions) {
      subscriptions[tag].unsubscribe()
      delete subscriptions[tag]
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
