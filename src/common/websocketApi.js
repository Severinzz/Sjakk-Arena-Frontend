import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import config from './config'
import jwt from './jwt.storage'

const CONNECTION = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}

let socket = {}
let client = {}
let subscriptions = {}
let initialised = false
let subQueue = []
let connected = CONNECTION.CLOSED

const WEBSOCKET = {
  /*
  Subscribes to the correct endpoint on the backend.
   */
  connect(newSubscription) {
    if (initialised === false) {
      init()
    }
    switch (connected) {
      case CONNECTION.CONNECTING:
        subQueue.push(newSubscription)
        break
      case CONNECTION.OPEN:
        this.subscribe(newSubscription)
        break
      default:
        connected = CONNECTION.CONNECTING
        client.connect(this.setupHeader(), function () {
          connected = CONNECTION.OPEN
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
      connected = CONNECTION.CLOSED
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
  socket = SockJS(config.API_URL + '/wss')
  client = Stomp.over(socket)
  initialised = true
}

export default WEBSOCKET
