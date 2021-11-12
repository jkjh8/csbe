const multicastAddress = '230.185.192.12'
const broadcast = require('api/broadcast')

exports = module.exports = function(app) {
  app.server.on('listening', () => {
    console.log('Multicast listening')
  })

  app.server.on('message', (msg) => {
    try {
      const message = JSON.parse(msg)
      if (message.command === 'end') {
        console.log(message, app.broadcast)
        broadcast.offair(app.broadcast)
      }
      app.io.emit('multicast', message)
    } catch (err) {
      console.error('multicast server recv error - ', err)
      console.log(msg)
    }
  })
  try {
    app.server.bind(12340, function () {
      app.server.setBroadcast(true)
      app.server.setMulticastTTL(128)
      app.server.addMembership(multicastAddress)
    })
  } catch (error) {
    console.error('multicast server bind error - ', err)
  }
}
