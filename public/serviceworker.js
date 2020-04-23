// self.addEventListener('install', function (e) {
//   console.log(e)
// })

self.addEventListener('message', function(event) {
  console.log('message')
  console.log(event)
})

self.addEventListener('post', event => {
  console.log('post2')
  console.log(event)
})

self.addEventListener('push', event => {
  console.log(event)
})

self.addEventListener('visibilityChange', e => {
  console.log(e)
})
