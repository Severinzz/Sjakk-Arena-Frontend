import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import config from './config'
import jwt from './jwt.storage'

let socket = {}
let client = {}
let subscriptions = {}
let initialised = false
let subQueue = []
let connected = 3

const Connection = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}

const WEBSOCKET = {
  /*
  Subscribes to the correct endpoint on the backend.
   */
  connect(newSubscription) {
    if (initialised === false) {
      init()
    }
    switch (connected) {
      case Connection.CONNECTING:
        subQueue.push(newSubscription)
        break
      case Connection.OPEN:
        this.subscribe(newSubscription)
        break
      default:
        connected = 0
        client.connect(this.setupHeader(), function () {
          connected = 1
          subscriptions[newSubscription.path] = client.subscribe('/user/queue/' + newSubscription.path, newSubscription.callback)
          client.send('/app/' + newSubscription.path, function (msg) {
          })
          subToQueue()
        })
    }
  },
  subscribe(newSubscription) {
    subscriptions[newSubscription.path] = client.subscribe('/user/queue/' + newSubscription.path, newSubscription.callback)
    client.send('/app/' + newSubscription.path, function (msg) {
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
    if (typeof socket.close === 'function') {
      socket.close()
      initialised = false
      connected = 3
    }
  },
  setupHeader() {
    return {
      'jwt': jwt.getToken()
    }
  }
}

function subToQueue() {
  if (subQueue.length < 1) { return }
  for (let i in subQueue) {
    WEBSOCKET.subscribe(subQueue[i])
  }
  subQueue = []
}

/*
Initialises the socket. Connect to backend
 */
function init() {
  socket = SockJS(config.API_URL + '/ws')
  client = Stomp.over(socket)
  initialised = true
}

export default WEBSOCKET
