
const fnDevices = require('./devices')
const fnBroadcast = require('./broadcast')

exports = module.exports = function(app) {
  app.io.on('connection', (socket) => {
    socket.emit('connection', `connected ${socket.id}`)
    console.log('Socket io connected ', socket.id)
    socket.on('disconnect', () => {
      console.log('Socket io disconnect', socket.id)
    })
    socket.on('getLocations', async () => {
      await fnDevices.get(socket)
    })

    socket.on('broadcastStart', async (locate) => {
      // console.log('Broadcast', obj.channels)
      await fnBroadcast.onair(locate)
      setTimeout(() => {
        fnLocations.get(app.io)
      }, 1000)
      console.log('end onair')
    })

    socket.on('broadcastEnd', async (locate) => {
      await fnBroadcast.offair(locate)
    })
  })
}