self.addEventListener('push', event => {
  let job = event.data.json()
  self.registration.showNotification('Ny mostander funnet!',
    {
      'body': 'Du spiller mot: ' + job.opponent + ' med ' + job.colour + ' brikker!',
      'icon': './notificationIcon.jpg',
      'img': '/public/favicon.ico'
    })
})
