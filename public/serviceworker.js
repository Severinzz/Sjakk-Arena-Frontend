const url = new URL('http://localhost:8081/#/player-lobby', self.location.origin).href

self.addEventListener('push', event => {
  let job = event.data.json()
  let promiseChain = getMatchingWindowClient().then(windowClient => {
    if (windowClient === null || !windowClient.focused) {
      return self.registration.showNotification('Ny mostander funnet!',
        {
          'body': 'Du spiller mot: ' + job.opponent + ' med ' + job.colour + ' brikker!',
          'icon': './notificationIcon.jpg',
          'vibrate': [500] // Not available in Android Oreo or higher.
        })
    }
  })
  event.waitUntil(promiseChain)
})

// adapted from https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
self.addEventListener('notificationclick', event => {
  event.waitUntil(getMatchingWindowClient().then(matchingClient => {
    if (matchingClient) {
      return matchingClient.focus()
    } else {
      return self.clients.openWindow(url)
    }
  }))
})

// adapted from https://developers.google.com/web/fundamentals/push-notifications/common-notification-patterns
async function getMatchingWindowClient() {
  let matchingClient = null
  return self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let i = 0
    while (i < windowClients.length) {
      const windowClient = windowClients[i]
      if (windowClient.url === url) {
        matchingClient = windowClient
      }
      i++
    }
    return matchingClient
  })
}
