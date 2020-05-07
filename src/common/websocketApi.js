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
  /**
   * Connect to the endpoint. Subscribes if it is already connected.
   * @param newSubscription A subscription object containing callback and path that should be subscribed to.
   */
  connect(newSubscription) {
    if (initialised === false) {
      init()
    }
    switch (connected) {
      // Socket is still connecting. Add subscription object to queue.
      case CONNECTION.CONNECTING:
        subQueue.push(newSubscription)
        break
      // Socket is open. Subscribe to the subscription.
      case CONNECTION.OPEN:
        this.subscribe(newSubscription)
        break
      // Socket is closed, open connection and connect to endpoint.
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

  /**
   * Subscribe to websocket endpoint.
   * @param newSubscription Subscription object containing path and callback.
   */
  subscribe(newSubscription) {
    subscriptions[newSubscription.path] = client.subscribe('/user/queue/' + newSubscription.path, newSubscription.callback)
    client.send('/app/' + newSubscription.path, function (msg) {
    })
  },

  /**
   * Unsubscribe from all websocket endpoints.
   */
  unsubscribeAll() {
    for (let tag in subscriptions) {
      subscriptions[tag].unsubscribe()
      delete subscriptions[tag]
    }
  },

  /**
   * Unsubscribe from specific endpoint.
   * @param subscription Subscription object that you want to unsubscribe from.
   */
  unsubscribe(subscription) {
    if (subscriptions[subscription] !== undefined) {
      subscriptions[subscription].unsubscribe()
      delete subscriptions[subscription]
    }
  },

  /**
   * Close websocket connection.
   */
  close() {
    if (typeof socket.close === 'function') {
      socket.close()
      initialised = false
      connected = CONNECTION.CLOSED
    }
  },

  /**
   * Set authorisation header for the websocket.
   * @returns {{jwt: string}} A object containing the jwt.
   */
  setupHeader() {
    return {
      'jwt': jwt.getToken()
    }
  }
}

/**
 * Subscribes all subscriptions in the subscription queue.
 */
function subToQueue() {
  if (subQueue.length < 1) { return }
  for (let i in subQueue) {
    WEBSOCKET.subscribe(subQueue[i])
  }
  subQueue = []
}

/**
 * Initialise socket.
 */
function init() {
  socket = SockJS(config.API_URL + '/ws')
  client = Stomp.over(socket)
  initialised = true
  client.debug = null
}

export default WEBSOCKET
