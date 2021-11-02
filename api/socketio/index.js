
const fnDevices = require('api/devices')
const fnBroadcast = require('./broadcast')

exports = module.exports = function(app) {
  app.io.on('connection', (socket) => {
    socket.emit('connection', `connected ${socket.id}`)
    console.log('Socket io connected ', socket.id)
    socket.on('disconnect', () => {
      console.log('Socket io disconnect', socket.id)
    })
    socket.on('getDevices', async () => {
      console.log('get Devices')
      await fnDevices.get(socket)
    })

    socket.on('broadcastStart', async (locate) => {
      // console.log('Broadcast', obj.channels)
      await fnBroadcast.onair(locate)
      console.log('end onair')
      const timer = setInterval(async () => { await fnDevices.getMasters(app.io) }, 1000)
      setTimeout(() => { clearInterval(timer) }, 5000)
    })

    socket.on('broadcastEnd', async (locate) => {
      await fnBroadcast.offair(locate)
      const timer = setInterval(async () => { await fnDevices.getMasters(app.io) }, 1000)
      setTimeout(() => { clearInterval(timer) }, 5000)
    })
  })
}